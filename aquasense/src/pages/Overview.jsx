import { useEffect, useState } from "react";

import {
  Droplets,
  Gauge,
  Wifi,
  Bell,
  ArrowRight,
  Activity,
  ShieldCheck,
  X,
  Clock3,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import StatusBanner from "../components/StatusBanner";
import StatCard from "../components/StatCard";
import FlowChart from "../components/FlowChart";
import PressureChart from "../components/PressureChart";
import { getDashboardSummary } from "../api";

function Overview() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [apiError, setApiError] = useState("");
  const [simulatedPressure, setSimulatedPressure] = useState(2.2);

  // Fetch the latest dashboard data from the backend.
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboardSummary();

        if (!cancelled) {
          setDashboard(data);
          setApiError("");
        }
      } catch (error) {
        if (!cancelled) {
          setApiError(
            error.message || "Unable to connect to AquaSense."
          );
        }
      }
    }

    loadDashboard();

    const intervalId = setInterval(loadDashboard, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const latestReading = dashboard?.latest;
  const todaySummary = dashboard?.today;

  const isSimulated = latestReading?.source === "simulated";
  const isDeviceOnline = latestReading?.sensorStatus === "online";

  const flowRate = Number(latestReading?.flowRateLpm ?? 0);
  const todayUsage = Number(todaySummary?.usageLitres ?? 0);
  const peakFlow = Number(todaySummary?.peakFlowLpm ?? 0);
  const readingCount = Number(todaySummary?.readingCount ?? 0);

  const readingTime = latestReading?.receivedAt
    ? new Date(latestReading.receivedAt)
    : null;

  const lastUpdate = readingTime
    ? `${Math.max(
        0,
        // eslint-disable-next-line react-hooks/purity
        Math.floor((Date.now() - readingTime.getTime()) / 1000)
      )} sec ago`
    : "Waiting for data";

  // Simulate pressure ONLY in demo mode.
  // This is not a physical pressure sensor reading.
  useEffect(() => {
    if (!isSimulated) return;

    const intervalId = setInterval(() => {
      setSimulatedPressure((previous) => {
        const next = previous + (Math.random() - 0.5) * 0.3;
        return Math.min(3.2, Math.max(1.2, next));
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isSimulated]);

  // Simple rule-based insights, not a trained AI model.
  const insight = apiError
    ? {
        type: "warning",
        title: "Backend connection issue",
        message:
          "Dashboard data could not be refreshed. Check that your backend is running on port 3001.",
      }
    : !latestReading
      ? {
          type: "warning",
          title: "Waiting for sensor readings",
          message:
            "No readings are available yet. Start the simulator or connect the NodeMCU flow sensor.",
        }
      : flowRate > 8
        ? {
            type: "warning",
            title: "High flow rate observed",
            message:
              `The current flow is ${flowRate.toFixed(
                2
              )} L/min. Check whether this matches expected water usage.`,
          }
        : {
            type: "normal",
            title: "Flow is within the configured range",
            message:
              "No high-flow condition was detected by this basic rule. This does not guarantee that the pipeline is leak-free.",
          };

  // Demonstration events. Connect these to the real events API later.
  const recentEvents = [
    {
      type: "warning",
      title: "Possible Abnormal Flow",
      time: "Today, 02:14 AM",
      description:
        "Flow remained above the configured threshold during a low-use period.",
      detail:
        "Persistent flow above a configured threshold may deserve investigation. This demonstration event is not a confirmed leak.",
      flow: "1.3 L/min",
      duration: "32 minutes",
      severity: "Attention",
    },
    {
      type: "info",
      title: "High-Flow Observation",
      time: "Yesterday, 11:32 PM",
      description: "Short-duration high flow detected.",
      detail:
        "A brief increase in flow was observed. Verify the reading against actual water usage.",
      flow: "8.7 L/min",
      duration: "4 minutes",
      severity: "Observation",
    },
    {
      type: "normal",
      title: "Normal Operation Resumed",
      time: "Yesterday, 10:05 PM",
      description: "Water flow returned to the normal range.",
      detail:
        "Flow returned to the expected operating range after the previous observation.",
      flow: "2.1 L/min",
      duration: "—",
      severity: "Normal",
    },
  ];

  return (
    <>
      <div className="overview-page">
        {/* PAGE HEADER */}
        <div className="overview-heading">
          <div>
            <h1>Good Morning!</h1>
            <p>Here's your water flow overview for today.</p>
          </div>

          <div className="overview-date">
            <span>Today</span>
            <strong>Residential Zone 01</strong>
          </div>
        </div>

        {/* CONNECTION STATUS */}
        {apiError ? (
          <StatusBanner
            status="warning"
            title="Backend Connection Error"
            message={apiError}
          />
        ) : !latestReading ? (
          <StatusBanner
            status="warning"
            title="Waiting for Sensor Data"
            message="AquaSense is waiting for the backend to provide a reading."
          />
        ) : (
          <StatusBanner
            status={isSimulated || isDeviceOnline ? "normal" : "warning"}
            title={
              isSimulated
                ? "Simulation Mode Active"
                : isDeviceOnline
                  ? "Device Connected"
                  : "Device Offline"
            }
            message={
              isSimulated
                ? "Displaying simulated sensor readings. Physical hardware is not being verified."
                : isDeviceOnline
                  ? "The latest reading was received from the configured device."
                  : "The latest reading reports that the sensor is offline."
            }
          />
        )}

        {isSimulated && !apiError && (
          <p className="simulation-notice">
            Demo mode — flow and pressure values are simulated, not
            measurements from physical hardware.
          </p>
        )}

        {/* STAT CARDS */}
        <div className="overview-stats">
          <StatCard
            icon={Droplets}
            title="Current Flow"
            value={
              latestReading ? `${flowRate.toFixed(2)} L/min` : "Waiting..."
            }
            status={isSimulated ? "Simulated" : latestReading ? "Latest reading" : "No data"}
            statusType={latestReading ? "normal" : "info"}
          />

          {/* Pressure card is shown ONLY in simulation mode. */}
          {isSimulated && (
            <StatCard
              icon={Gauge}
              title="Current Pressure"
              value={`${simulatedPressure.toFixed(2)} bar`}
              status="Simulated — no physical sensor"
              statusType="info"
            />
          )}

          <StatCard
            icon={Gauge}
            title="Today's Usage"
            value={`${todayUsage.toFixed(2)} L`}
            status={isSimulated ? "Simulated usage" : "Recorded usage"}
            statusType="info"
          />

          <StatCard
            icon={Wifi}
            title="Device Status"
            value={
              latestReading
                ? isSimulated
                  ? "Simulation"
                  : isDeviceOnline
                    ? "Connected"
                    : "Offline"
                : "Waiting..."
            }
            status={
              isSimulated
                ? "Simulation source"
                : latestReading
                  ? "Physical source"
                  : "No reading received"
            }
            statusType={latestReading ? "normal" : "info"}
          />

          <StatCard
            icon={Bell}
            title="Active Alerts"
            value="—"
            status="Alert API not connected"
            statusType="info"
          />
        </div>

        {/* GRAPHS */}
        <div
          className={`overview-charts ${
            isSimulated ? "with-pressure" : ""
          }`}
        >
          <FlowChart />

          {/* Pressure graph is hidden in normal/physical mode. */}
          {isSimulated && <PressureChart />}
        </div>

        {/* SMART AI INSIGHTS */}
        <div className="smart-ai-card">
          <div className="smart-ai-heading">
            <div className="smart-ai-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <h3>Smart AI Insights</h3>
              <p>Flow monitoring and rule-based observations</p>
            </div>

            <span className="smart-ai-badge">RULE-BASED</span>
          </div>

          <div
            className={`smart-ai-message ${
              insight.type === "warning" ? "warning" : ""
            }`}
          >
            {insight.type === "warning" ? (
              <AlertTriangle size={21} />
            ) : (
              <CheckCircle2 size={21} />
            )}

            <div>
              <strong>{insight.title}</strong>
              <p>{insight.message}</p>
            </div>
          </div>

          <p className="smart-ai-disclaimer">
            These are rule-based observations, not predictions from a trained
            AI model. A single flow sensor cannot independently confirm or
            locate a leak.
          </p>
        </div>

        {/* RECENT EVENTS */}
        <div className="overview-main-grid">
          <div className="recent-events-card">
            <div className="section-card-header">
              <div>
                <h3>Recent Events</h3>
                <p>Latest activity detected by AquaSense</p>
              </div>

              <button
                className="text-button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("aquasense:navigate", {
                      detail: { page: "events" },
                    })
                  )
                }
              >
                View All
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="events-list">
              {recentEvents.map((event, index) => (
                <button
                  className="overview-event"
                  key={index}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={`event-indicator ${event.type}`}>
                    {event.type === "warning" && <Bell size={15} />}
                    {event.type === "info" && <Activity size={15} />}
                    {event.type === "normal" && <ShieldCheck size={15} />}
                  </div>

                  <div className="event-content">
                    <div className="event-title-row">
                      <strong>{event.title}</strong>
                      <ArrowRight size={14} />
                    </div>

                    <span>{event.time}</span>
                    <p>{event.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="overview-bottom-grid">
          {/* DEVICE SUMMARY */}
          <div className="device-summary-card">
            <div className="section-card-header">
              <div>
                <h3>Device Status</h3>
                <p>AquaSense monitoring device</p>
              </div>

              <div className="online-badge">
                <span></span>
                {latestReading
                  ? isSimulated
                    ? "Simulated"
                    : isDeviceOnline
                      ? "Online"
                      : "Offline"
                  : "Waiting"}
              </div>
            </div>

            <div className="device-summary-body">
              <div className="device-summary-icon">
                <Activity size={27} />
              </div>

              <div className="device-main-info">
                <strong>{dashboard?.deviceId || "aquasense-01"}</strong>
                <span>Residential Zone 01</span>
              </div>
            </div>

            <div className="device-metrics">
              <div>
                <span>Wi-Fi</span>
                <strong>
                  {latestReading?.rssi != null
                    ? `${latestReading.rssi} dBm`
                    : "Unavailable"}
                </strong>
              </div>

              <div>
                <span>Sensor</span>
                <strong>{latestReading?.sensorStatus || "Unknown"}</strong>
              </div>

              <div>
                <span>Last Update</span>
                <strong>{lastUpdate}</strong>
              </div>
            </div>

            <button
              className="device-link"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("aquasense:navigate", {
                    detail: { page: "device-health" },
                  })
                )
              }
            >
              View Device Health
              <ArrowRight size={15} />
            </button>
          </div>

          {/* TODAY'S SUMMARY */}
          <div className="quick-summary-card">
            <div className="section-card-header">
              <div>
                <h3>Today's Summary</h3>
                <p>Water activity overview</p>
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <Droplets size={19} />
                <div>
                  <span>Total Volume</span>
                  <strong>{todayUsage.toFixed(2)} L</strong>
                </div>
              </div>

              <div className="summary-item">
                <Gauge size={19} />
                <div>
                  <span>Average Flow</span>
                  <strong>
                    {readingCount > 0
                      ? `${(todayUsage / (readingCount * 2 / 60)).toFixed(2)} L/min`
                      : "—"}
                  </strong>
                </div>
              </div>

              <div className="summary-item">
                <Activity size={19} />
                <div>
                  <span>Peak Flow</span>
                  <strong>{peakFlow.toFixed(2)} L/min</strong>
                </div>
              </div>

              <div className="summary-item">
                <Bell size={19} />
                <div>
                  <span>Total Readings</span>
                  <strong>{readingCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div
          className="event-modal-overlay"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="event-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-modal-header">
              <div>
                <span className={`modal-status ${selectedEvent.type}`}>
                  {selectedEvent.severity}
                </span>

                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.time}</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="modal-description">
              {selectedEvent.detail}
            </div>

            <div className="modal-metrics">
              <div>
                <span>Observed Flow</span>
                <strong>{selectedEvent.flow}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{selectedEvent.duration}</strong>
              </div>

              <div>
                <span>Event Time</span>
                <strong>
                  <Clock3 size={14} />
                  {selectedEvent.time.split(",")[1] || selectedEvent.time}
                </strong>
              </div>
            </div>

            <div className="modal-note">
              <ShieldCheck size={18} />
              <p>
                AquaSense identifies unusual flow patterns. This
                demonstration event does not independently confirm or locate
                a physical leak.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-action"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>

              <button
                className="primary-action"
                onClick={() => setSelectedEvent(null)}
              >
                Mark as Reviewed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Overview;