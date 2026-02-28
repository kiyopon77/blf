# BLF Real Estate — Full Stack Project

## Project Structure

```
blf/
├── docker-compose.yml        ← Master (run everything from here)
├── backend/                  ← FastAPI Python backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env                  ← Backend env vars (never commit)
│   └── app/
│       ├── main.py
│       ├── core/
│       │   ├── config.py         ← Loads env vars
│       │   ├── database.py       ← DB connection
│       │   ├── security.py       ← JWT + password hashing
│       │   └── dependencies.py   ← Route guards (auth checks)
│       ├── models/
│       │   └── user.py           ← SQLAlchemy User model
│       ├── schemas/
│       │   └── user.py           ← Request/Response shapes
│       ├── services/
│       │   └── auth.py           ← Business logic
│       └── routers/
│           └── auth.py           ← Auth endpoints
├── dbms/db/
│   ├── .env                  ← DB credentials (never commit)
│   └── init.sql              ← All table definitions
├── frontend/                 ← Next.js TypeScript frontend
│   └── Dockerfile            ← (to be set up)
└── nginx/
    ├── Dockerfile
    └── nginx.conf            ← Reverse proxy config
```

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Next.js (TypeScript)    |
| Backend   | FastAPI (Python 3.11)   |
| Database  | PostgreSQL 15           |
| Auth      | JWT (access + refresh)  |
| Proxy     | Nginx                   |
| Container | Docker + Docker Compose |

---



## Figma Page link: 
https://www.figma.com/design/SQSjEaEBtizxbxIGrIA658/Untitled?node-id=0-1&t=EKxfVSmJ11u3VC4I-1

---

## Getting Started

### Prerequisites
- Docker Desktop installed and running
- That's it — everything else runs in containers

### Run the Project

```bash
# from blf/ root
docker compose up -d --build

# check everything is running
docker compose ps
```

### Stop the Project

```bash
docker compose down

# to also delete database data (fresh start)
docker compose down -v
```

---

## Environment Variables

### `backend/.env`
```env
DATABASE_URL=postgresql://admin:admin123@db:5432/realestate
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### `dbms/db/.env`
```env
POSTGRES_DB=realestate
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
```

> ⚠️ Never commit `.env` files to git. They are in `.gitignore`.

---

## URLs

| Service         | URL                          |
|-----------------|------------------------------|
| Frontend        | http://localhost             |
| API (via Nginx) | http://localhost/api         |
| Swagger Docs    | http://localhost/api/docs    |
| pgAdmin         | http://localhost:5050        |

> Note: Direct backend access on port 8000 is disabled. All traffic goes through Nginx on port 80.

---

## Auth API — For Frontend Developer

### Base URL
```
http://localhost/api
```

---

### 1. Login
```
POST /api/auth/login
```

**Request body:**
```json
{
  "email": "admin@blf.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "role": "admin"
}
```

- `access_token` expires in **15 minutes**
- `refresh_token` is set automatically as an **httpOnly cookie** (you don't handle it manually)

---

### 2. Refresh Token (Silent Re-auth)
```
POST /api/auth/refresh
```

No request body needed — refresh token is read from the httpOnly cookie automatically.

**Response:** Same as login (new access_token)

Call this automatically when you get a `401` response on any request.

---

### 3. Logout
```
POST /api/auth/logout
```

Clears the refresh token cookie. No request body needed.

---

### 4. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user_id": 1,
  "full_name": "Admin",
  "email": "admin@blf.com",
  "role": "admin",
  "is_active": true,
  "created_at": "2026-02-28T..."
}
```

---

### 5. Create User (Admin only)
```
POST /api/auth/users
Headers: Authorization: Bearer <access_token>
```

**Request body:**
```json
{
  "full_name": "John Doe",
  "email": "john@blf.com",
  "password": "password123",
  "role": "user"
}
```

Roles: `"admin"` or `"user"`

---

### 6. List All Users (Admin only)
```
GET /api/auth/users
Headers: Authorization: Bearer <access_token>
```

---

## Frontend Implementation Guide

### Token Storage
```
✅ Store access_token in React state or Context (memory)
✅ Refresh token is handled automatically via httpOnly cookie
❌ Never store access_token in localStorage (XSS risk)
❌ Never store access_token in sessionStorage
```

### Axios Setup (recommended)

```typescript
// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/api',
  withCredentials: true,  // IMPORTANT: sends cookies with every request
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken() // from your auth context/state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          'http://localhost/api/auth/refresh',
          {},
          { withCredentials: true }
        )
        setAccessToken(data.access_token) // update your auth context
        error.config.headers.Authorization = `Bearer ${data.access_token}`
        return axios(error.config)
      } catch {
        // refresh failed — redirect to login
        redirectToLogin()
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

### Auth Context (recommended)

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  accessToken: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAccessToken(data.access_token)
    setRole(data.role)
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setAccessToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Protected Route (recommended)

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { accessToken, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
      return
    }
    if (requireAdmin && role !== 'admin') {
      router.push('/unauthorized')
    }
  }, [accessToken, role])

  return <>{children}</>
}
```

---

## Docker Setup for Frontend

Add a `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Then add to `docker-compose.yml` under services:

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: real_estate_frontend
  restart: always
  ports:
    - "3000:3000"
  networks:
    - app_network
  volumes:
    - ./frontend:/app
    - /app/node_modules
```

And update `nginx/nginx.conf` to replace the placeholder location block:

```nginx
location / {
    proxy_pass http://frontend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

## Database

### View Database
Go to http://localhost:5050
- Email: `admin@admin.com`
- Password: `admin123`
- Server connection: host=`db`, port=`5432`, user=`admin`, password=`admin123`

### Tables
| Table                  | Description                    |
|------------------------|--------------------------------|
| users                  | Admin and user accounts        |
| plots                  | Land plots with dimensions     |
| floors                 | Floor units per plot           |
| customers              | Customer KYC data              |
| sales                  | Transaction records            |
| payments               | Milestone payment tracking     |
| brokers                | Broker profiles                |
| relationship_managers  | RM profiles                    |

---

## Test Credentials

| Role  | Email           | Password   |
|-------|-----------------|------------|
| Admin | admin@blf.com   | admin123   |
| User  | user1@blf.com   | user123    |

---

## Common Commands

```bash
# View logs
docker compose logs backend
docker compose logs nginx
docker compose logs db

# Rebuild single service
docker compose up -d --build backend
docker compose up -d --build frontend
docker compose up -d --build nginx

# Restart single service
docker compose restart backend

# Fresh start (deletes all data)
docker compose down -v
docker compose up -d --build
```
