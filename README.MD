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

## Admin User Manual

After starting the application stack with `docker-compose up --build`, you can manage the webshop engine through the **Admin Dashboard**.

### Initial Login

- **URL**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
- **Admin email**: `admin@admin.com`
- **Default password**: `admin`

> To change the default password after your first login contact your operator.

---

### Dashboard Overview

Once logged in, you will be redirected to the **Admin Dashboard**, where you can fully configure and operate the Webshop Engine. The sidebar includes the following sections:

#### Storefront Setup

- **Articles**: Manage visual homepage elements like the **Hero Carousel**. Use this to promote highlighted products or seasonal campaigns.
- **Categories**: Define product categories and subcategories for the storefront menu.
- **Products**: Add, edit, or remove products.
- **Store**: Configure basic store information and settings.

#### Sales Operations

- **Promotions**: Manage promotional emails for marketing campaigns.
- **Orders**: Track and manage customer orders and order statuses.
- **Statistics**: Access sales data and analytics charts for business intelligence.

---

### Example Configuration Flow

1. **Create Categories** under the “Categories” menu.
2. **Upload Hero Carousel** visuals in the “Articles” section.
3. **Add Products** and assign them to the categories.
4. **Configure Store** basic info under “Store”.
5. Optionally, set up **Promotions** and test **Orders** via the frontend.
6. Review performance and order activity in the **Statistics** tab.

---

### Notes

- The admin interface is optimized for quick configuration and real-time content editing.
- All actions reflect immediately on the public storefront served at [http://localhost:5173](http://localhost:5173).
