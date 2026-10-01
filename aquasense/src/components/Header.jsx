import { Bell, ChevronDown, UserCircle } from "lucide-react";

function Header() {
  return (
    <header className="top-header">
      <div className="header-spacer"></div>

      <div className="header-actions">
        {/* Notifications */}
        <button className="notification-button" aria-label="Notifications">
          <Bell size={20} strokeWidth={2} />

          <span className="notification-badge">2</span>
        </button>

        {/* User */}
        <button className="user-menu">
          <UserCircle size={34} strokeWidth={1.6} />

          <span>User</span>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Header;