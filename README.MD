# Webshop Engine – Monorepo

This repository contains a customizable e-commerce engine with a modular monorepo structure.  
It was developed as part of a computer science thesis project, combining a Spring Boot backend with a modern Vite + React frontend.

---

## Project Structure

```
.
├── webshop-be/       # Backend (Spring Boot)
├── webshop-fe/       # Frontend (Vite + React)
├── webshop-qa/       # Automated tests (UI + performance)
├── webshop-mo/       # Monitoring stack (Prometheus + Grafana)
├── docker-compose.yml
└── README.md         # Root readme
```

---

## Getting Started

Start the entire application stack locally:

```bash
docker-compose up --build
```

Ensure Docker is installed and running.

Access points:

| Service    | URL                      |
|------------|--------------------------|
| Frontend   | http://localhost:5173    |
| Backend    | http://localhost:8080    |
| Maildev UI | http://localhost:1080    |
| MinIO UI   | http://localhost:9090    |
| Postgres   | localhost:5432           |

---

## Services in `docker-compose.yml`

### `backend` (`webshop-be`)
- Spring Boot backend exposing REST API and metrics
- Depends on Postgres, Maildev, and MinIO
- Environment variables are injected for DB, auth, SMTP, Stripe, and storage

### `frontend` (`webshop-fe`)
- Vite + React app served via Docker
- Connects to backend at `http://backend:8080` using `VITE_BACKEND_URL` build arg

### `postgres`
- Default credentials: `postgres / postgres`
- DB name: `webshop`

### `maildev`
- Used for local email testing (port 1080 UI, 1025 SMTP)

### `minio`
- S3-compatible object storage used for image upload testing

---

## Notes

- You can override API URLs or frontend CORS via environment variables.
- In production, Maildev and MinIO should be replaced by SMTP and S3-compatible services like Mailersend and Backblaze B2.

---

## Additional Modules

| Module        | Description                            |
|---------------|----------------------------------------|
| `webshop-qa`  | UI and performance test automation     |
| `webshop-mo`  | Monitoring setup with Prometheus/Grafana |

---

## Developed With

- Java 23 + Spring Boot 3.4.4
- React 19 + Vite + Tailwind CSS
- Stripe, JWT, Prometheus, Grafana
- Docker Compose + Maven 3.9+