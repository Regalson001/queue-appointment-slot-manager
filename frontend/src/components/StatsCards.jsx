
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function StatsCards({ queue }) {
  const waiting = queue.filter(a => a.status === "WAITING").length;
  const serving = queue.filter(a => a.status === "SERVING").length;
  const completed = queue.filter(a => a.status === "COMPLETED").length;
  const priority = queue.filter(
    a => a.priority && a.status === "WAITING"
  ).length;

  const cards = [
    { label: "Waiting", value: waiting, icon: Users, color: "blue" },
    { label: "Currently serving", value: serving, icon: Clock, color: "purple" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "green" },
    { label: "Priority cases", value: priority, icon: AlertCircle, color: "orange" }
  ];

  return (
    <div className="stats-grid">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <article className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.color}`}>
              <Icon size={21} />
            </div>
            <div>
              <p>{card.label}</p>
              <h2>{card.value}</h2>
            </div>
          </article>
        );
      })}
    </div>
  );
}
