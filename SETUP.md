# Local setup

This project already contains the frontend and backend application files. These steps create a local Python virtual environment, install the project's dependencies, and start both servers. You need Git, Node.js 20.19+ (or 22.12+), Python 3.10+, and the project's existing MongoDB connection configuration.

## Backend setup

No Atlas provisioning is needed. Use the existing `TokaBackend\.env` file if you already have it; do not replace it with the example file.

### Windows PowerShell

```powershell
cd TokaBackend
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

### macOS or Linux

```sh
cd TokaBackend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
test -f .env || cp .env.example .env
```

The virtual environment keeps this project's Python packages separate from other projects. This repository already has a `requirements.txt`, so install from it rather than installing `fastapi[all]` separately.

If `.env` is missing, copy `.env.example` to `.env` and obtain the project's connection values through the team's approved method; the example contains placeholders, not working credentials. Do not share or commit `.env`.

With the virtual environment active, start the API from the `TokaBackend` directory:

```sh
uvicorn main:app --reload --port 8001
```

`uvicorn` runs the API. In `main:app`, `main` refers to the existing backend module and `app` is its FastAPI application. `--reload` restarts the server when backend code changes; `--port 8001` uses the project's configured API port.

If PowerShell prevents environment activation, use the venv's executable directly:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8001
```

### Updating dependencies (optional)

When you intentionally want to snapshot all packages in the active venv, you can regenerate `requirements.txt` with:

```sh
python -m pip freeze > requirements.txt
```

Review the output before committing it. `pip freeze` does not preserve platform markers such as the Windows-specific `uvloop` exclusion.

## Frontend setup

### What you need

Use Visual Studio Code and a web browser. Install a supported Node.js LTS release; npm is included with Node.js. In a terminal, check that both commands print a version:

```sh
node --version
npm --version
```

If either command is not recognized, install Node.js and reopen VS Code. If Vite reports an unsupported Node version, update Node.js.

### Open the existing project

Open the repository folder in VS Code, then choose **Terminal → New Terminal**. This repository already contains the Vite project in `tokaProto`, so do not run `npm create vite` or create another project.

### Install packages and start Vite

From the repository root, run:

```sh
cd tokaProto
npm ci
npm run dev
```

`npm ci` installs the exact packages in the lockfile. Run it for the first setup or after package-lock changes. If PowerShell blocks `npm.ps1`, use `npm.cmd ci` and `npm.cmd run dev`.

When Vite prints a **Local** address, open that address in your browser (normally <http://localhost:5173/>). Leave the terminal open while testing. The backend must also be running in its own terminal. The frontend defaults to the API at `http://localhost:8001`; to use a different API address, create `tokaProto/.env.local` and set `VITE_BACKEND_URL`.

### Restart Vite later

To stop Vite, focus its terminal and press **Ctrl+C**. To start it again, make sure the terminal is in `tokaProto`—the folder containing `package.json`—then run:

```sh
npm run dev
```

If the terminal is at the repository root instead, run `cd tokaProto` first. You can also open `tokaProto` directly in VS Code and run `npm run dev` in a new terminal.

## Verify the setup

- Frontend: <http://127.0.0.1:5173/>
- API health endpoint: <http://127.0.0.1:8001/>
- Interactive API documentation: <http://127.0.0.1:8001/docs>

The frontend has no dedicated test script. From `tokaProto`, run `npm run build` and `npm run lint`. From `TokaBackend`, with the venv active, run `python -m compileall -q main.py database.py models routes` and `python -m pip check`.

## Troubleshooting
- **Browser CORS errors:** make sure `CORS_ORIGINS` includes the exact origin in the browser address bar, including `localhost` versus `127.0.0.1`.
- **Port already in use:** stop the process using port `5173` or `8001`, or configure both servers to use different ports and update the API URL and CORS origins.
