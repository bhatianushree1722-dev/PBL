import { useMemo, useState } from "react";
import {
  Bell,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Search,
  Clock3,
  ChevronRight,
  X,
  Droplets,
} from "lucide-react";

const eventData = [
  {
    id: 1,
    title: "Possible Abnormal Flow",
    description:
      "Water flow remained active longer than the expected pattern.",
    date: "28 Sep 2026",
    time: "02:14 AM",
    flow: "1.3 L/min",
    duration: "32 min",
    severity: "Attention",
    type: "warning",
    reviewed: false,
    note:
      "AquaSense detected an unusual flow pattern during a period where lower activity was expected.",
  },
  {
    id: 2,
    title: "High-Flow Observation",
    description:
      "A short period of elevated water flow was observed.",
    date: "27 Sep 2026",
    time: "11:32 PM",
    flow: "8.7 L/min",
    duration: "4 min",
    severity: "Observation",
    type: "info",
    reviewed: false,
    note:
      "The observed flow was higher than the normal range for this monitoring period.",
  },
  {
    id: 3,
    title: "Normal Operation Resumed",
    description:
      "Water flow returned to the expected operating range.",
    date: "27 Sep 2026",
    time: "10:05 PM",
    flow: "2.1 L/min",
    duration: "—",
    severity: "Normal",
    type: "normal",
    reviewed: true,
    note:
      "The system observed a return to the expected operating pattern.",
  },
  {
    id: 4,
    title: "High-Flow Observation",
    description:
      "Elevated flow was observed briefly before returning to normal.",
    date: "26 Sep 2026",
    time: "09:17 PM",
    flow: "9.2 L/min",
    duration: "3 min",
    severity: "Observation",
    type: "info",
    reviewed: true,
    note:
      "This event lasted for a short period and the system subsequently returned to normal flow.",
  },
  {
    id: 5,
    title: "Normal Operation Resumed",
    description:
      "Normal water-flow activity was restored.",
    date: "26 Sep 2026",
    time: "07:42 PM",
    flow: "4.8 L/min",
    duration: "21 min",
    severity: "Normal",
    type: "normal",
    reviewed: true,
    note:
      "Flow remained within the expected household usage pattern.",
  },
];

