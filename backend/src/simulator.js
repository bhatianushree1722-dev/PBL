
const db = require("./database");

let timer = null;
let flowRate = 2.4;
let totalLitres = 0;
let pulseCount = 0;
let scenario = "normal";
let operatingMode = "normal";

const INTERVAL_MS = 2000;
const PULSES_PER_LITRE = 450;

const insertReading = db.prepare(`
  INSERT INTO readings (
    deviceId,
    flowRateLpm,
    pulseCount,
    intervalMs,
    totalLitres,
    uptimeMs,
    rssi,
    sensorStatus,
    source,
    pressureBar,
    pressureMode
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function generateReading() {
  if (operatingMode !== "simulator") return;

  if (scenario === "high-flow") {
    flowRate = 8 + Math.random() * 2;
  } else if (scenario === "leak") {
    flowRate = 6 + Math.random() * 3;
  } else if (scenario === "no-flow") {
    flowRate = 0;
  } else {
    flowRate = Math.max(
      0,
      Math.min(5, flowRate + (Math.random() - 0.5) * 0.6)
    );
  }

  const litresThisInterval = flowRate * INTERVAL_MS / 60000;

  totalLitres += litresThisInterval;
  pulseCount += Math.round(litresThisInterval * PULSES_PER_LITRE);

  const pressureBar = Math.max(
    0.5,
    2.5 - flowRate * 0.08 + (Math.random() - 0.5) * 0.1
  );

  insertReading.run(
    "aquasense-01",
    Number(flowRate.toFixed(2)),
    pulseCount,
    INTERVAL_MS,
    Number(totalLitres.toFixed(3)),
    Math.round(process.uptime() * 1000),
    -55,
    "online",
    "simulated",
    Number(pressureBar.toFixed(2)),
    "simulated"
  );
}

function startSimulation() {
  operatingMode = "simulator";

  if (timer) {
    return {
      running: true,
      mode: operatingMode,
      scenario,
      message: "Simulation is already running.",
    };
  }

  generateReading();
  timer = setInterval(generateReading, INTERVAL_MS);

  return {
    running: true,
    mode: operatingMode,
    scenario,
  };
}

function stopSimulation() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  operatingMode = "normal";

  return {
    running: false,
    mode: operatingMode,
    scenario,
  };
}

function setOperatingMode(nextMode) {
  if (!["normal", "simulator"].includes(nextMode)) {
    throw new Error("Mode must be normal or simulator.");
  }

  if (nextMode === "simulator") {
    return startSimulation();
  }

  return stopSimulation();
}

function setScenario(nextScenario) {
  const allowedScenarios = [
    "normal",
    "high-flow",
    "leak",
    "no-flow",
  ];

  if (!allowedScenarios.includes(nextScenario)) {
    throw new Error("Invalid simulation scenario.");
  }

  scenario = nextScenario;

  return {
    scenario,
    mode: operatingMode,
  };
}

function getSimulationStatus() {
  return {
    running: Boolean(timer),
    scenario,
    mode: operatingMode,
  };
}

module.exports = {
  startSimulation,
  stopSimulation,
  setScenario,
  setOperatingMode,
  getSimulationStatus,
};
