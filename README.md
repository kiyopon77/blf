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
│       │   ├── config.py
│       │   ├── database.py
│       │   ├── security.py
│       │   └── dependencies.py
│       ├── models/
│       │   ├── user.py, plot.py, floor.py, rm.py
│       │   ├── broker.py, customer.py, sale.py, payment.py
│       ├── schemas/
│       │   ├── user.py, plot.py, floor.py, rm.py
│       │   ├── broker.py, customer.py, sale.py, payment.py, dashboard.py
│       ├── services/
│       │   └── auth.py
│       └── routers/
│           ├── auth.py, plots.py, floors.py, rms.py
│           ├── brokers.py, customers.py, sales.py, payments.py, dashboard.py
├── dbms/db/
│   ├── .env                  ← DB credentials (never commit)
│   └── init.sql              ← All table definitions + default admin
├── frontend/                 ← Next.js TypeScript frontend
│   └── Dockerfile
└── nginx/
    ├── Dockerfile
    └── nginx.conf
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

## Getting Started

```bash
# from blf/ root
docker compose up -d --build

# check everything is running
docker compose ps
```

### Run DB + Backend Only (without frontend/nginx)

```bash
docker compose up -d --build db backend pgadmin

# test
curl http://localhost:8000/docs
```

---

## URLs

| Service      | URL                       |
|--------------|---------------------------|
| Frontend     | http://localhost          |
| API          | http://localhost/api      |
| Swagger Docs | http://localhost/api/docs |
| pgAdmin      | http://localhost:5050     |

---

## Test Credentials

| Role  | Email         | Password |
|-------|---------------|----------|
| Admin | admin@blf.com | admin123 |

---

## API Reference

### Base URL
```
http://localhost/api
```

### Authentication Header (required on all endpoints except login)
```
Authorization: Bearer <access_token>
```

---

## Auth

### Login
```
POST /auth/login
```
```json
// Request
{ "email": "admin@blf.com", "password": "admin123" }

// Response
{ "access_token": "eyJ...", "token_type": "bearer", "role": "admin" }
```
- access_token expires in **15 minutes**
- refresh_token set as **httpOnly cookie** automatically

### Refresh Token
```
POST /auth/refresh
```
No body needed — reads cookie automatically. Returns new access_token.

### Logout
```
POST /auth/logout
```
Clears refresh token cookie.

### Get Current User
```
GET /auth/me
```
```json
{
  "user_id": 1, "full_name": "Admin", "email": "admin@blf.com",
  "role": "admin", "is_active": true, "created_at": "..."
}
```

### Create User (Admin only)
```
POST /auth/users
```
```json
{ "full_name": "John", "email": "john@blf.com", "password": "pass123", "role": "user" }
```

### List Users (Admin only)
```
GET /auth/users
```

---

## Dashboard

### Get Summary Counts
```
GET /dashboard
```
```json
{
  "total_plots": 5,
  "total_floors": 20,
  "available": 12,
  "hold": 4,
  "sold": 3,
  "cancelled": 1
}
```
> Powers the 5 dashboard cards

---

## Plots

### List All Plots
```
GET /plots
```
```json
[{ "plot_id": 1, "plot_code": "C1", "length": 30.0, "breadth": 20.0, "created_at": "..." }]
```

### Get Single Plot
```
GET /plots/{plot_id}
```

### Get Floors of a Plot
```
GET /plots/{plot_id}/floors
```
```json
[{ "floor_id": 1, "plot_id": 1, "floor_no": 1, "status": "AVAILABLE", "active_sale_id": null }]
```
> Use for floor status matrix. Status values: AVAILABLE, HOLD, SOLD, CANCELLED

### Create Plot (Admin only)
```
POST /plots
```
```json
{ "plot_code": "C1", "length": 30.0, "breadth": 20.0 }
```

### Update Plot (Admin only)
```
PUT /plots/{plot_id}
```
```json
{ "length": 35.0, "breadth": 25.0 }
```

### Delete Plot (Admin only)
```
DELETE /plots/{plot_id}
```

---

## Floors

### List All Floors
```
GET /floors
```

### Get Single Floor
```
GET /floors/{floor_id}
```

### Create Floor (Admin only)
```
POST /floors
```
```json
{ "plot_id": 1, "floor_no": 1 }
```

### Update Floor Status (Admin only)
```
PUT /floors/{floor_id}/status
```
```json
{ "status": "AVAILABLE" }
```

---

## Relationship Managers

### List All RMs
```
GET /rms
```

### Get Single RM
```
GET /rms/{rm_id}
```

### Create RM (Admin only)
```
POST /rms
```
```json
{ "name": "Rajesh Kumar", "email": "rajesh@blf.com", "phone": "9999999999" }
```

### Update RM (Admin only)
```
PUT /rms/{rm_id}
```
```json
{ "name": "Rajesh", "phone": "8888888888" }
```

### Delete RM (Admin only)
```
DELETE /rms/{rm_id}
```

---

## Brokers

### List All Brokers
```
GET /brokers
```
```json
[{
  "broker_id": 1, "broker_name": "John Doe", "company": "Doe Realty",
  "phone": "8888888888", "email": "john@doe.com", "rm_id": 1, "created_at": "..."
}]
```

### Get Single Broker
```
GET /brokers/{broker_id}
```

### Create Broker (Admin only)
```
POST /brokers
```
```json
{ "broker_name": "John Doe", "company": "Doe Realty", "phone": "8888888888", "email": "john@doe.com", "rm_id": 1 }
```

