
import { useEffect, useState } from "react";
import { Bell, ChevronDown, UserCircle, FlaskConical, Droplets } from "lucide-react";
import { getOperatingMode, setOperatingMode } from "../api";

function Header() {
  const [mode, setMode] = useState("normal");
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMode() {
      try {
        const result = await getOperatingMode();

        if (!cancelled) {
          setMode(result.mode === "simulator" ? "simulator" : "normal");
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to read operating mode.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMode();

    const intervalId = setInterval(loadMode, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  async function handleModeChange(nextMode) {
    if (switching || loading || nextMode === mode) return;

    setSwitching(true);
    setError("");

    try {
      const result = await setOperatingMode(nextMode);
      setMode(result.mode === "simulator" ? "simulator" : "normal");

      // Tell mounted dashboard components to refresh mode-dependent data.
      window.dispatchEvent(
        new CustomEvent("aquasense-mode-changed", {
          detail: { mode: result.mode },
        })
      );
    } catch (err) {
      setError(err.message || "Unable to change operating mode.");
    } finally {
      setSwitching(false);
    }
  }

  return (
    <header className="top-header">
      <div className="header-spacer" />

      <div className="header-actions">
        <div
          className="operating-mode-control"
          role="group"
          aria-label="AquaSense operating mode"
        >
          <span className="operating-mode-label">
            {mode === "simulator" ? (
              <FlaskConical size={16} />
            ) : (
              <Droplets size={16} />
            )}
            {mode === "simulator" ? "Simulator Mode" : "Normal Mode"}
          </span>

          <button
            type="button"
            className={`mode-toggle-button ${
              mode === "simulator" ? "simulator-active" : "normal-active"
            }`}
            onClick={() =>
              handleModeChange(
                mode === "normal" ? "simulator" : "normal"
              )
            }
            disabled={loading || switching}
            aria-label={`Switch to ${
              mode === "normal" ? "Simulator" : "Normal"
            } Mode`}
            aria-pressed={mode === "simulator"}
          >
            <span className="mode-toggle-knob" />
          </button>

          <span className="mode-toggle-text">
            {loading ? "Loading..." : switching ? "Switching..." : "Switch"}
          </span>
        </div>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={20} strokeWidth={2} />
          <span className="notification-badge">2</span>
        </button>

        <button className="user-menu">
          <UserCircle size={34} strokeWidth={1.6} />
          <span>User</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {error && (
        <div className="mode-error" role="alert">
          Mode error: {error}
        </div>
      )}
    </header>
  );
}

export default Header;
