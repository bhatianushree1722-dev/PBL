import { useState } from "react";

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
} from "lucide-react";

import StatusBanner from "../components/StatusBanner";
import StatCard from "../components/StatCard";
import FlowChart from "../components/FlowChart";

function Overview() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const recentEvents = [
    {
      type: "warning",
      title: "Possible Abnormal Flow",
      time: "Today, 02:14 AM",
      description:
        "Flow remained above the reliable threshold during a low-use period.",
      detail:
        "AquaSense detected persistent water flow above the configured minimum reliable flow threshold.",
      flow: "1.3 L/min",
      duration: "32 minutes",
      severity: "Attention",
    },

    {
      type: "info",
      title: "High-Flow Observation",
      time: "Yesterday, 11:32 PM",
      description:
        "Short-duration high flow detected.",
      detail:
        "A brief increase in flow was observed. The event did not persist long enough to be classified as a persistent anomaly.",
      flow: "8.7 L/min",
      duration: "4 minutes",
      severity: "Observation",
    },

    {
      type: "normal",
      title: "Normal Operation Resumed",
      time: "Yesterday, 10:05 PM",
      description:
        "Water flow returned to the normal range.",
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

            <p>
              Here's your water flow overview for today.
            </p>
          </div>

          <div className="overview-date">
            <span>Today</span>

            <strong>
              Residential Zone 01
            </strong>
          </div>

        </div>

        {/* STATUS */}

        <StatusBanner
          status="normal"
          title="System Normal"
          message="No abnormal water flow detected at this time."
        />

        {/* STAT CARDS */}

        <div className="overview-stats">

          <StatCard
            icon={Droplets}
            title="Current Flow"
            value="2.4 L/min"
            status="Normal"
            statusType="normal"
          />

          <StatCard
            icon={Gauge}
            title="Today's Usage"
            value="186.4 L"
            status="↑ 8% vs average"
            statusType="info"
          />

          <StatCard
            icon={Wifi}
            title="Device Status"
            value="Online"
            status="Wi-Fi Strong"
            statusType="normal"
          />

          <StatCard
            icon={Bell}
            title="Active Alerts"
            value="2"
            status="0 Critical"
            statusType="danger"
          />

        </div>

        {/* MAIN GRID */}

        <div className="overview-main-grid">

          <FlowChart />

          {/* EVENTS */}

          <div className="recent-events-card">

            <div className="section-card-header">

              <div>
                <h3>Recent Events</h3>

                <p>
                  Latest activity detected by AquaSense
                </p>
              </div>

              <button className="text-button">
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

                  <div
                    className={`event-indicator ${event.type}`}
                  >
                    {event.type === "warning" && (
                      <Bell size={15} />
                    )}

                    {event.type === "info" && (
                      <Activity size={15} />
                    )}

                    {event.type === "normal" && (
                      <ShieldCheck size={15} />
                    )}
                  </div>

                  <div className="event-content">

                    <div className="event-title-row">

                      <strong>
                        {event.title}
                      </strong>

                      <ArrowRight size={14} />

                    </div>

                    <span>
                      {event.time}
                    </span>

                    <p>
                      {event.description}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="overview-bottom-grid">

          {/* DEVICE */}

          <div className="device-summary-card">

            <div className="section-card-header">

              <div>
                <h3>Device Status</h3>

                <p>
                  AquaSense monitoring device
                </p>
              </div>

              <div className="online-badge">
                <span></span>
                Online
              </div>

            </div>

            <div className="device-summary-body">

              <div className="device-summary-icon">
                <Activity size={27} />
              </div>

              <div className="device-main-info">

                <strong>
                  ESP32-ZONE-001
                </strong>

                <span>
                  Residential Zone 01
                </span>

              </div>

            </div>

            <div className="device-metrics">

              <div>
                <span>Wi-Fi</span>
                <strong>Strong</strong>
              </div>

              <div>
                <span>Sensor</span>
                <strong>Operational</strong>
              </div>

              <div>
                <span>Last Update</span>
                <strong>2 sec ago</strong>
              </div>

            </div>

            <button className="device-link">
              View Device Health
              <ArrowRight size={15} />
            </button>

          </div>

          {/* SUMMARY */}

          <div className="quick-summary-card">

            <div className="section-card-header">

              <div>
                <h3>Today's Summary</h3>

                <p>
                  Water activity overview
                </p>
              </div>

            </div>

            <div className="summary-grid">

              <div className="summary-item">
                <Droplets size={19} />

                <div>
                  <span>Total Volume</span>
                  <strong>186.4 L</strong>
                </div>
              </div>

              <div className="summary-item">
                <Gauge size={19} />

                <div>
                  <span>Average Flow</span>
                  <strong>2.1 L/min</strong>
                </div>
              </div>

              <div className="summary-item">
                <Activity size={19} />

                <div>
                  <span>Peak Flow</span>
                  <strong>12.4 L/min</strong>
                </div>
              </div>

              <div className="summary-item">
                <Bell size={19} />

                <div>
                  <span>Total Events</span>
                  <strong>2</strong>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          EVENT DETAIL MODAL
          ===================================================== */}

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
                <span
                  className={`modal-status ${selectedEvent.type}`}
                >
                  {selectedEvent.severity}
                </span>

                <h2>
                  {selectedEvent.title}
                </h2>

                <p>
                  {selectedEvent.time}
                </p>
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
                <strong>
                  {selectedEvent.flow}
                </strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>
                  {selectedEvent.duration}
                </strong>
              </div>

              <div>
                <span>Event Time</span>
                <strong>
                  <Clock3 size={14} />
                  {selectedEvent.time.split(",")[1]}
                </strong>
              </div>

            </div>

            <div className="modal-note">

              <ShieldCheck size={18} />

              <p>
                AquaSense detects abnormal flow patterns.
                This event does not independently confirm
                or locate a physical leak.
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