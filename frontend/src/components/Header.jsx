
import { Activity, CalendarDays, Clock } from "lucide-react";

export default function Header() {
  return (
    <header className="topbar">
      <a href="/" className="brand">
        <span className="brand-icon"><Activity /></span>
        <span>Queue<span className="brand-accent">Flow</span></span>
      </a>

      <div className="header-right">
        <span className="live-indicator">
          <span className="live-dot"></span>
          Live queue
        </span>
        <span className="header-date">
          <CalendarDays size={16} />
          {new Date().toLocaleDateString()}
        </span>
        <span className="header-time">
          <Clock size={16} />
          Staff portal
        </span>
      </div>
    </header>
  );
}
