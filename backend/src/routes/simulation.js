
const express = require("express");

const {
  startSimulation,
  stopSimulation,
  setScenario,
  setOperatingMode,
  getSimulationStatus,
} = require("../simulator");

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    success: true,
    ...getSimulationStatus(),
  });
});

router.post("/mode", (req, res) => {
  try {
    const result = setOperatingMode(req.body?.mode);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/start", (req, res) => {
  res.json({
    success: true,
    ...startSimulation(),
  });
});

router.post("/stop", (req, res) => {
  res.json({
    success: true,
    ...stopSimulation(),
  });
});

router.post("/scenario", (req, res) => {
  try {
    const result = setScenario(req.body?.scenario);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
