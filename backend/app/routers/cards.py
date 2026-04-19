from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.card import (
    CardCreate, CardUpdate, CardResponse, CardSummary,
    ObservationCreate, ObservationResponse
)
from app.services.card import (
    get_cards, get_card, create_card, update_card, delete_card,
    add_observation, delete_observation, get_observation
)

router = APIRouter(prefix="/api/cards", tags=["Tarjetas"])


@router.get("/", response_model=List[CardSummary])
def list_cards(
    search: Optional[str] = Query(None, description="Buscar por Mat. Aseg."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar todas las tarjetas del usuario actual."""
    return get_cards(db, current_user.id, search)


@router.post("/", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_new_card(
    card_data: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear una nueva tarjeta de paciente."""
    return create_card(db, card_data, current_user.id)


@router.get("/{card_id}", response_model=CardResponse)
def get_single_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener una tarjeta específica con sus observaciones."""
    card = get_card(db, card_id, current_user.id)
    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    return card


@router.put("/{card_id}", response_model=CardResponse)
def update_existing_card(
    card_id: int,
    card_data: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar una tarjeta existente."""
    card = get_card(db, card_id, current_user.id)
    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    return update_card(db, card, card_data)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar una tarjeta."""
    card = get_card(db, card_id, current_user.id)
    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    delete_card(db, card)


# --- Observaciones ---

@router.post("/{card_id}/observations", response_model=ObservationResponse, status_code=201)
def add_card_observation(
    card_id: int,
    obs_data: ObservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Agregar una observación de visita a una tarjeta."""
    card = get_card(db, card_id, current_user.id)
    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    return add_observation(db, card_id, obs_data)


@router.delete("/{card_id}/observations/{obs_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card_observation(
    card_id: int,
    obs_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar una observación."""
    card = get_card(db, card_id, current_user.id)
    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    obs = get_observation(db, obs_id, card_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Observación no encontrada")
    delete_observation(db, obs)
