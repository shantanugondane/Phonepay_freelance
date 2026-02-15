# Deploy Backend to Vercel

The backend is set up to run as Vercel serverless functions. Use it as a **separate Vercel project** from your frontend.

## 1. Deploy the backend

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your repo (same repo as the frontend).
3. Set **Root Directory** to `backend` (important).
4. Leave **Framework Preset** as Other (or Node).
5. **Build**: leave empty or set to `echo "No build"`.
6. **Output Directory**: leave empty.
7. Click **Deploy**.

## 2. Environment variables (backend project)

In the backend project on Vercel: **Settings** → **Environment Variables**. Add the same vars as in `backend/.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL` → set to your **frontend** Vercel URL, e.g. `https://phonepay-freelance.vercel.app`
- `SALESFORCE_*` (all Salesforce-related vars, if you use them)

Redeploy after adding/changing env vars.

## 3. Connect the frontend

In your **frontend** Vercel project:

- **Settings** → **Environment Variables**
- Set `REACT_APP_API_URL` to your **backend** URL + `/api`, e.g.  
  `https://your-backend-project.vercel.app/api`
- Redeploy the frontend.

## 4. Local development

- Backend: `cd backend && npm run dev` (uses `server.js` as before).
- Frontend: keep `REACT_APP_API_URL=http://localhost:5000/api` (or unset to use default).

## Notes

- Backend URL will look like: `https://your-backend-name.vercel.app`.
- Health check: `https://your-backend-name.vercel.app/api/health`.
- All existing routes work: `/api/auth/login`, `/api/psr`, `/api/salesforce`, etc.
