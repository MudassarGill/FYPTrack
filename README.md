# FYPTrack

FYPTrack is an Intelligent Final Year Project Management and Automation System for universities. It is being developed to support students, supervisors, and coordinators through the final year project lifecycle.

This repository currently contains a React/Vite frontend and a modular FastAPI backend. The current backend milestone includes the application foundation, PostgreSQL configuration, the initial user migration, and signup/login endpoints.

## Current Features

- React 19 frontend built with Vite and Tailwind CSS.
- FastAPI backend with interactive Swagger documentation at `/docs`.
- PostgreSQL access through SQLAlchemy and psycopg2.
- Alembic migration for the initial `users` table.
- Public signup creates student accounts only.
- Passwords are hashed with bcrypt; plaintext passwords are not stored or returned.
- Login issues a signed JWT and returns a role-specific greeting.
- `/api/v1/auth/me` returns the current user when sent a valid bearer token.
- CORS is configured for the local Vite frontend.

The project is still under development. Project proposals, milestones, documents, evaluations, notifications, reports, and AI features are not implemented yet. Supervisor/coordinator provisioning and reusable role authorization rules are also future work.

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React, JavaScript, Vite, Tailwind CSS |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Database | PostgreSQL, SQLAlchemy ORM, psycopg2 |
| Validation/configuration | Pydantic, pydantic-settings |
| Migrations | Alembic |
| Authentication | bcrypt password hashing, JWT with HS256 |

## Repository Layout

```text
FYPTrack/
├── README.md
├── BUILD_NOTES.txt
└── fyptrack/
		├── backend/
		│   ├── .env.example
		│   ├── alembic.ini
		│   ├── alembic/
		│   │   ├── env.py
		│   │   └── versions/0001_create_users.py
		│   ├── core/config.py
		│   ├── database/connection.py
		│   ├── main.py
		│   ├── models/user.py
		│   ├── routes/auth.py
		│   ├── routes/health.py
		│   ├── routes/router.py
		│   ├── schemas/auth.py
		│   └── services/auth_service.py
		├── src/
		│   ├── components/auth/
		│   ├── services/auth.js
		│   └── App.jsx
		├── package.json
		└── vite.config.js
```

## Prerequisites

- Git.
- Python 3.10 or newer and pip.
- Node.js and npm compatible with the Vite version in `fyptrack/package.json`.
- A running PostgreSQL server. pgAdmin is optional and is used to administer PostgreSQL; it is not the database server itself.

The setup below does not require a Python virtual environment. Backend dependencies are listed in `fyptrack/backend/requirements.txt`.

## Clone and Configure

Run these commands in PowerShell:

```powershell
git clone <repository-url>
cd FYPTrack
```

### 1. Install backend dependencies

```powershell
cd fyptrack/backend
py -m pip install -r requirements.txt
```

Use `python -m pip` instead of `py -m pip` if the Python launcher is unavailable.

### 2. Create the PostgreSQL database

Start the PostgreSQL **server**. In pgAdmin, connect to that server, right-click **Databases**, select **Create > Database**, and create a database named `fyptrack`. Use a PostgreSQL user that has permission to connect to and create tables in this database.

pgAdmin does not sit between FastAPI and PostgreSQL. FastAPI connects directly to the PostgreSQL server using the connection URL configured below. pgAdmin can be closed after database setup as long as the PostgreSQL server continues running.

### 3. Configure backend environment variables

From `fyptrack/backend`, create a private `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace the example database password and JWT secret. The PostgreSQL URL format is:

```text
postgresql+psycopg2://DATABASE_USER:DATABASE_PASSWORD@HOST:5432/fyptrack
```

For a local PostgreSQL server, `HOST` is commonly `localhost` and the port is commonly `5432`. If a password contains URL-reserved characters such as `@`, encode those characters in the URL.

Important settings in `.env`:

| Variable | Purpose |
| --- | --- |
| `FYPTRACK_DATABASE_URL` | PostgreSQL connection details used by SQLAlchemy and Alembic. |
| `FYPTRACK_JWT_SECRET` | Private signing key for access tokens. Replace the example with a long random secret and never commit it. |
| `FYPTRACK_JWT_ALGORITHM` | JWT signing algorithm; currently `HS256`. |
| `FYPTRACK_ACCESS_TOKEN_EXPIRE_MINUTES` | JWT lifetime in minutes. |
| `FYPTRACK_FRONTEND_ORIGINS` | Allowed browser origin(s), comma-separated. Default: `http://localhost:5173`. |
| `FYPTRACK_APP_NAME` | FastAPI title shown in Swagger. |
| `FYPTRACK_APP_VERSION` | API version shown in Swagger. |

The root `.gitignore` excludes `.env`. Keep real database credentials and JWT secrets private.

### 4. Create the database tables

Still in `fyptrack/backend`, run the initial Alembic migration:

```powershell
alembic upgrade head
```

This creates the `users` table and Alembic version table. The `users` table contains the ID, full name, unique email, password hash, role, and created/updated timestamps. Roles are constrained to `student`, `supervisor`, or `coordinator`.

