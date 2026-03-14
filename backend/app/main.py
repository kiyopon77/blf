from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth
from app.routers import plots
from app.routers import floors
from app.routers import rms
from app.routers import brokers
from app.routers import customers
from app.routers import sales
from app.routers import payments
from app.routers import dashboard

# import all models so SQLAlchemy knows about them
import app.models

app = FastAPI(
    title="Land Inventory API",
    version="1.0.0",
    root_path="/api"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(plots.router)
app.include_router(floors.router)
app.include_router(rms.router)
app.include_router(brokers.router)
app.include_router(customers.router)
app.include_router(sales.router)
app.include_router(payments.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Land Inventory API is running"}