function Events() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(eventData);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter =
        filter === "All" ||
        event.severity === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.description.toLowerCase().includes(searchText) ||
        event.date.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

  const attentionCount = events.filter(
    (event) => event.severity === "Attention"
  ).length;

  const observationCount = events.filter(
    (event) => event.severity === "Observation"
  ).length;

  const normalCount = events.filter(
    (event) => event.severity === "Normal"
  ).length;

  const markAsReviewed = (id) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === id
          ? { ...event, reviewed: true }
          : event
      )
    );

    setSelectedEvent((previous) =>
      previous
        ? { ...previous, reviewed: true }
        : previous
    );
  };

  return (
    <div className="page-container events-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            <Bell size={13} />
            SYSTEM EVENTS
          </div>

          <h1>Events</h1>

          <p>
            Review important observations and system activity.
          </p>
        </div>

        <div className="events-live-status">
          <span></span>
          Monitoring active
        </div>

      </div>

      {/* SUMMARY */}

      <div className="events-summary-grid">

        <div className="event-summary-card attention">
          <div className="event-summary-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Attention</span>
            <strong>{attentionCount}</strong>
            <p>Needs review</p>
          </div>
        </div>

        <div className="event-summary-card observation">
          <div className="event-summary-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>Observations</span>
            <strong>{observationCount}</strong>
            <p>Elevated activity</p>
          </div>
        </div>

        <div className="event-summary-card normal">
          <div className="event-summary-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Normal</span>
            <strong>{normalCount}</strong>
            <p>Returned to normal</p>
          </div>
        </div>

        <div className="event-summary-card total">
          <div className="event-summary-icon">
            <Bell size={20} />
          </div>

          <div>
            <span>Total Events</span>
            <strong>{events.length}</strong>
            <p>Recorded events</p>
          </div>
        </div>

      </div>

      {/* FILTER BAR */}

      <div className="events-toolbar">

        <div className="events-filters">

          {[
            "All",
            "Attention",
            "Observation",
            "Normal",
          ].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}

        </div>

        <div className="events-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

      </div>

      {/* EVENTS LIST */}

      <div className="events-list-card">

        <div className="events-list-header">

          <div>
            <h3>Recent Events</h3>

            <p>
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="events-header-time">
            <Clock3 size={15} />
            Latest first
          </div>

        </div>

        <div className="events-list">

          {filteredEvents.length === 0 ? (

            <div className="events-empty">

              <Search size={26} />

              <strong>No events found</strong>

              <p>
                Try changing your filter or search term.
              </p>

            </div>

          ) : (

            filteredEvents.map((event) => (

              <button
                key={event.id}
                className={`event-row ${event.type}`}
                onClick={() => setSelectedEvent(event)}
              >

                <div className="event-row-icon">

                  {event.type === "warning" ? (
                    <AlertTriangle size={19} />
                  ) : event.type === "info" ? (
                    <Activity size={19} />
                  ) : (
                    <CheckCircle2 size={19} />
                  )}

                </div>

                <div className="event-row-content">

                  <div className="event-row-title">

                    <strong>{event.title}</strong>

                    {!event.reviewed && (
                      <span className="new-event">
                        NEW
                      </span>
                    )}

                  </div>

                  <p>{event.description}</p>

                  <span className="event-row-time">
                    {event.date} • {event.time}
                  </span>

                </div>

                <div className="event-row-flow">

                  <strong>{event.flow}</strong>

                  <span>{event.duration}</span>

                </div>

                <div
                  className={`event-severity ${event.type}`}
                >
                  {event.severity}
                </div>

                <ChevronRight
                  size={17}
                  className="event-row-arrow"
                />

              </button>

            ))

          )}

        </div>

      </div>

      {/* INFO */}

      <div className="events-information">

        <div className="events-information-icon">
          <Droplets size={17} />
        </div>

        <div>
          <strong>
            Events are observations, not automatic leak confirmation.
          </strong>

          <p>
            AquaSense highlights unusual water-flow patterns so they
            can be reviewed. An event does not independently confirm
            or locate a physical leak.
          </p>
        </div>

      </div>

      {/* EVENT MODAL */}

      {selectedEvent && (

        <div
          className="event-detail-overlay"
          onClick={() => setSelectedEvent(null)}
        >

          <div
            className="event-detail-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="event-modal-header">

              <div
                className={`event-modal-icon ${selectedEvent.type}`}
              >
                {selectedEvent.type === "warning" ? (
                  <AlertTriangle size={23} />
                ) : selectedEvent.type === "info" ? (
                  <Activity size={23} />
                ) : (
                  <CheckCircle2 size={23} />
                )}
              </div>

              <div>

                <span
                  className={`event-modal-severity ${selectedEvent.type}`}
                >
                  {selectedEvent.severity}
                </span>

                <h2>{selectedEvent.title}</h2>

                <p>
                  {selectedEvent.date} •{" "}
                  {selectedEvent.time}
                </p>

              </div>

              <button
                className="event-modal-close"
                onClick={() =>
                  setSelectedEvent(null)
                }
              >
                <X size={19} />
              </button>

            </div>

            {/* METRICS */}

            <div className="event-modal-metrics">

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
                <span>Status</span>
                <strong>
                  {selectedEvent.reviewed
                    ? "Reviewed"
                    : "Pending Review"}
                </strong>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="event-modal-section">

              <span>Observation</span>

              <p>
                {selectedEvent.description}
              </p>

            </div>

            <div className="event-modal-section">

              <span>System Note</span>

              <p>
                {selectedEvent.note}
              </p>

            </div>

            {/* TIMELINE */}

            <div className="event-timeline">

              <div className="timeline-item">

                <div className="timeline-dot">
                  <Activity size={12} />
                </div>

                <div>
                  <strong>Flow pattern observed</strong>
                  <span>
                    {selectedEvent.time}
                  </span>
                </div>

              </div>

              <div className="timeline-line"></div>

              <div className="timeline-item">

                <div className="timeline-dot">
                  <Bell size={12} />
                </div>

                <div>
                  <strong>Event recorded</strong>
                  <span>
                    AquaSense monitoring system
                  </span>
                </div>

              </div>

              {selectedEvent.reviewed && (
                <>
                  <div className="timeline-line"></div>

                  <div className="timeline-item">

                    <div className="timeline-dot reviewed">
                      <CheckCircle2 size={12} />
                    </div>

                    <div>
                      <strong>
                        Event reviewed
                      </strong>

                      <span>
                        Marked as reviewed
                      </span>
                    </div>

                  </div>
                </>
              )}

            </div>

            {/* ACTIONS */}

            <div className="event-modal-actions">

              <button
                className="secondary-event-button"
                onClick={() =>
                  setSelectedEvent(null)
                }
              >
                Close
              </button>

              {!selectedEvent.reviewed && (
                <button
                  className="primary-event-button"
                  onClick={() =>
                    markAsReviewed(selectedEvent.id)
                  }
                >
                  <CheckCircle2 size={16} />
                  Mark as Reviewed
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Events;