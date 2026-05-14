# iVote Backend - Minimal Setup

This is the backend for the iVote student election system built with **FastAPI** and **PostgreSQL**.

---

## Prerequisites

Make sure you have installed:

- Python 3.13+
- PostgreSQL
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/shawinCreates/iVote.git
cd iVote/backend
```

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## 3. Configure Environment Variables

Create .env file inside backend folder and set the following variables. Cloudinary is required for uploads; the app will not start without it.

```bash
Database_URL=postgresql+psycopg2://<username>:<password>@localhost:5432/ivotedb
SECRET_KEY=ivote-super-secret-key-2025-campus-election-system
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

- Replace <username> and <password> with your PostgreSQL credentials.
- Replace `<api_key>`, `<api_secret>`, and `<cloud_name>` with your Cloudinary credentials.

#### Note:

- First create ivotedb in PostgreSQL using pgAdmin

## 4. Deploy backend to Render and frontend to Vercel

This repository now uses Render for the backend and Vercel for the frontend.

1. Push your `iVote` repo to GitHub.

2. Deploy the backend on Render:
   - Create a Web Service.
   - Root directory: `backend`
   - Environment: `Python`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Set these Render environment variables for the backend service:
     - `DATABASE_URL`
     - `SECRET_KEY`
     - `ALGORITHM=HS256`
     - `ACCESS_TOKEN_EXPIRE_MINUTES=480`
     - `CORS_ORIGINS` = your Vercel frontend URL
     - `CLOUDINARY_URL` = `cloudinary://<api_key>:<api_secret>@<cloud_name>`

3. Deploy the frontend on Vercel:
   - Connect the same GitHub repo.
   - Select the `frontend` directory as the project root.
   - Use the default Vercel build settings for Next.js, or set:
     - Build command: `npm install && npm run build`
     - Output directory: (Vercel auto-detects Next.js)
   - Set this Environment Variable on Vercel:
     - `NEXT_PUBLIC_API_BASE_URL` = `https://<your-backend-service>.onrender.com`

4. After backend and frontend are live:
   - Confirm the backend URL works.
   - Confirm the frontend loads and calls the backend.

> Do not commit any secret values. Use Render and Vercel environment variables for `CLOUDINARY_URL` and the API base URL.

## 5. Run Database Migration

Apply Alembic migrations to create all tables. Run following command once you are in backend folder.

```bash
python -m alembic init alembic   ## Not needed as alembic is already initialized
python -m alembic revision --autogenerate -m "initial"
python -m alembic upgrade head
```
