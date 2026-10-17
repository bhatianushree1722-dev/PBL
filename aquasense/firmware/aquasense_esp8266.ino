
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// Configure these locally before uploading to your board.
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Replace with the computer running the backend's LAN IP.
// Example: http://192.168.1.10:3001/api/readings
const char* API_URL = "http://YOUR_COMPUTER_IP:3001/api/readings";

const char* DEVICE_ID = "aquasense-01";
const uint8_t FLOW_SENSOR_PIN = D2;

// Verify the calibration factor against your exact sensor.
const float PULSES_PER_LITRE = 450.0;
const unsigned long INTERVAL_MS = 2000;

volatile unsigned long pulseCount = 0;
unsigned long lastReadingMs = 0;
float totalLitres = 0.0;

void IRAM_ATTR countPulse() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN),
                  countPulse, FALLING);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected. ESP8266 IP: ");
  Serial.println(WiFi.localIP());

  lastReadingMs = millis();
}

void loop() {
  if (millis() - lastReadingMs < INTERVAL_MS) {
    delay(10);
    return;
  }

  unsigned long now = millis();
  unsigned long elapsed = now - lastReadingMs;
  lastReadingMs = now;

  noInterrupts();
  unsigned long pulses = pulseCount;
  pulseCount = 0;
  interrupts();

  float litres = pulses / PULSES_PER_LITRE;
  float flowRateLpm = litres * 60000.0 / elapsed;
  totalLitres += litres;

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    if (http.begin(client, API_URL)) {
      http.addHeader("Content-Type", "application/json");

      String payload = "{";
      payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
      payload += "\"flowRateLpm\":" + String(flowRateLpm, 3) + ",";
      payload += "\"pulseCount\":" + String(pulses) + ",";
      payload += "\"intervalMs\":" + String(elapsed) + ",";
      payload += "\"totalLitres\":" + String(totalLitres, 3) + ",";
      payload += "\"uptimeMs\":" + String(now) + ",";
      payload += "\"rssi\":" + String(WiFi.RSSI()) + ",";
      payload += "\"sensorStatus\":\"online\"";
      payload += "}";

      int status = http.POST(payload);
      Serial.printf("API HTTP status: %d\n", status);
      http.end();
    }
  } else {
    Serial.println("Wi-Fi disconnected; reading not sent.");
  }

  Serial.printf("Flow: %.3f L/min | Total: %.3f L\n",
                flowRateLpm, totalLitres);
}
