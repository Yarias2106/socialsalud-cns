from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, cards
import app.models  # noqa: F401 — asegura que los modelos se registren

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SocialSalud CNS",
    description="Sistema de Gestión de Tarjetas de Pacientes — Caja Nacional de Salud",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:80", "http://frontend"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cards.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "sistema": "SocialSalud CNS"}
