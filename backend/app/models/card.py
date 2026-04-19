from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Identificación del asegurado
    mat_aseg = Column(String, index=True)
    cod_benefi = Column(String)

    # Datos personales
    apellido_paterno = Column(String)
    apellido_materno = Column(String)
    nombre = Column(String)
    ap_esposo = Column(String)

    # Procedencia
    lugar_procedencia = Column(String)
    localidad = Column(String)
    provincia = Column(String)
    departamento = Column(String)
    direccion = Column(String)
    telefono = Column(String)

    # Datos laborales
    empresa = Column(String)
    seccion = Column(String)

    # Contacto de emergencia
    notificar_nombre = Column(String)
    notificar_direccion = Column(String)

    # Datos médicos
    unidad_sanitaria = Column(String)
    consultorio_servicio = Column(String)
    sala = Column(String)
    cama = Column(String)

    # Lugar y fecha
    lugar = Column(String)
    fecha = Column(Date)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    owner = relationship("User", back_populates="cards")
    observations = relationship(
        "Observation", back_populates="card", cascade="all, delete-orphan",
        order_by="Observation.fecha_visita.desc()"
    )


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    texto = Column(Text, nullable=False)
    fecha_visita = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    card = relationship("Card", back_populates="observations")
