# Deployment Guide

This project utilizes a decoupled architecture with a React (Vite) frontend and a Django REST Framework (DRF) backend requiring a relational database. Since we are using a custom (non-BaaS) backend, careful orchestration is required for deployment.

## Production Readiness Checklist
Before deploying, ensure the following steps are taken:
1. `DEBUG=False` in backend settings.
2. `SECRET_KEY` is replaced with a strong, unpredictable value.
3. `ALLOWED_HOSTS` includes the production domain.
4. `CORS_ALLOWED_ORIGINS` includes the production frontend URL.
5. Setup a production-grade database (e.g., PostgreSQL).
6. Configure static file serving (e.g., WhiteNoise for Django).

## Recommended Hosting Platforms
- **Frontend:** Vercel, Netlify, or Cloudflare Pages.
- **Backend (API):** Render, Railway, Fly.io, or Heroku.
- **Database:** Supabase Postgres, Neon, or Render Managed PostgreSQL.

## Backend Deployment (e.g., Render via Docker/Web Service)

**Prerequisites:** Requires a PostgreSQL instance.

1. **Environment Variables:**
   Set the following on your hosting provider:
   - `DEBUG=False`
   - `SECRET_KEY=your-secure-crypto-key`
   - `DATABASE_URL=postgres://user:password@hostname:5432/dbname`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`

2. **Web Server configuration (Gunicorn):**
   Ensure `gunicorn` is in `requirements.txt`.
   Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

3. **Static Files:**
   Install `whitenoise` to serve static files from Django directly, or configure a CDN. Add to middleware in `settings.py`.

4. **Post-Build Script:**
   Configure your deployment pipeline to run migrations on every release:
   `python manage.py migrate`

## Frontend Deployment (e.g., Vercel)

1. **Environment Variables:**
   Set the following in Vercel project settings:
   - `VITE_API_BASE_URL=https://your-backend-api-domain.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID=your-google-client-id`

2. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **CORS:**
   Ensure the newly generated frontend domain is added to the backend's `CORS_ALLOWED_ORIGINS` or `CORS_ORIGIN_WHITELIST` environment variable.
