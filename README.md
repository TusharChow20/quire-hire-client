# QuickHire — Frontend

The frontend for QuickHire, a modern job board application built with **Next.js 16**, **Tailwind CSS 4**, and **NextAuth.js v5**.

🔗 **Live:** https://quick-hire-sage.vercel.app/
📁 **Backend Repo:** https://github.com/TusharChow20/quick-hire-server

---

## Tech Stack

| Tool | Version |
|---|---|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | 4 |
| NextAuth.js | 5.0.0-beta.30 |
| React Hook Form | 7 |
| Recharts | 3 |
| Lucide React | 0.575 |
| SweetAlert2 | 11 |
| Swiper | 12 |

---

## Features

- **Home Page** — Hero, partner logos, job categories, featured jobs, latest jobs
- **Job Listings** — Search by keyword, filter by category, location, job type, and salary range
- **Job Detail Page** — Full job info with an Apply Now form (name, email, resume link, cover note)
- **Authentication** — Register / login with email & password via NextAuth JWT sessions
- **User Dashboard** — Track submitted applications, update profile and password
- **Admin Dashboard** — Post/delete jobs, manage all applications (status updates), analytics charts
- **Protected Routes** — Middleware guards dashboard routes; admin-only routes redirect regular users
- **Fully Responsive** — Mobile-first layout with a collapsible sidebar on small screens

---

## Getting Started

### Prerequisites

- Node.js **20.19.0+**
- Backend server running (see [backend repo](https://github.com/TusharChow20/quick-hire-server))

### Installation

```bash
git clone https://github.com/TusharChow20/quire-hire-client.git
cd quire-hire-client
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

> Generate a secure secret with: `openssl rand -base64 32`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express backend |
| `NEXTAUTH_URL` | Full URL where this Next.js app runs |
| `NEXTAUTH_SECRET` | Secret key for signing JWT sessions |

### Run Locally

```bash
npm run dev
```

App runs at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
quire-hire-client/
├── app/
│   ├── page.js               # Home page
│   ├── layout.js             # Root layout (SessionProvider, Navbar, Footer)
│   ├── jobs/                 # Job listings & detail pages
│   ├── dashboard/            # User & admin dashboard
│   │   ├── layout.js         # Sidebar layout with role-based nav
│   │   ├── page.js           # Renders AdminOverview or UserOverview
│   │   ├── jobs/             # Admin: manage job listings
│   │   ├── applications/     # Admin: manage all applications
│   │   ├── analytics/        # Admin: charts & stats
│   │   ├── my-applications/  # User: personal application history
│   │   └── profile/          # User: update profile & password
│   ├── login/
│   └── register/
├── component/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── FeaturedJobs.jsx
│   ├── Latestjobs.jsx
│   ├── ExploreCategories.jsx
│   ├── OurPartners.jsx
│   ├── PostJobsBanner.jsx
│   ├── AdminOverview.jsx
│   └── UserOverview.jsx
├── auth.js                   # NextAuth config (Credentials provider)
├── middleware.js             # Route protection
└── .env.local                # Environment variables (not committed)
```

---

## Authentication Flow

1. User submits email/password on `/login`
2. NextAuth calls `POST /api/auth/login` on the backend
3. On success, a JWT session is created with `id`, `email`, `name`, and `role`
4. `middleware.js` protects all `/dashboard/*` routes — admin-only routes redirect non-admin users

---

## Deployment

Deployed on **Vercel**. Set these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXTAUTH_URL=https://quick-hire-sage.vercel.app
NEXTAUTH_SECRET=your_production_secret
```

---

## Links

- 🌐 Live: https://quick-hire-sage.vercel.app/
- 💻 Frontend Repo: https://github.com/TusharChow20/quire-hire-client
- 🖥️ Backend Repo: https://github.com/TusharChow20/quick-hire-server