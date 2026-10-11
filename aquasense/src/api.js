
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The API request failed.");
  }

  return data;
}

export async function getLatestReading(deviceId = "aquasense-01") {
  const data = await requestJson(
    `${API_BASE_URL}/api/readings/latest/${encodeURIComponent(deviceId)}`
  );

  return data.reading;
}

export async function getReadings(limit = 100) {
  const data = await requestJson(
    `${API_BASE_URL}/api/readings?limit=${limit}`
  );

  return data.readings;
}

export async function getDashboardSummary() {
  return requestJson(`${API_BASE_URL}/api/dashboard/summary`);
}

export async function getOperatingMode() {
  return requestJson(`${API_BASE_URL}/api/simulation/status`);
}

export async function setOperatingMode(mode) {
  return requestJson(`${API_BASE_URL}/api/simulation/mode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  });
}
