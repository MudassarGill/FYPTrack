# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

# FYPTrack Frontend

The React/Vite frontend for FYPTrack. For full project setup, PostgreSQL configuration, backend instructions, API endpoints, and troubleshooting, see the [repository README](../README.md).

## Run the Frontend

From this directory, install dependencies and start Vite:

```powershell
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The FastAPI backend must also be running for signup and login. The frontend calls `http://127.0.0.1:8000/api/v1` by default; set `VITE_API_BASE_URL` in a local `.env` file here to override it.

After successful login, FYPTrack opens a new browser tab with a role-specific welcome message. If the browser blocks popups, the message appears on the login page instead. This welcome screen is not a role-protected dashboard.
