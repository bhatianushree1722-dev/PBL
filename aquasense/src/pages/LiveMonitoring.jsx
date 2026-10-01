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

function LiveMonitoring() {
  const [flowRate, setFlowRate] = useState(4.2);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const readings = [
    { time: "10:00:00", flow: "4.2", status: "Normal" },
    { time: "09:59:00", flow: "4.0", status: "Normal" },
    { time: "09:58:00", flow: "4.4", status: "Normal" },
    { time: "09:57:00", flow: "4.1", status: "Normal" },
    { time: "09:56:00", flow: "4.3", status: "Normal" },
    { time: "09:55:00", flow: "3.9", status: "Normal" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowRate((previous) => {
        const variation = (Math.random() - 0.5) * 0.6;
        return Math.max(0, Number((previous + variation).toFixed(1)));
      });

      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setFlowRate(Number((3.8 + Math.random() * 1.2).toFixed(1)));
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 700);
  };

  const formattedTime = lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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
          className={`refresh-button ${refreshing ? "refreshing" : ""}`}
          onClick={handleRefresh}
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
            <strong>Device Connected</strong>
            <span>AquaSense Unit • Residential Zone 01</span>
          </div>
        </div>

        <div className="connection-right">
          <span className="connection-status">
            <span></span>
            Online
          </span>

          <span className="updated-time">
            Updated {formattedTime}
          </span>
        </div>
      </div>

      {/* LIVE METRICS */}
      <div className="live-metrics-grid">

        <div className="live-metric-card primary">
          <div className="live-metric-icon">
            <Activity size={22} />
          </div>

          <div className="live-metric-content">
            <span>Current Flow Rate</span>

            <div className="metric-number">
              {flowRate}
              <small>L/min</small>
            </div>

            <div className="metric-status normal">
              <CircleCheck size={14} />
              Normal activity
            </div>
          </div>

          <div className="metric-live-label">
            LIVE
          </div>
        </div>

        <div className="live-metric-card">
          <div className="live-metric-icon blue">
            <Droplets size={22} />
          </div>

          <div className="live-metric-content">
            <span>Today's Usage</span>

            <div className="metric-number">
              186
              <small>L</small>
            </div>

            <div className="metric-subtext">
              Across all recorded activity
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
              10.1
              <small>L/min</small>
            </div>

            <div className="metric-subtext">
              Highest observed flow
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
              Stable
            </div>

            <div className="metric-subtext">
              No abnormal flow detected
            </div>
          </div>
        </div>

      </div>

      {/* LIVE CHART */}
      <div className="live-chart-section">
        <FlowChart
          title="Live Water Flow"
          subtitle="Real-time flow activity from your AquaSense device."
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
              Normal
            </span>
          </div>

          <div className="activity-main">
            <div className="activity-icon">
              <Droplets size={25} />
            </div>

            <div>
              <strong>Water is currently flowing</strong>
              <p>
                Flow activity is within the expected operating range.
              </p>
            </div>
          </div>

          <div className="activity-details">

            <div>
              <span>Current flow</span>
              <strong>{flowRate} L/min</strong>
            </div>

            <div>
              <span>Observation</span>
              <strong>Normal</strong>
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
              <strong>AquaSense Unit 01</strong>
            </div>

            <div className="device-info-row">
              <span>Location</span>
              <strong>Residential Zone 01</strong>
            </div>

            <div className="device-info-row">
              <span>Connection</span>
              <strong className="online-text">
                <span></span>
                Online
              </strong>
            </div>

            <div className="device-info-row">
              <span>Signal strength</span>
              <strong>Excellent</strong>
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
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((reading, index) => (
                <tr key={index}>

                  <td>{reading.time}</td>

                  <td>
                    <strong>{reading.flow}</strong> L/min
                  </td>

                  <td>
                    <span className="reading-status">
                      <span></span>
                      {reading.status}
                    </span>
                  </td>

                </tr>
              ))}
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
            physical leak.
          </p>
        </div>
      </div>

    </div>
  );
}

export default LiveMonitoring;