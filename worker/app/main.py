
import logging
from apscheduler.schedulers.blocking import BlockingScheduler

from app.reminders import check_appointments, fetch_appointments
from app.estimator import estimate_waiting_times

logging.basicConfig(level=logging.INFO)

scheduler = BlockingScheduler(timezone="Africa/Nairobi")


def run_estimation():
    try:
        appointments = fetch_appointments()
        estimates = estimate_waiting_times(appointments)

        logging.info("QUEUE WAIT-TIME ESTIMATES")

        for estimate in estimates:
            logging.info(
                "%s | %s | Estimated wait: %s minutes",
                estimate["token"],
                estimate["service"],
                estimate["estimated_wait_minutes"]
            )

    except Exception as error:
        logging.error("Estimation failed: %s", error)


if __name__ == "__main__":
    logging.info("QueueFlow Python worker starting...")

    # Run once immediately.
    check_appointments()
    run_estimation()

    # Run reminder and no-show monitoring every minute.
    scheduler.add_job(
        check_appointments,
        "interval",
        minutes=1,
        id="appointment_monitor"
    )

    # Refresh estimated waiting times every minute.
    scheduler.add_job(
        run_estimation,
        "interval",
        minutes=1,
        id="wait_time_estimator"
    )

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logging.info("QueueFlow worker stopped.")
