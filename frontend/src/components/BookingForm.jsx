
import { useState } from "react";
import { api } from "../services/api";
import { CalendarPlus, CheckCircle2 } from "lucide-react";

export default function BookingForm({ onBooked }) {
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    service: "General Consultation",
    appointmentDate: "",
    appointmentTime: "",
    priority: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const result = await api.book(form);
      setSuccess(result);
      setForm({
        patientName: "",
        phone: "",
        service: "General Consultation",
        appointmentDate: "",
        appointmentTime: "",
        priority: false
      });
      onBooked();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel booking-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">NEW APPOINTMENT</span>
          <h2>Book a service slot</h2>
          <p>Register a new patient or customer.</p>
        </div>
        <span className="heading-icon"><CalendarPlus /></span>
      </div>

      {success && (
        <div className="success-message">
          <CheckCircle2 size={20} />
          <div>
            <strong>Booking confirmed!</strong>
            <p>Your token: <b>{success.token}</b></p>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={submit} className="booking-form">
        <label>
          Full name
          <input
            name="patientName"
            value={form.patientName}
            onChange={change}
            placeholder="Enter full name"
            required
          />
        </label>

        <label>
          Phone number
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            placeholder="+254 7XX XXX XXX"
            required
          />
        </label>

        <label>
          Service
          <select name="service" value={form.service} onChange={change}>
            <option>General Consultation</option>
            <option>Dental Consultation</option>
            <option>Laboratory Services</option>
            <option>Follow-up Visit</option>
            <option>Customer Support</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Appointment date
            <input
              type="date"
              name="appointmentDate"
              min={new Date().toLocaleDateString("en-CA")}
              value={form.appointmentDate}
              onChange={change}
              required
            />
          </label>

          <label>
            Time slot
            <select
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={change}
              required
            >
              <option value="">Select time</option>
              {Array.from({ length: 36 }, (_, i) => {
                const hour = 8 + Math.floor(i / 4);
                const minute = (i % 4) * 15;
                const value =
                  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

                return <option key={value} value={value}>{value}</option>;
              })}
            </select>
          </label>
        </div>

        <label className="priority-check">
          <input
            type="checkbox"
            name="priority"
            checked={form.priority}
            onChange={change}
          />
          Request priority handling
        </label>

        <button className="primary-button" disabled={loading}>
          {loading ? "Booking..." : "Confirm appointment"}
        </button>
      </form>
    </section>
  );
}
