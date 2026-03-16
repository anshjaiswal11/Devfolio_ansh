# 🚀 Developer Portfolio — Full-Stack Application

A modern, production-grade developer portfolio built with **React.js**, **Node.js**, **MongoDB**, and **Supabase**. Features a futuristic dark-theme UI, JWT authentication, admin dashboard, and full Docker + CI/CD support.

---

## ✨ Features

- **Futuristic dark UI** — animated grid, glow effects, typing animations
- **Public pages** — Home, About, Projects, Contact
- **Slug-based project URLs** — `/projects/my-project-name`
- **JWT Authentication** — signup, login, protected routes
- **Admin Dashboard** — full CRUD for projects
- **Contact form** — saves to MongoDB + sends email via Nodemailer
- **REST API** — documented endpoints, rate limiting, helmet security
- **Docker** — containerized frontend, backend, and MongoDB
- **CI/CD** — GitHub Actions pipeline (test → build → push images)

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, React Hook Form, Axios |
| Backend    | Node.js, Express.js, JWT, Nodemailer    |
| Database   | MongoDB + Mongoose ORM                  |
| Auth/Store | Supabase (optional), JWT (primary)      |
| DevOps     | Docker, docker-compose, GitHub Actions  |

---

## 📁 Project Structure

```
portfolio/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProjectCard, etc.
│   │   ├── pages/             # Home, About, Projects, Contact, Login, Signup, Dashboard
│   │   ├── services/          # Axios API client
│   │   ├── hooks/             # useReveal (scroll animations)
│   │   └── context/           # AuthContext
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                   # Node.js + Express API
│   ├── controllers/           # authController, projectController, contactController
│   ├── models/                # User, Project, Contact (Mongoose schemas)
│   ├── routes/                # auth, projects, contact
│   ├── middleware/            # auth (protect, adminOnly)
│   ├── config/                # db.js
│   ├── tests/                 # Jest + Supertest
│   └── Dockerfile
│
├── .github/workflows/         # GitHub Actions CI/CD
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values (JWT_SECRET, email credentials, etc.)

# 3. Start all services
docker compose up --build

# App will be running at:
#   Frontend  →  http://localhost:80
#   Backend   →  http://localhost:5000
#   MongoDB   →  localhost:27017
```

### Option 2 — Local Development

**Prerequisites:** Node.js 18+, MongoDB running locally

```bash
# ── Backend ──────────────────────────────────────────────────
cd backend
cp .env.example .env        # Fill in your values
npm install
npm run dev                  # Starts on http://localhost:5000

# ── Frontend (new terminal) ───────────────────────────────────
cd frontend
cp .env.example .env
npm install
npm run dev                  # Starts on http://localhost:3000
```

---

## 🔐 API Reference

### Auth
| Method | Endpoint              | Auth     | Description            |
|--------|-----------------------|----------|------------------------|
| POST   | `/api/auth/signup`    | Public   | Register new user      |
| POST   | `/api/auth/login`     | Public   | Login, returns JWT     |
| POST   | `/api/auth/logout`    | JWT      | Logout (client clears) |
| GET    | `/api/auth/profile`   | JWT      | Get current user       |

### Projects
| Method | Endpoint                  | Auth        | Description              |
|--------|---------------------------|-------------|--------------------------|
| GET    | `/api/projects`           | Public      | List all projects        |
| GET    | `/api/projects/:slug`     | Public      | Get project by slug      |
| POST   | `/api/projects`           | Admin JWT   | Create project           |
| PUT    | `/api/projects/:id`       | Admin JWT   | Update project           |
| DELETE | `/api/projects/:id`       | Admin JWT   | Delete project           |

### Contact
| Method | Endpoint          | Auth   | Description                    |
|--------|-------------------|--------|--------------------------------|
| POST   | `/api/contact`    | Public | Send message (rate-limited)    |

---

## 🌍 Pages & Routes

| Route                        | Component         | Access    |
|------------------------------|-------------------|-----------|
| `/`                          | Home              | Public    |
| `/about`                     | About             | Public    |
| `/projects`                  | Projects          | Public    |
| `/projects/:slug`            | ProjectDetails    | Public    |
| `/contact`                   | Contact           | Public    |
| `/login`                     | Login             | Public    |
| `/signup`                    | Signup            | Public    |
| `/dashboard`                 | Dashboard         | Auth only |

---

## 🔑 Authorization Roles

| Role          | Permissions                                    |
|---------------|------------------------------------------------|
| Guest         | View all public pages and projects             |
| Logged-in user | Access dashboard                              |
| Admin         | Create / edit / delete projects in dashboard  |

To make a user admin, update their role directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## 🗄️ Database Models

### User
```
name, email, password (hashed), bio, profileImage, skills[], role, createdAt
```

### Project
```
title, slug (unique), description, longDescription, techStack[], githubLink,
liveDemoLink, featured, order, createdAt
```

### Contact
```
name, email, message, read, createdAt
```

---

## 🐳 Docker Services

| Service     | Image                   | Port  |
|-------------|-------------------------|-------|
| `frontend`  | nginx:alpine (built)    | 80    |
| `backend`   | node:20-alpine (built)  | 5000  |
| `mongodb`   | mongo:7-jammy           | 27017 |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The pipeline in `.github/workflows/ci-cd.yml` runs on every push to `main` or `develop`:

1. **Test Backend** — runs Jest tests against a real MongoDB service container
2. **Build Frontend** — lints and builds the Vite app, uploads artifact
3. **Docker Build & Push** — builds multi-stage Docker images and pushes to GHCR

### Required GitHub Secrets

| Secret         | Description                            |
|----------------|----------------------------------------|
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions        |

Images are pushed to `ghcr.io/<owner>/portfolio-backend:latest` and `portfolio-frontend:latest`.

---

## 📧 Email Configuration

The contact form uses **Nodemailer**. For Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Set `EMAIL_USER` and `EMAIL_PASS` in your `.env`

Alternative services: **Resend**, **SendGrid** — just update `EMAIL_HOST`/`EMAIL_PORT`.

---

## ⚙️ Customization Checklist

- [ ] Update developer info in `Home.jsx` (name, skills, stats)
- [ ] Update bio and experience in `About.jsx`
- [ ] Replace social links in `Footer.jsx` and `Contact.jsx`
- [ ] Set your email in `.env`
- [ ] Add your resume as `frontend/public/resume.pdf`
- [ ] Update `<title>` in `frontend/index.html`
- [ ] Seed initial projects via the admin dashboard

---

## 🧪 Running Tests

```bash
cd backend
npm test              # Run all tests
npm test -- --coverage  # With coverage report
```

---

## 📄 License

MIT — free to use and customize for your own portfolio.
