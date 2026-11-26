
import logging
from datetime import datetime, timedelta
import requests

API_URL = "http://localhost:8080/api"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("QueueFlow.Reminders")


def fetch_appointments():
    response = requests.get(
        f"{API_URL}/appointments",
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def update_status(appointment_id, status):
    response = requests.patch(
        f"{API_URL}/appointments/{appointment_id}/status",
        json={"status": status},
        timeout=10
    )
    response.raise_for_status()
    return response.json()


def check_appointments():
    now = datetime.now()
    reminder_window = now + timedelta(minutes=30)

    try:
        appointments = fetch_appointments()

        for appointment in appointments:
            if appointment.get("status") != "WAITING":
                continue

            date = appointment.get("appointmentDate")
            time = appointment.get("appointmentTime")

            if not date or not time:
                continue

            scheduled = datetime.fromisoformat(
                f"{date}T{time}"
            )

            token = appointment.get("token")
            patient = appointment.get("patientName")

            # Log upcoming reminders.
            if now <= scheduled <= reminder_window:
                logger.info(
                    "REMINDER | Token: %s | Patient: %s | Scheduled: %s",
                    token, patient, scheduled
                )

            # Mark patients who have exceeded their grace period.
            if now > scheduled + timedelta(minutes=15):
                update_status(
                    appointment["id"],
                    "MISSED"
                )

                logger.warning(
                    "NO-SHOW | Token: %s | Patient: %s",
                    token, patient
                )

    except requests.RequestException as error:
        logger.error("Backend communication error: %s", error)
    except (ValueError, KeyError, TypeError) as error:
        logger.error("Appointment processing error: %s", error)
