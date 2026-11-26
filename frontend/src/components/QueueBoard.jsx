
import { useState } from "react";
import { api } from "../services/api";
import {
  ArrowRight, Check, Clock, Phone,
  AlertTriangle, UserRound, RefreshCw
} from "lucide-react";

export default function QueueBoard({ queue, refresh }) {
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  async function changeStatus(id, status) {
    setUpdating(id);
    setError("");

    try {
      await api.updateStatus(id, status);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  async function togglePriority(appointment) {
    setUpdating(appointment.id);
    setError("");

    try {
      await api.updatePriority(
        appointment.id,
        !appointment.priority
      );
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  const waiting = queue.filter(a => a.status === "WAITING");
  const serving = queue.filter(a => a.status === "SERVING");
  const completed = queue.filter(a => a.status === "COMPLETED");

  return (
    <section className="panel queue-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">OPERATIONS CENTER</span>
          <h2>Live queue board</h2>
          <p>Monitor and manage today's appointments.</p>
        </div>
        <button className="icon-button" onClick={refresh} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="queue-column-heading">
        <h3>Currently serving</h3>
        <span>{serving.length}</span>
      </div>

      {serving.length === 0 ? (
        <div className="empty-state">No customer is currently being served.</div>
      ) : serving.map(a => (
        <article className="queue-item serving-item" key={a.id}>
          <div className="token">{a.token}</div>
          <div className="patient-info">
            <strong>{a.patientName}</strong>
            <span>{a.service}</span>
          </div>
          <button
            className="complete-button"
            disabled={updating === a.id}
            onClick={() => changeStatus(a.id, "COMPLETED")}
          >
            <Check size={16} /> Complete
          </button>
        </article>
      ))}

      <div className="queue-column-heading">
        <h3>Waiting list</h3>
        <span>{waiting.length}</span>
      </div>

      {waiting.length === 0 ? (
        <div className="empty-state">The waiting queue is empty.</div>
      ) : waiting.map((a, index) => (
        <article className="queue-item" key={a.id}>
          <div className="queue-position">{index + 1}</div>
          <div className="token">{a.token}</div>

          <div className="patient-info">
            <strong>{a.patientName}</strong>
            <span>{a.service}</span>
            <span className="patient-phone">
              <Phone size={12} /> {a.phone}
            </span>
          </div>

          <div className="queue-meta">
            {a.priority && (
              <span className="priority-tag">
                <AlertTriangle size={12} /> Priority
              </span>
            )}
            <span className="time-tag">
              <Clock size={13} /> {a.estimatedMinutes} min
            </span>
          </div>

          <div className="queue-actions">
            <button
              className="priority-button"
              disabled={updating === a.id}
              onClick={() => togglePriority(a)}
              title="Toggle priority"
            >
              <AlertTriangle size={16} />
            </button>

            <button
              className="call-button"
              disabled={updating === a.id || serving.length > 0}
              onClick={() => changeStatus(a.id, "SERVING")}
            >
              Call <ArrowRight size={15} />
            </button>
          </div>
        </article>
      ))}

      <div className="queue-column-heading">
        <h3>Completed today</h3>
        <span>{completed.length}</span>
      </div>

      {completed.length === 0 ? (
        <div className="empty-state">No completed appointments yet.</div>
      ) : completed.map(a => (
        <article className="queue-item completed-item" key={a.id}>
          <UserRound size={20} />
          <div className="patient-info">
            <strong>{a.patientName}</strong>
            <span>{a.token} · {a.service}</span>
          </div>
          <span className="completed-label">Completed</span>
        </article>
      ))}
    </section>
  );
}
