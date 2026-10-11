
const express = require("express");
const db = require("../database");

const router = express.Router();

const insertReading = db.prepare(`
  INSERT INTO readings (
    deviceId,
    flowRateLpm,
    pulseCount,
    intervalMs,
    totalLitres,
    uptimeMs,
    rssi,
    sensorStatus
  )
  VALUES (
    @deviceId,
    @flowRateLpm,
    @pulseCount,
    @intervalMs,
    @totalLitres,
    @uptimeMs,
    @rssi,
    @sensorStatus
  )
`);

// Receive a sensor reading
router.post("/", (req, res) => {
  const {
    deviceId,
    flowRateLpm,
    pulseCount = 0,
    intervalMs = null,
    totalLitres = null,
    uptimeMs = null,
    rssi = null,
    sensorStatus = "online",
  } = req.body;

  if (
    typeof deviceId !== "string" ||
    deviceId.trim() === "" ||
    typeof flowRateLpm !== "number" ||
    !Number.isFinite(flowRateLpm) ||
    flowRateLpm < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid deviceId and non-negative flowRateLpm are required.",
    });
  }

  try {
    const result = insertReading.run({
      deviceId: deviceId.trim(),
      flowRateLpm,
      pulseCount,
      intervalMs,
      totalLitres,
      uptimeMs,
      rssi,
      sensorStatus,
    });

    res.status(201).json({
      success: true,
      message: "Reading saved successfully.",
      readingId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Failed to save reading:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save sensor reading.",
    });
  }
});

// Retrieve recent readings
router.get("/", (req, res) => {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 500)
    : 100;

  const readings = db.prepare(`
    SELECT *
    FROM readings
    ORDER BY id DESC
    LIMIT ?
  `).all(limit);

  res.json({
    success: true,
    count: readings.length,
    readings,
  });
});

// Retrieve the latest reading for a device
router.get("/latest/:deviceId", (req, res) => {
  const reading = db.prepare(`
    SELECT *
    FROM readings
    WHERE deviceId = ?
    ORDER BY id DESC
    LIMIT 1
  `).get(req.params.deviceId);

  if (!reading) {
    return res.status(404).json({
      success: false,
      message: "No readings found for this device.",
    });
  }

  res.json({
    success: true,
    reading,
  });
});

module.exports = router;
