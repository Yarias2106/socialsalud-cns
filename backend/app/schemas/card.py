from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List


class ObservationCreate(BaseModel):
    texto: str
    fecha_visita: date


class ObservationResponse(BaseModel):
    id: int
    card_id: int
    texto: str
    fecha_visita: date
    created_at: datetime

    class Config:
        from_attributes = True


class CardBase(BaseModel):
    mat_aseg: Optional[str] = None
    cod_benefi: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    nombre: Optional[str] = None
    ap_esposo: Optional[str] = None
    lugar_procedencia: Optional[str] = None
    localidad: Optional[str] = None
    provincia: Optional[str] = None
    departamento: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    empresa: Optional[str] = None
    seccion: Optional[str] = None
    notificar_nombre: Optional[str] = None
    notificar_direccion: Optional[str] = None
    unidad_sanitaria: Optional[str] = None
    consultorio_servicio: Optional[str] = None
    sala: Optional[str] = None
    cama: Optional[str] = None
    lugar: Optional[str] = None
    fecha: Optional[date] = None


class CardCreate(CardBase):
    pass


class CardUpdate(CardBase):
    pass


class CardResponse(CardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    observations: List[ObservationResponse] = []

    class Config:
        from_attributes = True


class CardSummary(BaseModel):
    """Versión resumida para listar tarjetas (sin observaciones)"""
    id: int
    mat_aseg: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    nombre: Optional[str] = None
    empresa: Optional[str] = None
    unidad_sanitaria: Optional[str] = None
    fecha: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True
