import {
  LayoutDashboard,
  Activity,
  Droplets,
  History,
  Bell,
  Cpu,
  Settings,
  Waves,
} from "lucide-react";

const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    label: "Live Monitoring",
    icon: Activity,
  },
  {
    label: "Consumption",
    icon: Droplets,
  },
  {
    label: "History",
    icon: History,
  },
  {
    label: "Events",
    icon: Bell,
  },
  {
    label: "Device Health",
    icon: Cpu,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Waves size={22} strokeWidth={2.4} />
        </div>

        <div>
          <h2>AquaSense</h2>
          <span>by Atlantics</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.label;

          return (
            <button
              key={item.label}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActivePage(item.label)}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className="sidebar-bottom">
        <div className="water-decoration">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>Smart Water.</p>
        <p>Safer Homes.</p>
      </div>
    </aside>
  );
}

export default Sidebar;