
# QueueFlow — Queue & Appointment Slot Manager

### Smarter scheduling. Shorter queues. Better service experiences.

QueueFlow is a full-stack appointment scheduling and queue management
platform designed for clinics, salons, advising offices and service centers.

It combines a React-based operational dashboard, a Java Spring Boot
scheduling engine and a Python automation worker.

## Key Features

- Patient and customer appointment registration
- Real-time queue board with automatic refresh
- Unique appointment tokens
- Database-backed appointment slot protection
- Priority queue handling
- Staff service status management
- Historical service-duration-based wait estimation
- Automated appointment reminder logging
- Overdue appointment and no-show monitoring
- Modular frontend, backend and automation services

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS3 |
| Backend | Java 17, Spring Boot |
| Database | H2, Spring Data JPA |
| Automation | Python 3.11 |
| Scheduling | APScheduler |
| Communication | REST API, JSON |
| Containerization | Docker Compose |
| Version Control | Git and GitHub |

## Architecture

```text
              PATIENT / STAFF
                     |
                     v
              REACT FRONTEND
                     |
                REST API
                     |
                     v
            SPRING BOOT BACKEND
                     |
                     v
                H2 DATABASE
                     ^
                     |
              PYTHON WORKER
                /       \
               v         v
          WAIT-TIME    REMINDERS
          ESTIMATOR    / NO-SHOWS
```

## Project Structure

```text
frontend/   React application
backend/    Spring Boot REST API
worker/     Python automation services
```

## Requirements

- Java 17 or later
- Maven 3.9+
- Node.js 20+
- Python 3.11+
- Git

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Regalson001/queue-appointment-slot-manager.git

cd queue-appointment-slot-manager
```

### 2. Start the Java backend

```bash
cd backend
mvn spring-boot:run
```

Backend:
http://localhost:8080

### 3. Start the React frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

### 4. Start the Python worker

Open another terminal:

```bash
cd worker

python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
python -m app.main
```

### 5. Run with Docker Compose

From the repository root:

```bash
docker compose up
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/appointments | Create appointment |
| GET | /api/appointments | List appointments |
| GET | /api/queue/board | Today's queue |
| PATCH | /api/appointments/{id}/status | Update status |
| PATCH | /api/appointments/{id}/priority | Update priority |

## Appointment Lifecycle

WAITING → SERVING → COMPLETED

Alternative outcomes:
WAITING → CANCELLED
WAITING → MISSED

## Engineering Highlights

- Separation of concerns across three services
- REST API communication
- Persistent appointment storage
- Database-enforced unique slot constraints
- Priority-aware queue ordering
- Python background automation
- Historical service-duration analysis
- Responsive operational interface

## Production Roadmap

- PostgreSQL database integration
- JWT authentication and role-based access control
- Multi-provider scheduling
- Transactional slot locking and configurable service durations
- SMS and email notification integrations
- Machine learning-based wait-time prediction
- Redis-backed event broadcasting
- WebSocket-powered live queue updates
- AWS deployment and monitoring
- Automated backend and frontend testing

## Developer

**Stephen Oyugi Nyarangi**

AI Automation Engineer | Software Developer |
AI Systems Integration Specialist

GitHub: https://github.com/Regalson001

---

Built to demonstrate modern software engineering,
automation and intelligent scheduling systems.
