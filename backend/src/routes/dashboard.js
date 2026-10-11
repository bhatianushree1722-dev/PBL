
const express = require("express");
const db = require("../database");
const { getSimulationStatus } = require("../simulator");

const router = express.Router();

router.get("/summary", (req, res) => {
  try {
    const deviceId = "aquasense-01";

    // Determine which data source the dashboard should display.
    const simulationStatus = getSimulationStatus();
    const mode = simulationStatus.mode;
    const activeSource = mode === "simulator" ? "simulated" : "physical";

    // Get the latest reading from the active source only.
    const latest = db
      .prepare(`
        SELECT *
        FROM readings
        WHERE deviceId = ?
          AND source = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .get(deviceId, activeSource) || null;

    // Calculate today's statistics using the active source only.
    const today = db
      .prepare(`
        SELECT
          COALESCE(
            SUM(flowRateLpm * intervalMs / 60000.0),
            0
          ) AS usageLitres,
          COALESCE(MAX(flowRateLpm), 0) AS peakFlowLpm,
          COUNT(*) AS readingCount
        FROM readings
        WHERE deviceId = ?
          AND date(receivedAt) = date('now', 'localtime')
          AND source = ?
      `)
      .get(deviceId, activeSource);

    // Return recent readings from the active source only.
    const recentReadings = db
      .prepare(`
        SELECT
          id,
          flowRateLpm,
          pressureBar,
          pressureMode,
          source,
          receivedAt
        FROM readings
        WHERE deviceId = ?
          AND source = ?
        ORDER BY id DESC
        LIMIT 20
      `)
      .all(deviceId, activeSource);

    res.json({
      success: true,
      deviceId,
      mode,
      source: activeSource,
      latest,
      today: {
        usageLitres: Number(today.usageLitres.toFixed(2)),
        peakFlowLpm: Number(today.peakFlowLpm.toFixed(2)),
        readingCount: today.readingCount,
      },
      recentReadings,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary.",
    });
  }
});

module.exports = router;
