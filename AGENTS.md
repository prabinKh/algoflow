# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AlgoFlow is a full-stack algorithm learning platform. Users can browse, create, and study algorithms with multi-language code snippets, complexity analysis, explanations, attachable assets, and an AI-powered "Forge" that auto-generates algorithm content via Gemini.

The repo has two independently runnable sub-projects:
- `algoflow_django/` — Django REST Framework backend (Python)
- `remix_-algoflow_-visualize-•-code-•-master/` — React 19 + Vite frontend (TypeScript)

---

## Commands

All paths below are relative to `algoflow/`.

### Backend (Django)

```bash
# Activate the shared venv (located at the repo root, one level up from algoflow/)
source ../.venv/bin/activate

# Install dependencies
pip install -r algoflow_django/requirements.txt

# Run migrations
python algoflow_django/manage.py migrate

# Start dev server (http://localhost:8000)
python algoflow_django/manage.py runserver

# Create superuser
python algoflow_django/manage.py createsuperuser

# Seed example algorithms into Django DB
python algoflow_django/manage.py shell < algoflow_django/examples_seed.py
```

### Frontend (React/Vite)

```bash
# From remix_-algoflow_-visualize-•-code-•-master/
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type-check (no emit)
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

### End-to-end / Integration Test

```bash
# Requires both servers running + ChromeDriver installed
# Run from repo root (one level above algoflow/)
python selenium_forge_test.py
```

---

## Architecture

### Backend — `algoflow_django/`

**Django 5 + DRF + SimpleJWT + SQLite**

Two Django apps:

- `account/` — Custom user model (`MyUser`, email-based), email verification flow, password reset, JWT login/logout, user notes (`Note`). Custom `CookieJWTAuthentication` reads the JWT from the `access_token` cookie (with header-based Bearer as fallback).
- `algorithms/` — `Algorithm`, `Category`, `Asset`, `Question` models and their full CRUD API.

URL layout:
- `api/auth/*` → `account.urls` (register, login, logout, verify-email, password-reset, notes, etc.)
- `api/*` → `algorithms.urls` (algorithms, categories, assets, questions)

**Auth flow**: On login Django sets an `access_token` cookie (5-minute lifetime) and a `refresh_token` cookie (1-day lifetime). Email verification is required before login; superusers bypass this check. `CORS_ALLOW_ALL_ORIGINS = True` and `CORS_ALLOW_CREDENTIALS = True` are set for local dev.

**Algorithm data model**: Each `Algorithm` stores code for four languages as JSONFields (`code_python`, `code_cpp`, `code_c`, `code_rust`), each structured as `{classCode, functionCode, recursiveCode, outcome, runtime}`. Complexity, explanation fields, and related `Asset` / `Question` models are separate DB rows.

**DB**: SQLite at `algoflow_django/algoflow.db`. Seeding is done via `examples_seed.py` (run through `manage.py shell`).

### Frontend — `remix_-algoflow_-visualize-•-code-•-master/`

**React 19 + React Router v7 + Vite + Tailwind CSS v4**

`server.ts` is an Express server that embeds Vite as middleware in dev mode and serves `dist/` in production. It also exposes its own `/api/*` endpoints backed by `better-sqlite3` (`database.sqlite`). **However**, `src/lib/api.ts` currently hardcodes the backend URL to `http://localhost:8000` (Django), so all `apiFetch()` calls go to Django, not the Express SQLite endpoints.

Key source layout:

- `src/main.tsx` — React entry point; wraps app in `BrowserRouter` + `AuthProvider`
- `src/App.tsx` — Root component; fetches algorithms/categories on mount, owns global search state, handles add/delete
- `src/lib/api.ts` — `apiFetch()` (attaches JWT cookie as Bearer header), `createAiClient()` (Gemini), `getBackendUrl()` (hardcoded to `localhost:8000`)
- `src/lib/AuthContext.tsx` — `AuthProvider` / `useAuth` hook; manages user state, login, register, logout, token refresh
- `src/types/index.ts` — All core TypeScript types (`Algorithm`, `Category`, `Language`, `CodeSnippet`, `Asset`, `Question`)
- `src/data/algorithms.ts` — Static seed data used to pre-populate both DBs
- `src/pages/ForgeAlgorithm.tsx` — Create/edit algorithm page; includes the "AI Forge" button that calls `gemini-3-flash-preview` to auto-fill all algorithm fields
- `src/pages/Dashboard.tsx` — Stats dashboard
- `src/components/AlgorithmViewer.tsx` — Tabbed viewer (Source, Guide, Assets, Quiz)
- `src/components/Sidebar.tsx` — Category/algorithm navigation

**Path alias**: `@/` maps to the frontend package root.

**AI Forge**: Gemini key is read from `localStorage` key `algo_flow_api_config` (set in the "API Matrix" panel in ForgeAlgorithm) with fallback to `process.env.GEMINI_API_KEY` (set via `.env.local`).

### Cross-cutting: Data Contract

The frontend `Algorithm` TypeScript type and the Django `Algorithm` model must stay in sync. The DRF serializer in `algorithms/` serializes the flat Django fields back into the nested JSON shape the frontend expects (`complexity: {time, space, timeRating, spaceRating}`, `code: {python: {...}, cpp: {...}, ...}`, `explanation: {...}`). When adding new fields, update both `src/types/index.ts` and the Django model + serializer.
