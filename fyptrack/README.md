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

Set `VITE_SUPPORT_EMAIL` in the same local `.env` file to a university support inbox. The footer contact form then opens the visitor's email app with the message addressed to that inbox.

After login, FYPTrack validates the JWT with `/api/v1/auth/me`, then opens a shared workspace selected from the backend-loaded role. Students see their own project and supervisor, supervisors see only assigned students, and coordinators see university records with assignment and supervisor invitation controls. The backend enforces these roles independently of the frontend.

Public signup creates student accounts only. Coordinators invite supervisors; invited supervisors activate with a single-use token and choose their password. A trusted local operator provisions initial coordinator accounts with `python -m scripts.provision_account`. To open every dashboard locally, run `python -m scripts.provision_demo` from `backend`, then sign out and log in at the same frontend URL with each email it prints. It prompts for and assigns passwords to one coordinator, two supervisors, and two students. See the repository README for the role-by-role expected records. Project creation/editing, milestones, documents, meetings, and evaluations are not implemented yet.
