import { CheckCircle2, Home } from "lucide-react";

function StatusBanner({
  status = "normal",
  title = "System Normal",
  message = "No abnormal water flow detected at this time.",
}) {
  const isNormal = status === "normal";

  return (
    <div className={`status-banner ${isNormal ? "normal" : "warning"}`}>
      <div className="status-banner-left">
        <div className="status-banner-icon">
          <CheckCircle2 size={28} strokeWidth={2.2} />
        </div>

        <div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>

      <div className="zone-info">
        <Home size={20} strokeWidth={2} />

        <div>
          <strong>AquaSense</strong>
          <span>Residential Zone 01</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBanner;