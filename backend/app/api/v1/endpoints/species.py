from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Species, Detection
from app.schemas import SpeciesResponse

router = APIRouter()

@router.get("", response_model=List[SpeciesResponse])
def get_species(db: Session = Depends(get_db)):
    species_list = db.query(Species).all()
    results = []
    for sp in species_list:
        count = db.query(Detection).filter(Detection.species_id == sp.id).count()
        latest = (
            db.query(Detection.timestamp)
            .filter(Detection.species_id == sp.id)
            .order_by(Detection.timestamp.desc())
            .first()
        )
        # Conservative heuristic estimate for unique animals: count * 0.18
        est_unique = max(1, int(count * 0.18)) if count > 0 else 0
        
        results.append(
            SpeciesResponse(
                id=sp.id,
                common_name=sp.common_name,
                scientific_name=sp.scientific_name,
                category=sp.category,
                rarity_status=sp.rarity_status,
                total_detections=count,
                estimated_unique=est_unique,
                last_sighting_time=latest[0] if latest else None,
            )
        )
    return results

@router.get("/{species_id}", response_model=SpeciesResponse)
def get_single_species(species_id: str, db: Session = Depends(get_db)):
    sp = db.query(Species).filter(Species.id == species_id).first()
    if not sp:
        raise HTTPException(status_code=404, detail="Species not found")
    count = db.query(Detection).filter(Detection.species_id == sp.id).count()
    latest = (
        db.query(Detection.timestamp)
        .filter(Detection.species_id == sp.id)
        .order_by(Detection.timestamp.desc())
        .first()
    )
    est_unique = max(1, int(count * 0.18)) if count > 0 else 0
    return SpeciesResponse(
        id=sp.id,
        common_name=sp.common_name,
        scientific_name=sp.scientific_name,
        category=sp.category,
        rarity_status=sp.rarity_status,
        total_detections=count,
        estimated_unique=est_unique,
        last_sighting_time=latest[0] if latest else None,
    )
