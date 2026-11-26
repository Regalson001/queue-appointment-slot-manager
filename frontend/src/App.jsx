
const API = "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export const api = {
  getQueue: () => request("/queue/board"),

  getAppointments: () => request("/appointments"),

  book: (appointment) =>
    request("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment)
    }),

  updateStatus: (id, status) =>
    request(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  updatePriority: (id, priority) =>
    request(`/appointments/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify({ priority })
    })
};
