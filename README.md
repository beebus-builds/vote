# iVote - Secure Voting Platform

A full-stack secure voting application built with a modern architecture:
- **Frontend**: Next.js (React)
- **Backend**: FastAPI (Python)

## 🚀 Deployment Guide

This project is configured and ready to be deployed to **Render** (Backend) and **Vercel** (Frontend). Follow these steps to get your project live:

### 1. Push to GitHub
First, push this complete codebase to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy Backend to Render
The backend is fully configured for Render via the included `render.yaml` file.
1. Create a free account on [Render](https://render.com/).
2. Go to your Dashboard and click **New+** > **Blueprint**.
3. Connect your GitHub account and select your `iVote` repository.
4. Render will automatically detect the `render.yaml` configuration. Click **Apply Blueprint**.
5. Render will deploy the FastAPI backend. Once it is live, copy the generated service URL (e.g., `https://ivote-backend-xxxx.onrender.com`).

*Note: Update the environment variables (`SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`, `CLOUDINARY_URL`) in your Render dashboard once the service is created to ensure full functionality.*

### 3. Deploy Frontend to Vercel
The frontend is a standard Next.js application, making it trivial to host on Vercel.
1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New** > **Project** and import your `iVote` repository.
3. In the project configuration screen:
   - **Framework Preset**: Vercel will automatically detect `Next.js`.
   - **Root Directory**: Click "Edit" and select `frontend`.
4. Open the **Environment Variables** section and add:
   - `NEXT_PUBLIC_API_BASE_URL`: Paste the backend URL you got from Render.
5. Click **Deploy**.

**Important Final Step:** Once Vercel provides you with your frontend URL (e.g., `https://ivote-frontend.vercel.app`), go back to your Render Dashboard for the backend and update the `CORS_ORIGINS` environment variable to include your Vercel URL. This ensures your frontend can successfully communicate with the API.

---

## 📁 Project Structure

```text
iVote
├─ backend
│  ├─ app
│  │  ├─ core
│  │  │  ├─ config.py
│  │  │  ├─ crypto.py
│  │  │  └─ security.py
│  │  ├─ db
│  │  │  ├─ database.py
│  │  │  ├─ models.py
│  │  │  └─ __init__.py
│  │  ├─ main.py
│  │  ├─ routers
│  │  │  ├─ auth.py
│  │  │  ├─ candidates.py
│  │  │  ├─ elections.py
│  │  │  ├─ results.py
│  │  │  ├─ users.py
│  │  │  ├─ voting.py
│  │  │  └─ __init__.py
│  │  ├─ schemas
│  │  │  └─ schemas.py
│  │  ├─ services
│  │  │  ├─ audit_notification_service.py
│  │  │  ├─ auth_services.py
│  │  │  ├─ candidate_service.py
│  │  │  ├─ election_service.py
│  │  │  ├─ he_tally_service.py
│  │  │  ├─ result_service.py
│  │  │  ├─ schedular_service.py
│  │  │  ├─ voting_service.py
│  │  │  └─ __init__.py
│  │  ├─ uploads
│  │  │  └─ id_cards
│  │  │     └─ idcard_BIT-130.png
│  │  ├─ utils
│  │  │  ├─ dependencies.py
│  │  │  └─ helpers.py
│  │  └─ __init__.py
│  ├─ README.md
│  └─ requirements.txt
├─ frontend
│  ├─ app
│  │  ├─ admin
│  │  │  ├─ audit
│  │  │  │  └─ page.tsx
│  │  │  ├─ candidates
│  │  │  │  └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ elections
│  │  │  │  └─ page.tsx
│  │  │  ├─ results
│  │  │  │  └─ page.tsx
│  │  │  ├─ students
│  │  │  │  └─ page.tsx
│  │  ├─ student
│  │  │  ├─ candidacy
│  │  │  │  └─ page.tsx
│  │  │  ├─ candidates
│  │  │  │  └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ results
│  │  │  │  └─ page.tsx
│  │  │  ├─ vote
│  │  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ register
│  │     └─ page.tsx
│  ├─ components
│  │  └─ AppShell.tsx
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ utils.ts
│  ├─ next.config.mjs
│  ├─ next-env.d.ts
│  ├─ package.json
│  └─ tsconfig.json
├─ LICENSE
└─ uploads
   └─ id_cards
```