### 5. Start the backend

From `fyptrack/backend`:

```powershell
uvicorn main:app --reload
```

The API is available at `http://127.0.0.1:8000`. Swagger UI is at `http://127.0.0.1:8000/docs` and OpenAPI JSON is at `http://127.0.0.1:8000/openapi.json`.

### 6. Install and start the frontend

Open a second terminal and run from the `fyptrack` directory:

```powershell
cd <path-to-clone>\fyptrack
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The frontend's API base URL defaults to `http://127.0.0.1:8000/api/v1`. To use a different backend URL, create `fyptrack/.env` and set:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If Vite runs on a different host or port, also update `FYPTRACK_FRONTEND_ORIGINS` in `fyptrack/backend/.env` to match the browser URL exactly, then restart the backend.

## How Frontend and Backend Connect

```text
Browser (React/Vite)
	-> src/services/auth.js sends JSON requests with fetch()
	-> FastAPI routes under /api/v1/auth
	-> Pydantic validates the request and response shapes
	-> auth_service.py applies signup/login rules
	-> database/connection.py provides a SQLAlchemy session
	-> PostgreSQL stores the user record
	-> FastAPI returns JSON to the browser
```

The frontend and backend are separate development servers. CORS in `backend/main.py` permits the configured Vite origin to call the API. `pgAdmin` is not part of this request path.

### Signup flow

1. The signup form posts `full_name`, `email`, and `password` to `POST /api/v1/auth/signup`.
2. The backend normalizes the email, validates fields, checks for an existing account, hashes the password with bcrypt, and saves a new user with role `student`.
3. The response contains a message and safe user details; it never includes the password hash.
4. The frontend returns to the login form.

Public signup does not accept a role. This prevents users from choosing supervisor or coordinator privileges themselves.

### Login flow

1. The login form posts `email` and `password` to `POST /api/v1/auth/login`.
2. The backend finds the user, verifies the password hash, and signs a JWT.
3. The response includes `access_token`, user details, and a greeting based on the stored role: `Welcome student`, `Welcome supervisor`, or `Welcome coordinator`.
4. The current frontend displays the greeting. The token is returned by the API but the current UI does not yet retain it for later page loads or send it to protected feature routes.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | API root/status message. |
| `GET` | `/api/v1/health` | Simple health check. |
| `POST` | `/api/v1/auth/signup` | Create a student account. |
| `POST` | `/api/v1/auth/login` | Verify credentials and return a JWT and role greeting. |
| `GET` | `/api/v1/auth/me` | Return the authenticated user; requires `Authorization: Bearer <token>`. |

Example signup request:

```json
{
	"full_name": "Alex Student",
	"email": "alex@example.com",
	"password": "a-long-password"
}
```

Example login request:

```json
{
	"email": "alex@example.com",
	"password": "a-long-password"
}
```

Use Swagger at `/docs` to try the endpoints. Signup/login currently use JSON request bodies, not HTML form data.

## Troubleshooting

- **Database is not configured (503):** Confirm `fyptrack/backend/.env` exists and contains `FYPTRACK_DATABASE_URL` and `FYPTRACK_JWT_SECRET`. Restart Uvicorn after editing it.
- **Connection refused:** Confirm the PostgreSQL server is running and that the host and port in the URL are correct. pgAdmin being open does not guarantee the server is running.
- **Database does not exist:** Create `fyptrack` in pgAdmin, then rerun `alembic upgrade head`.
- **Password authentication failed:** Check the PostgreSQL username/password locally in `.env`. Do not paste the real password into chat or commit it.
- **Table does not exist:** Run `alembic upgrade head` from `fyptrack/backend` after configuring `.env`.
- **Browser CORS error:** Make `FYPTRACK_FRONTEND_ORIGINS` match the Vite URL exactly, including `localhost` versus `127.0.0.1` and the port.
- **Frontend cannot reach API:** Confirm Uvicorn is running at the API base URL and restart Vite if `VITE_API_BASE_URL` was changed.
- **Email already registered:** Signup returns HTTP 409 for an email already in the database. Use that account to log in or choose another email.

When asking for help with PostgreSQL, share the host, port, database name, username if appropriate, the exact error text, and the command that produced it. Mask the password in any connection URL, for example `postgresql+psycopg2://postgres:***@localhost:5432/fyptrack`. Never share `.env`, a real password, or the JWT secret.

## Current Limitations and Next Work

- A live PostgreSQL connection has not yet been verified in this development workspace because no database URL is configured.
- There is not yet an automated test suite in the repository.
- The current browser flow displays a greeting but does not retain the JWT or implement a dashboard/session persistence.
- Supervisor and coordinator accounts must be created through a trusted administrative process; public signup only creates students.
- Reusable role authorization dependencies and the planned FYPTrack modules are future milestones.

See [BUILD_NOTES.txt](BUILD_NOTES.txt) for a plain-text record of the current implementation and development setup.