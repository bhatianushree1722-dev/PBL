
const Database = require("better-sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "..", "aquasense.db");
const db = new Database(databasePath);

// Create a table for sensor readings
db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deviceId TEXT NOT NULL,
    flowRateLpm REAL NOT NULL,
    pulseCount INTEGER DEFAULT 0,
    intervalMs INTEGER,
    totalLitres REAL,
    uptimeMs INTEGER,
    rssi INTEGER,
    sensorStatus TEXT DEFAULT 'online',
    receivedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("AquaSense database initialized.");

const existingColumns = db
  .prepare("PRAGMA table_info(readings)")
  .all()
  .map((column) => column.name);

if (!existingColumns.includes("source")) {
  db.exec(`
    ALTER TABLE readings
    ADD COLUMN source TEXT NOT NULL DEFAULT 'physical'
  `);
}

if (!existingColumns.includes("pressureBar")) {
  db.exec(`
    ALTER TABLE readings
    ADD COLUMN pressureBar REAL
  `);
}

if (!existingColumns.includes("pressureMode")) {
  db.exec(`
    ALTER TABLE readings
    ADD COLUMN pressureMode TEXT NOT NULL DEFAULT 'simulated'
  `);
}

module.exports = db;
