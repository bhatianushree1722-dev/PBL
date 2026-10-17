import { useState } from "react";
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

function App() {
  const [activePage, setActivePage] = useState("Overview");

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

      default:
        return <Overview />;
    }
  };

  return (
    <div className="aquasense-app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="aquasense-main">
        <Header />

        <main className="aquasense-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;