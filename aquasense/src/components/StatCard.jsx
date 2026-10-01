function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  status,
  statusType = "normal",
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon ${statusType}`}>
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
      </div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>

        <h3 className="stat-value">{value}</h3>

        {status && (
          <div className={`stat-status ${statusType}`}>
            <span className="status-dot"></span>
            {status}
          </div>
        )}

        {subtitle && !status && (
          <p className="stat-subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default StatCard;