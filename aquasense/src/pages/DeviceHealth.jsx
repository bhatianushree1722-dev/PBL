import { useState } from "react";
import {
  Cpu,
  Wifi,
  BatteryCharging,
  RefreshCw,
  CheckCircle2,
  Thermometer,
  Radio,
  Clock3,
  Activity,
  ShieldCheck,
  Server,
  Signal,
  Zap,
} from "lucide-react";

function DeviceHealth() {
  const [lastSync, setLastSync] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setLastSync(new Date());
      setRefreshing(false);
    }, 700);
  };

  const formattedSyncTime = lastSync.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="page-container device-health-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            <Cpu size={13} />
            DEVICE STATUS
          </div>

          <h1>Device Health</h1>

          <p>
            Monitor the connection and operational status of your
            AquaSense device.
          </p>
        </div>

        <button
          className={`refresh-button ${
            refreshing ? "refreshing" : ""
          }`}
          onClick={handleRefresh}
        >
          <RefreshCw size={17} />
          {refreshing ? "Checking..." : "Check Status"}
        </button>

      </div>

      {/* MAIN DEVICE STATUS */}

      <div className="device-health-hero">

        <div className="device-health-hero-left">

          <div className="device-health-main-icon">
            <Cpu size={30} />
          </div>

          <div>

            <div className="device-health-name-row">

              <h2>AquaSense Unit 01</h2>

              <span className="device-online-badge">
                <span></span>
                Online
              </span>

            </div>

            <p>
              Residential Zone 01 • Smart Water Monitoring Device
            </p>

            <div className="device-health-sync">
              <Clock3 size={13} />
              Last synchronized at {formattedSyncTime}
            </div>

          </div>

        </div>

        <div className="device-health-hero-right">

          <div>
            <span>Overall Health</span>

            <strong>Good</strong>
          </div>

          <div className="health-score-ring">
            <span>96</span>
            <small>%</small>
          </div>

        </div>

      </div>

      {/* HEALTH METRICS */}

      <div className="device-health-grid">

        <div className="health-metric-card">

          <div className="health-metric-icon green">
            <Wifi size={21} />
          </div>

          <div>
            <span>Connection</span>

            <strong>Online</strong>

            <p>
              Stable Wi-Fi connection
            </p>
          </div>

          <CheckCircle2 className="health-check" size={17} />

        </div>

        <div className="health-metric-card">

          <div className="health-metric-icon blue">
            <Signal size={21} />
          </div>

          <div>
            <span>Signal Strength</span>

            <strong>Excellent</strong>

            <p>
              -48 dBm
            </p>
          </div>

          <CheckCircle2 className="health-check" size={17} />

        </div>

        <div className="health-metric-card">

          <div className="health-metric-icon orange">
            <BatteryCharging size={21} />
          </div>

          <div>
            <span>Power Status</span>

            <strong>Stable</strong>

            <p>
              USB power connected
            </p>
          </div>

          <CheckCircle2 className="health-check" size={17} />

        </div>

        <div className="health-metric-card">

          <div className="health-metric-icon purple">
            <Activity size={21} />
          </div>

          <div>
            <span>Sensor Activity</span>

            <strong>Active</strong>

            <p>
              Receiving flow readings
            </p>
          </div>

          <CheckCircle2 className="health-check" size={17} />

        </div>

      </div>

      {/* LOWER GRID */}

      <div className="device-health-lower-grid">

        {/* DEVICE INFORMATION */}

        <div className="device-health-panel">

          <div className="health-panel-header">

            <div>
              <h3>Device Information</h3>

              <p>
                Hardware and software details
              </p>
            </div>

            <Server size={19} />

          </div>

          <div className="device-info-table">

            <div className="device-health-row">
              <span>Device Name</span>
              <strong>AquaSense Unit 01</strong>
            </div>

            <div className="device-health-row">
              <span>Controller</span>
              <strong>ESP32</strong>
            </div>

            <div className="device-health-row">
              <span>Firmware</span>
              <strong>v1.0.0</strong>
            </div>

            <div className="device-health-row">
              <span>Device ID</span>
              <strong>AS-ESP32-001</strong>
            </div>

            <div className="device-health-row">
              <span>Location</span>
              <strong>Residential Zone 01</strong>
            </div>

            <div className="device-health-row">
              <span>Network</span>
              <strong>AquaSense-WiFi</strong>
            </div>

          </div>

        </div>

        {/* DIAGNOSTICS */}

        <div className="device-health-panel">

          <div className="health-panel-header">

            <div>
              <h3>System Diagnostics</h3>

              <p>
                Current device checks
              </p>
            </div>

            <ShieldCheck size={19} />

          </div>

          <div className="diagnostics-list">

            <div className="diagnostic-row">

              <div className="diagnostic-icon green">
                <Wifi size={15} />
              </div>

              <div>
                <strong>Network Connection</strong>
                <span>Connected and stable</span>
              </div>

              <CheckCircle2 size={16} />

            </div>

            <div className="diagnostic-row">

              <div className="diagnostic-icon green">
                <Radio size={15} />
              </div>

              <div>
                <strong>Flow Sensor</strong>
                <span>Receiving data normally</span>
              </div>

              <CheckCircle2 size={16} />

            </div>

            <div className="diagnostic-row">

              <div className="diagnostic-icon green">
                <Zap size={15} />
              </div>

              <div>
                <strong>Power Supply</strong>
                <span>Operating normally</span>
              </div>

              <CheckCircle2 size={16} />

            </div>

            <div className="diagnostic-row">

              <div className="diagnostic-icon green">
                <Server size={15} />
              </div>

              <div>
                <strong>Backend Sync</strong>
                <span>Last sync successful</span>
              </div>

              <CheckCircle2 size={16} />

            </div>

          </div>

        </div>

      </div>

      {/* PERFORMANCE */}

      <div className="device-health-performance">

        <div className="health-panel-header">

          <div>
            <h3>Device Performance</h3>

            <p>
              Current operating measurements
            </p>
          </div>

          <Activity size={19} />

        </div>

        <div className="performance-grid">

          <div className="performance-item">

            <div className="performance-item-top">
              <span>Uptime</span>
              <Clock3 size={15} />
            </div>

            <strong>12d 08h 42m</strong>

            <div className="performance-bar">
              <span style={{ width: "94%" }}></span>
            </div>

            <small>
              Stable operation
            </small>

          </div>

          <div className="performance-item">

            <div className="performance-item-top">
              <span>CPU Activity</span>
              <Cpu size={15} />
            </div>

            <strong>23%</strong>

            <div className="performance-bar">
              <span style={{ width: "23%" }}></span>
            </div>

            <small>
              Normal workload
            </small>

          </div>

          <div className="performance-item">

            <div className="performance-item-top">
              <span>Sensor Temperature</span>
              <Thermometer size={15} />
            </div>

            <strong>31.4°C</strong>

            <div className="performance-bar">
              <span style={{ width: "42%" }}></span>
            </div>

            <small>
              Within normal range
            </small>

          </div>

          <div className="performance-item">

            <div className="performance-item-top">
              <span>Data Transmission</span>
              <Radio size={15} />
            </div>

            <strong>99.2%</strong>

            <div className="performance-bar">
              <span style={{ width: "99.2%" }}></span>
            </div>

            <small>
              Successful readings
            </small>

          </div>

        </div>

      </div>

      {/* MAINTENANCE */}

      <div className="maintenance-card">

        <div className="maintenance-icon">
          <ShieldCheck size={21} />
        </div>

        <div className="maintenance-content">

          <strong>
            Device is operating normally
          </strong>

          <p>
            No immediate maintenance action is required.
            Keep the device connected to power and Wi-Fi
            for continuous monitoring.
          </p>

        </div>

        <div className="maintenance-status">
          All checks passed
        </div>

      </div>

    </div>
  );
}

export default DeviceHealth;