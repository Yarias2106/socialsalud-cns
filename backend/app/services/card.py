from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.card import Card, Observation
from app.schemas.card import CardCreate, CardUpdate, ObservationCreate


def get_cards(db: Session, user_id: int, search: Optional[str] = None) -> List[Card]:
    query = db.query(Card).filter(Card.user_id == user_id)
    if search:
        query = query.filter(Card.mat_aseg.ilike(f"%{search}%"))
    return query.order_by(Card.created_at.desc()).all()


def get_card(db: Session, card_id: int, user_id: int) -> Optional[Card]:
    return db.query(Card).filter(Card.id == card_id, Card.user_id == user_id).first()


def create_card(db: Session, card_data: CardCreate, user_id: int) -> Card:
    card = Card(**card_data.model_dump(), user_id=user_id)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


def update_card(db: Session, card: Card, card_data: CardUpdate) -> Card:
    update_data = card_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


def delete_card(db: Session, card: Card) -> None:
    db.delete(card)
    db.commit()


def add_observation(
    db: Session, card_id: int, obs_data: ObservationCreate
) -> Observation:
    obs = Observation(card_id=card_id, **obs_data.model_dump())
    db.add(obs)
    db.commit()
    db.refresh(obs)
    return obs


def delete_observation(db: Session, obs: Observation) -> None:
    db.delete(obs)
    db.commit()


def get_observation(
    db: Session, obs_id: int, card_id: int
) -> Optional[Observation]:
    return db.query(Observation).filter(
        Observation.id == obs_id, Observation.card_id == card_id
    ).first()
