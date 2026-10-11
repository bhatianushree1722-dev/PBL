const readingsRouter = require("./routes/readings");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const dashboardRouter = require("./routes/dashboard");
// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/readings", readingsRouter);
const simulationRouter = require("./routes/simulation");
app.use("/api/simulation", simulationRouter);
app.use("/api/dashboard", dashboardRouter);
// Basic API route
app.get("/", (req, res) => {
  res.json({
    name: "AquaSense API",
    status: "running",
    message: "Water monitoring backend is ready",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AquaSense API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
