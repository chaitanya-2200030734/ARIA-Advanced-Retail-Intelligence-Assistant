<p align="center">
  <img src="./frontend/images/ARIA%20FULL%20LOGO%20Main.png" alt="ARIA Logo" width="250"/>
</p>

<h1 align="center">ARIA – Advanced Retail Intelligence Assistant</h1>

<p align="center">
AI-powered retail assistant with voice interaction, intelligent recommendations, and order tracking.
</p>

---

Complete project structure setup for the ARIA hackathon project.

## Project locations

- **Backend**: `e:\RETAIL WEBAPP\aria-retail\backend`
- **Frontend**: `e:\RETAIL WEBAPP\aria-retail\frontend`

## Next steps

### 1. Install Backend Dependencies

```bash
cd e:\RETAIL WEBAPP\aria-retail\backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd e:\RETAIL WEBAPP\aria-retail\frontend
npm install
```

### 3. Setup Supabase

1. Create a project at https://supabase.com
2. In SQL Editor, run the database schema from PRD (create tables: inventory, sales, customers, products)
3. Create demo user: demo@aria.ai / Demo@1234
4. Copy Project URL and anon key from Settings > API
5. Update `.env` files in both backend and frontend with Supabase credentials

### 4. Get Groq API Key

1. Go to https://console.groq.com
2. Create account and get API key
3. Add to `backend/.env` as `GROQ_API_KEY`

### 5. Start Development Servers

**Backend** (Terminal 1):
```bash
cd e:\RETAIL WEBAPP\aria-retail\backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd e:\RETAIL WEBAPP\aria-retail\frontend
npm run dev
```

Frontend will open on `http://localhost:3000`

## Project Structure Summary

```
aria-retail/
├── backend/ — Express.js API server
│   ├── routes/ — chat, inventory, sales, customers, insights
│   ├── services/ — Groq and Supabase integrations
│   ├── middleware/ — error handler
│   └── index.js — server entry point
│
└── frontend/ — React + Vite
    ├── src/
    │   ├── pages/ — Landing, Login, Signup, Dashboard, etc.
    │   ├── components/ — layout, chatbot, ui, features
    │   ├── services/ — API client, Supabase client
    │   ├── hooks/ — useAuth
    │   ├── routes/ — ProtectedRoute
    │   └── App.jsx — main router
    ├── tailwind.config.js — design tokens
    └── index.html — fonts loaded here
```

All endpoints are compiled and wired. Build out individual features by following the PRD specifications.
