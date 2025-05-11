# Webshop Monitoring

This folder contains the monitoring setup for the backend using **Prometheus** and **Grafana**.

---

## Stack Overview

- **Prometheus** for metrics collection from Spring Boot Actuator
- **Grafana** for dashboard visualization
- Metrics are exposed by the backend at `/actuator/prometheus`

---

## Docker Compose

Start monitoring stack locally:

```bash
docker compose up
```

### Services:

| Service     | Port      | URL                        |
|-------------|-----------|----------------------------|
| Prometheus  | `9091`    | http://localhost:9091      |
| Grafana     | `3000`    | http://localhost:3000      |

Default credentials for Grafana: `admin / admin`

---

## File Structure

```
.
├── docker-compose.yml               # Monitoring stack definition
├── grafana/
│   ├── dashboards/                  # JSON-exported Grafana dashboards
│   │   └── 19004_rev1.json          # Default home dashboard
│   └── provisioning/
│       ├── dashboards/              # Auto-load dashboard definitions
│       │   └── main.yml
│       └── datasources/            # Prometheus datasource
│           └── datasource.yml
└── prometheus/
    └── prometheus.yml              # Prometheus scrape config
```

---

## Prometheus Configuration

In `prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'WebShopMetrics'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 3s
    static_configs:
      - targets: [ 'host.docker.internal:8080' ]
        labels:
          application: 'Web shop engine'
    basic_auth:
      username: monitoring
      password: monitoring
```

> Make sure the backend is running and exposes metrics on port `8080`.  
> Update the `targets` list if you're using a deployed environment.

---

## Grafana Dashboard

Grafana is preconfigured to load the dashboard `19004_rev1.json` on startup.  
It's set as the default home dashboard via environment variable:

```yaml
GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=/var/lib/grafana/dashboards/19004_rev1.json
```

---

## Authentication

Prometheus uses basic auth for access to the metrics endpoint. Credentials:

```properties
Username: monitoring
Password: monitoring
```

---

## Requirements

- Docker
- Backend running on `localhost:8080` with `/actuator/prometheus` enabled
- Prometheus and Grafana configured via this folder

---

## Notes

- In production, you can update `targets` to point to your deployed backend service.
- To persist dashboards or metrics between runs, configure external volumes.