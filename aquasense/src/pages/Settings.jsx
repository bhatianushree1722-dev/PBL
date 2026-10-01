import { useState } from "react";
import {
  Settings as SettingsIcon,
  UserCircle,
  Bell,
  ShieldAlert,
  Wifi,
  Save,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";

function Settings() {
  const defaultSettings = {
    emailAlerts: true,
    abnormalFlowAlerts: true,
    highFlowAlerts: true,
    deviceOfflineAlerts: true,
    dailySummary: true,
    flowThreshold: 8,
    monitoringInterval: 5,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSaved(false);
  };

  return (
    <div className="page-container settings-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            <SettingsIcon size={13} />
            SYSTEM CONFIGURATION
          </div>

          <h1>Settings</h1>

          <p>
            Manage your AquaSense monitoring and notification preferences.
          </p>
        </div>

      </div>

      {/* SAVE MESSAGE */}

      {saved && (
        <div className="settings-saved-message">
          <CheckCircle2 size={17} />
          <span>Your settings have been saved successfully.</span>
        </div>
      )}

      {/* PROFILE */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon blue">
            <UserCircle size={20} />
          </div>

          <div>
            <h3>Profile</h3>
            <p>Your AquaSense account information.</p>
          </div>

        </div>

        <div className="settings-profile-card">

          <div className="settings-avatar">
            <UserCircle size={36} />
          </div>

          <div className="settings-profile-info">
            <strong>User</strong>
            <span>AquaSense account</span>
          </div>

          <button className="settings-outline-button">
            Edit Profile
            <ChevronRight size={14} />
          </button>

        </div>

      </section>

      {/* NOTIFICATIONS */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon orange">
            <Bell size={20} />
          </div>

          <div>
            <h3>Notifications</h3>
            <p>Choose which AquaSense events should generate alerts.</p>
          </div>

        </div>

        <div className="settings-options">

          <div className="settings-option">

            <div className="settings-option-icon">
              <Bell size={17} />
            </div>

            <div className="settings-option-content">
              <strong>Email Notifications</strong>
              <span>
                Receive important AquaSense notifications by email.
              </span>
            </div>

            <button
              className={`settings-toggle ${
                settings.emailAlerts ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "emailAlerts",
                  !settings.emailAlerts
                )
              }
              aria-label="Toggle email notifications"
            >
              <span></span>
            </button>

          </div>

          <div className="settings-option">

            <div className="settings-option-icon warning">
              <ShieldAlert size={17} />
            </div>

            <div className="settings-option-content">
              <strong>Abnormal Flow Alerts</strong>
              <span>
                Alert when an unusual flow pattern requires attention.
              </span>
            </div>

            <button
              className={`settings-toggle ${
                settings.abnormalFlowAlerts ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "abnormalFlowAlerts",
                  !settings.abnormalFlowAlerts
                )
              }
              aria-label="Toggle abnormal flow alerts"
            >
              <span></span>
            </button>

          </div>

          <div className="settings-option">

            <div className="settings-option-icon blue">
              <Wifi size={17} />
            </div>

            <div className="settings-option-content">
              <strong>Device Offline Alerts</strong>
              <span>
                Notify when the AquaSense device stops communicating.
              </span>
            </div>

            <button
              className={`settings-toggle ${
                settings.deviceOfflineAlerts ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "deviceOfflineAlerts",
                  !settings.deviceOfflineAlerts
                )
              }
              aria-label="Toggle device offline alerts"
            >
              <span></span>
            </button>

          </div>

          <div className="settings-option">

            <div className="settings-option-icon green">
              <CheckCircle2 size={17} />
            </div>

            <div className="settings-option-content">
              <strong>Daily Summary</strong>
              <span>
                Receive a summary of daily water-flow activity.
              </span>
            </div>

            <button
              className={`settings-toggle ${
                settings.dailySummary ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "dailySummary",
                  !settings.dailySummary
                )
              }
              aria-label="Toggle daily summary"
            >
              <span></span>
            </button>

          </div>

        </div>

      </section>

      {/* MONITORING */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon blue">
            <ShieldAlert size={20} />
          </div>

          <div>
            <h3>Monitoring</h3>
            <p>
              Configure how AquaSense evaluates water-flow activity.
            </p>
          </div>

        </div>

        <div className="settings-options">

          {/* FLOW THRESHOLD */}

          <div className="settings-range-option">

            <div className="settings-option-content">

              <strong>High-Flow Threshold</strong>

              <span>
                Flow above this value can be highlighted as an
                elevated-flow observation.
              </span>

            </div>

            <div className="settings-range-control">

              <strong>
                {settings.flowThreshold} L/min
              </strong>

              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={settings.flowThreshold}
                onChange={(event) =>
                  updateSetting(
                    "flowThreshold",
                    Number(event.target.value)
                  )
                }
              />

              <div className="range-labels">
                <span>5</span>
                <span>15 L/min</span>
              </div>

            </div>

          </div>

          {/* MONITORING INTERVAL */}

          <div className="settings-select-option">

            <div className="settings-option-content">

              <strong>Monitoring Interval</strong>

              <span>
                How frequently the device sends a flow reading.
              </span>

            </div>

            <select
              value={settings.monitoringInterval}
              onChange={(event) =>
                updateSetting(
                  "monitoringInterval",
                  Number(event.target.value)
                )
              }
            >
              <option value="1">Every 1 minute</option>
              <option value="5">Every 5 minutes</option>
              <option value="10">Every 10 minutes</option>
              <option value="15">Every 15 minutes</option>
            </select>

          </div>

          {/* HIGH FLOW */}

          <div className="settings-option">

            <div className="settings-option-icon orange">
              <ShieldAlert size={17} />
            </div>

            <div className="settings-option-content">
              <strong>High-Flow Observations</strong>
              <span>
                Highlight short periods of unusually high water flow.
              </span>
            </div>

            <button
              className={`settings-toggle ${
                settings.highFlowAlerts ? "active" : ""
              }`}
              onClick={() =>
                updateSetting(
                  "highFlowAlerts",
                  !settings.highFlowAlerts
                )
              }
              aria-label="Toggle high flow observations"
            >
              <span></span>
            </button>

          </div>

        </div>

      </section>

      {/* DEVICE */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon green">
            <Wifi size={20} />
          </div>

          <div>
            <h3>Connected Device</h3>
            <p>Current AquaSense device configuration.</p>
          </div>

        </div>

        <div className="settings-device-card">

          <div className="settings-device-status">
            <div className="settings-device-icon">
              <Wifi size={21} />
            </div>

            <div>
              <strong>AquaSense Unit 01</strong>
              <span>
                Residential Zone 01
              </span>
            </div>
          </div>

          <div className="settings-device-online">
            <span></span>
            Online
          </div>

        </div>

        <div className="settings-info-note">

          <Info size={16} />

          <p>
            Device-specific hardware configuration will become
            available when the AquaSense backend is connected.
          </p>

        </div>

      </section>

      {/* ACTIONS */}

      <div className="settings-actions">

        <button
          className="settings-reset-button"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Reset Changes
        </button>

        <button
          className="settings-save-button"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default Settings;