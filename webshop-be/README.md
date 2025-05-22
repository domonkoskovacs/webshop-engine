# Backend service

This is the backend service for the Webshop engine application.
It is a Spring Boot 3 project with modular architecture, PostgreSQL database,
Stripe integration, JWT authentication, and support for email, file uploads, and observability.

---

## Features

- Spring Boot 3.3
- PostgreSQL with JPA
- JWT access + refresh token system
- Stripe payment integration
- Email sending (via SMTP)
- Image storage: local filesystem or S3-compatible MinIO
- Dockerized for local development

### Business features

- web content management
- authentication
- email sending
- image storage
- automated jobs
- order handling
- product management
- viewing statistics
- configuring store
- user management

--- 
## Configuration

### Environment Variables (`.env`)


You are advised to use the application in demo payment mode (`DEMO_PAY=true`) for development,  
but you can try full Stripe integration if you add a real secret key.

Create a `.env` file inside the `webshop-be/` folder (or use any environment variable to inject the value):

```dotenv
# Stripe
STRIPE_PRIVATE_KEY=MUST_BE_SPECIFIED
```

---

## Local Development with Docker

This service is part of the root `docker-compose.yml`.

Before running the spring boot app start all dependencies:

```bash
docker compose up
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:8080/swagger-ui/index.html
```

---

## Running Tests

```bash
mvn test
```

> Testcontainers are used for isolated integration tests (Postgres, MinIO, etc.) 
> so you need a running docker engine for integration tests.

---

## Clean-up

```bash
docker compose down -v
```

This will stop and remove all containers and volumes.

---

## Notes

- In production, SMTP and MinIO are replaced by cloud services (e.g. Mailersend, Backblaze B2).
- All secrets should be set via environment variables or secret managers in deployment platforms.

---

## Requirements

- Java 23+
- Maven 3.9+
- Docker Engine (for local development and integration tests)