
from collections import defaultdict
from statistics import mean

# Illustrative historical samples in minutes.
# Replace these with actual anonymized service-duration records.
SERVICE_HISTORY = {
    "General Consultation": [12, 15, 18, 14, 16, 13, 20],
    "Dental Consultation": [20, 25, 30, 22, 27, 24],
    "Laboratory Services": [10, 12, 15, 11, 14],
    "Follow-up Visit": [8, 10, 12, 9, 11],
    "Customer Support": [10, 15, 12, 14, 11]
}


def average_service_time(service: str) -> float:
    durations = SERVICE_HISTORY.get(service, [15])
    return round(mean(durations), 1)


def estimate_waiting_times(queue: list) -> list:
    waiting = [
        appointment for appointment in queue
        if appointment.get("status") == "WAITING"
    ]

    waiting.sort(
        key=lambda item: (
            not item.get("priority", False),
            item.get("createdAt", "")
        )
    )

    elapsed = defaultdict(float)
    estimates = []

    for appointment in waiting:
        service = appointment.get("service", "")
        duration = average_service_time(service)

        estimates.append({
            "token": appointment.get("token"),
            "patient": appointment.get("patientName"),
            "service": service,
            "estimated_wait_minutes": round(elapsed["queue"]),
            "expected_service_minutes": duration
        })

        elapsed["queue"] += duration

    return estimates


if __name__ == "__main__":
    for result in estimate_waiting_times([]):
        print(result)
