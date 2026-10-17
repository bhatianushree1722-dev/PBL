
import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Overview from "./pages/Overview";
import LiveMonitoring from "./pages/LiveMonitoring";
import Consumption from "./pages/Consumption";
import History from "./pages/History";
import Events from "./pages/Events";
import DeviceHealth from "./pages/DeviceHealth";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("aquasense-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("aquasense-theme", theme);
    } catch {
      // The app still works if browser storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const renderPage = () => {
    switch (activePage) {
      case "Overview":
        return <Overview />;

      case "Live Monitoring":
        return <LiveMonitoring />;

      case "Consumption":
        return <Consumption />;

      case "History":
        return <History />;

      case "Events":
        return <Events />;

      case "Device Health":
        return <DeviceHealth />;

      case "Settings":
        return <Settings />;

      case "AI Assistant":
        return <AIAssistant />;

      default:
        return <Overview />;
    }
  };

  return (
    <div className={`aquasense-app theme-${theme}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="aquasense-main">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="aquasense-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