### Update Broker (Admin only)
```
PUT /brokers/{broker_id}
```
```json
{ "broker_name": "John", "company": "Updated Realty", "phone": "7777777777" }
```

### Delete Broker (Admin only)
```
DELETE /brokers/{broker_id}
```

---

## Customers

### List All Customers
```
GET /customers
```
```json
[{
  "customer_id": 1, "full_name": "Amit Shah", "pan": "ABCDE1234F",
  "phone": "7777777777", "email": "amit@gmail.com", "address": "Delhi",
  "kyc_status": "PENDING", "created_at": "..."
}]
```

### Get Single Customer
```
GET /customers/{customer_id}
```

### Create Customer
```
POST /customers
```
```json
{ "full_name": "Amit Shah", "pan": "ABCDE1234F", "phone": "7777777777", "email": "amit@gmail.com", "address": "Delhi" }
```

### Update Customer / KYC Status
```
PUT /customers/{customer_id}
```
```json
{ "kyc_status": "COMPLETED", "phone": "6666666666", "address": "Mumbai" }
```

---

## Sales

### List All Sales
```
GET /sales
```
```json
[{
  "sale_id": 1, "floor_id": 3, "broker_id": 1, "customer_id": 1,
  "total_value": 245000.0, "commission_percent": 2.5,
  "status": "HOLD", "initiated_at": "..."
}]
```

### Get Sale Detail (enriched)
```
GET /sales/{sale_id}
```
```json
{
  "sale_id": 1,
  "total_value": 245000.0,
  "commission_percent": 2.5,
  "status": "HOLD",
  "initiated_at": "2026-03-14T...",
  "broker_name": "John Doe",
  "customer_name": "Amit Shah",
  "customer_kyc_status": "PENDING",
  "floor_no": 2,
  "plot_code": "C1"
}
```
> Use this for the plot detail page — has all info for ValueCard, BrokerInfoCard, CustomerCard

### Create Sale
```
POST /sales
```
```json
{ "floor_id": 3, "broker_id": 1, "customer_id": 1, "total_value": 245000.00, "commission_percent": 2.5 }
```
> Automatically sets floor status to HOLD and creates 6 milestone payment records

### Update Sale Status (Admin only)
```
PUT /sales/{sale_id}/status
```
```json
{ "status": "SOLD" }   // SOLD or CANCELLED
```
> SOLD → floor becomes SOLD | CANCELLED → floor becomes CANCELLED

### Get Sale Milestones
```
GET /sales/{sale_id}/payments
```
```json
[
  { "payment_id": 1, "sale_id": 1, "milestone": "TOKEN", "amount": 45000.0, "status": "DONE", "paid_at": "..." },
  { "payment_id": 2, "sale_id": 1, "milestone": "ATS", "amount": null, "status": "PENDING", "paid_at": null },
  { "payment_id": 3, "sale_id": 1, "milestone": "SUPERSTRUCTURE", "amount": null, "status": "PENDING", "paid_at": null },
  { "payment_id": 4, "sale_id": 1, "milestone": "PROPERTY_ID", "amount": null, "status": "PENDING", "paid_at": null },
  { "payment_id": 5, "sale_id": 1, "milestone": "REGISTRY", "amount": null, "status": "PENDING", "paid_at": null },
  { "payment_id": 6, "sale_id": 1, "milestone": "POSSESSION", "amount": null, "status": "PENDING", "paid_at": null }
]
```
> Use this for MilestoneCard and PaymentInfoCard

---

## Payments

### Update Milestone
```
PUT /payments/{payment_id}
```
```json
{ "status": "DONE", "amount": 45000.00 }
```
> paid_at is set automatically when status is DONE

---

## Page → API Mapping

| Page         | API Calls                                                                 |
|--------------|---------------------------------------------------------------------------|
| `/login`     | `POST /auth/login`                                                        |
| `/dashboard` | `GET /dashboard`, `GET /plots`, `GET /plots/{id}/floors`                  |
| `/plot/{id}` | `GET /floors/{id}` → get active_sale_id, `GET /sales/{id}`, `GET /sales/{id}/payments` |
| `/settings`  | `GET /auth/users`, `POST /auth/users` (admin only)                        |

### Plot Detail Page Data Flow
```
1. GET /floors/{floor_id}          → get active_sale_id
2. GET /sales/{active_sale_id}     → ValueCard, BrokerInfoCard, CustomerCard data
3. GET /sales/{sale_id}/payments   → MilestoneCard, PaymentInfoCard data
```

---

## Axios Setup

```typescript
// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/api',
  withCredentials: true,  // IMPORTANT: sends cookies (refresh token)
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken() // from your auth context
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          'http://localhost/api/auth/refresh', {},
          { withCredentials: true }
        )
        setAccessToken(data.access_token)
        error.config.headers.Authorization = `Bearer ${data.access_token}`
        return axios(error.config)
      } catch {
        redirectToLogin()
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Token Rules
```
✅ Store access_token in React state / Context (memory only)
✅ withCredentials: true on axios — handles refresh cookie automatically
❌ Never store access_token in localStorage
❌ Never store access_token in sessionStorage
```

---

## Common Commands

```bash
# Logs
docker compose logs backend
docker compose logs nginx
docker compose logs frontend

# Rebuild single service
docker compose up -d --build backend
docker compose up -d --build frontend

# Fresh start (deletes all data)
docker compose down -v
docker compose up -d --build
```