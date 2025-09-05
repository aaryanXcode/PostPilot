# 📨 PostPilot Frontend

A **React + Vite** based frontend for PostPilot, containerized with **Docker** and **Docker Compose** for both development and production environments.


---

## 🚀 Features

* ⚡ Fast dev server with Vite
* 📦 Optimized production build served via Nginx
* 🐳 Dockerized setup (build once, run anywhere)
* 🔧 Easy dev/prod switch using Docker Compose profiles


---

## 📦 Prerequisites

* [Node.js](https://nodejs.org/) (for local dev, optional if using Docker only)
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose v2+](https://docs.docker.com/compose/)


---

## 🛠️ Local Development (Without Docker)

```bash
npm install
npm run dev
```

Visit: <http://localhost:5173>


---

## 🐳 Run with Docker

### 🔹 Build & Run (Production Mode)

```bash
docker build -t postpilot-frontend .
docker run -p 3000:80 postpilot-frontend
```

Visit: <http://localhost:3000>


---

## ⚡ Run with Docker Compose

We use **profiles** for dev and prod.

### Development (Hot Reload with Vite)

```bash
docker compose --profile dev up
```

👉 Visit: <http://localhost:3000>


---

### Production (Optimized Static Build with Nginx)

```bash
docker compose --profile prod up --build -d
```

👉 Visit: <http://localhost:3000>


---

## 🧹 Container Management

Stop running containers:

```bash
docker compose down
```

Clean up unused images/containers:

```bash
docker system prune -f
```


---

## 🔒 Security Notes

* Never commit API keys or secrets in `src/`.
* Use `.env` files with Vercel / Docker secrets.
* Ensure `.dockerignore` includes:

  ```
  node_modules
  .git
  .env
  npm-debug.log
  ```


---

## ✅ Summary

* **Dev:** `docker compose --profile dev up`
* **Prod:** `docker compose --profile prod up --build -d`
* **Stop:** `docker compose down`


