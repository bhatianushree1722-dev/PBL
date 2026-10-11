
import { useEffect, useState } from "react";
import {
  Activity,
  Droplets,
  Gauge,
  RefreshCw,
  Wifi,
  Clock3,
  TrendingUp,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

import FlowChart from "../components/FlowChart";
import { getReadings, getDashboardSummary } from "../api";

function formatTime(value) {
  if (!value) return "Waiting for data";

  const normalized = String(value).replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function LiveMonitoring() {
  const [readings, setReadings] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadMonitoringData() {
    try {
      const [readingResult, summaryResult] = await Promise.all([
        getReadings(100),
        getDashboardSummary(),
      ]);

      setReadings(
        Array.isArray(readingResult) ? readingResult : []
      );
      setDashboard(summaryResult);
      setLastUpdated(new Date());
      setApiError("");
    } catch (error) {
      setApiError(
        error.message || "Unable to connect to AquaSense backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function refreshData() {
      try {
        const [readingResult, summaryResult] = await Promise.all([
          getReadings(100),
          getDashboardSummary(),
        ]);

        if (!cancelled) {
          setReadings(
            Array.isArray(readingResult) ? readingResult : []
          );
          setDashboard(summaryResult);
          setLastUpdated(new Date());
          setApiError("");
        }
      } catch (error) {
        if (!cancelled) {
          setApiError(
            error.message || "Unable to connect to AquaSense backend."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    refreshData();

    const intervalId = setInterval(refreshData, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const latest = dashboard?.latest;
  const today = dashboard?.today;

  const flowRate = Number(latest?.flowRateLpm ?? 0);
  const todayUsage = Number(today?.usageLitres ?? 0);
  const peakFlow = Number(today?.peakFlowLpm ?? 0);

  const isSimulated = latest?.source === "simulated";
  const isOnline = latest?.sensorStatus === "online";

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Waiting for data";

  const recentReadings = readings.slice(0, 6);

  const activityStatus = !latest
    ? "Waiting"
    : !isOnline
      ? "Offline"
      : flowRate === 0
        ? "No flow"
        : flowRate > 5
          ? "High flow"
          : "Flow detected";

  const activityDescription = !latest
    ? "Waiting for the first sensor reading."
    : !isOnline
      ? "The latest reading reports that the sensor is offline."
      : flowRate === 0
        ? "No water flow is reported by the latest reading."
        : flowRate > 5
          ? "Flow is elevated. Review this reading if it is unexpected."
          : "AquaSense is receiving water-flow readings.";

  const signalStrength =
    latest?.rssi == null
      ? "Unavailable"
      : `${latest.rssi} dBm`;

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitoringData();
  };

  return (
    <div className="page-container live-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="live-dot"></span>
            LIVE MONITORING
          </div>

          <h1>Live Monitoring</h1>

          <p>
            Monitor current water flow activity from your AquaSense device.
          </p>
        </div>

        <button
          className={`refresh-button ${
            refreshing ? "refreshing" : ""
          }`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={17} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* CONNECTION STATUS */}
      <div className="live-connection-card">
        <div className="connection-left">
          <div className="connection-icon">
            <Wifi size={21} />
          </div>

          <div>
            <strong>
              {apiError
                ? "Backend Connection Error"
                : !latest
                  ? "Waiting for Readings"
                  : isSimulated
                    ? "Simulation Connected"
                    : isOnline
                      ? "Device Connected"
                      : "Device Offline"}
            </strong>

            <span>
              AquaSense Unit • Residential Zone 01
            </span>
          </div>
        </div>

        <div className="connection-right">
          <span className="connection-status">
            <span></span>
            {apiError
              ? "Error"
              : !latest
                ? "Waiting"
                : isSimulated
                  ? "Simulated"
                  : isOnline
                    ? "Online"
                    : "Offline"}
          </span>

          <span className="updated-time">
            Updated {formattedTime}
          </span>
        </div>
      </div>

      {isSimulated && (
        <p className="simulation-notice">
          Demo mode — readings are simulated, not measurements from
          physical hardware.
        </p>
      )}

      {apiError && (
        <p className="simulation-notice">
          {apiError}
        </p>
      )}

      {/* LIVE METRICS */}
      <div className="live-metrics-grid">
        <div className="live-metric-card primary">
          <div className="live-metric-icon">
            <Activity size={22} />
          </div>

          <div className="live-metric-content">
            <span>Current Flow Rate</span>

            <div className="metric-number">
              {latest ? flowRate.toFixed(2) : "—"}
              <small>L/min</small>
            </div>

            <div className="metric-status normal">
              <CircleCheck size={14} />
              {isSimulated ? "Simulated reading" : activityStatus}
            </div>
          </div>

          <div className="metric-live-label">
            {latest ? "LIVE" : "WAITING"}
          </div>
        </div>

        <div className="live-metric-card">
          <div className="live-metric-icon blue">
            <Droplets size={22} />
          </div>

          <div className="live-metric-content">
            <span>Today's Usage</span>

            <div className="metric-number">
              {todayUsage.toFixed(2)}
              <small>L</small>
            </div>

            <div className="metric-subtext">
              Backend usage summary
            </div>
          </div>
        </div>

        <div className="live-metric-card">
          <div className="live-metric-icon orange">
            <Gauge size={22} />
          </div>

          <div className="live-metric-content">
            <span>Peak Flow Today</span>

            <div className="metric-number">
              {peakFlow.toFixed(2)}
              <small>L/min</small>
            </div>

            <div className="metric-subtext">
              Highest recorded flow
            </div>
          </div>
        </div>

        <div className="live-metric-card">
          <div className="live-metric-icon green">
            <TrendingUp size={22} />
          </div>

          <div className="live-metric-content">
            <span>System State</span>

            <div className="system-state">
              <span className="state-dot"></span>
              {activityStatus}
            </div>

            <div className="metric-subtext">
              {latest ? "Based on latest reading" : "No data yet"}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE CHART */}
      <div className="live-chart-section">
        <FlowChart
          title="Live Water Flow"
          subtitle="Flow measurements recorded by the AquaSense backend."
        />
      </div>

      {/* LOWER SECTION */}
      <div className="live-bottom-grid">
        {/* CURRENT ACTIVITY */}
        <div className="live-panel">
          <div className="panel-header">
            <div>
              <h3>Current Activity</h3>
              <p>Latest system observation</p>
            </div>

            <span className="panel-status normal">
              <CircleCheck size={14} />
              {activityStatus}
            </span>
          </div>

          <div className="activity-main">
            <div className="activity-icon">
              <Droplets size={25} />
            </div>

            <div>
              <strong>
                {!latest
                  ? "Waiting for sensor data"
                  : flowRate > 0
                    ? "Water flow reported"
                    : "No water flow reported"}
              </strong>

              <p>{activityDescription}</p>
            </div>
          </div>

          <div className="activity-details">
            <div>
              <span>Current flow</span>
              <strong>
                {latest ? `${flowRate.toFixed(2)} L/min` : "—"}
              </strong>
            </div>

            <div>
              <span>Observation</span>
              <strong>{activityStatus}</strong>
            </div>

            <div>
              <span>Last update</span>
              <strong>{formattedTime}</strong>
            </div>
          </div>
        </div>

        {/* DEVICE INFO */}
        <div className="live-panel">
          <div className="panel-header">
            <div>
              <h3>Device Information</h3>
              <p>Connection and monitoring details</p>
            </div>

            <Wifi size={20} className="device-online-icon" />
          </div>

          <div className="device-info-list">
            <div className="device-info-row">
              <span>Device</span>
              <strong>
                {dashboard?.deviceId || "aquasense-01"}
              </strong>
            </div>

            <div className="device-info-row">
              <span>Location</span>
              <strong>Residential Zone 01</strong>
            </div>

            <div className="device-info-row">
              <span>Connection</span>
              <strong className="online-text">
                <span></span>
                {latest
                  ? isSimulated
                    ? "Simulation"
                    : isOnline
                      ? "Online"
                      : "Offline"
                  : "Waiting"}
              </strong>
            </div>

            <div className="device-info-row">
              <span>Signal strength</span>
              <strong>{signalStrength}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT READINGS */}
      <div className="readings-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Readings</h3>
            <p>Latest flow measurements received by the system.</p>
          </div>

          <Clock3 size={20} />
        </div>

        <div className="readings-table-wrapper">
          <table className="readings-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Flow Rate</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && recentReadings.length === 0 ? (
                <tr>
                  <td colSpan="4">Loading readings...</td>
                </tr>
              ) : recentReadings.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    No readings received yet.
                  </td>
                </tr>
              ) : (
                recentReadings.map((reading) => (
                  <tr key={reading.id}>
                    <td>{formatTime(reading.receivedAt)}</td>

                    <td>
                      <strong>
                        {Number(reading.flowRateLpm).toFixed(2)}
                      </strong>{" "}
                      L/min
                    </td>

                    <td>
                      {reading.source === "simulated"
                        ? "Simulated"
                        : "Physical"}
                    </td>

                    <td>
                      <span className="reading-status">
                        <span></span>
                        {reading.sensorStatus || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INFORMATION NOTE */}
      <div className="monitoring-note">
        <div className="monitoring-note-icon">
          <AlertTriangle size={18} />
        </div>

        <div>
          <strong>About abnormal flow detection</strong>
          <p>
            AquaSense identifies unusual water-flow patterns for review.
            An observation does not independently confirm or locate a
            physical leak. Pressure readings, if present, may also be
            simulated.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiveMonitoring;
