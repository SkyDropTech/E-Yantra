from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Detection, Species, Camera, Zone
from app.schemas import DetectionResponse, DetectionVerifyUpdate, BoundingBox

router = APIRouter()

@router.get("", response_model=List[DetectionResponse])
def get_detections(
    zone_id: Optional[str] = Query(None),
    species_id: Optional[str] = Query(None),
    camera_id: Optional[str] = Query(None),
    min_confidence: Optional[float] = Query(None, ge=0.0, le=1.0),
    is_verified: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Detection).order_by(Detection.timestamp.desc())

    if zone_id and zone_id != "all":
        query = query.filter(Detection.zone_id == zone_id)
    if species_id and species_id != "all":
        query = query.filter(Detection.species_id == species_id)
    if camera_id and camera_id != "all":
        query = query.filter(Detection.camera_id == camera_id)
    if min_confidence is not None:
        query = query.filter(Detection.confidence >= min_confidence)
    if is_verified is not None:
        query = query.filter(Detection.is_verified == is_verified)

    detections = query.offset(offset).limit(limit).all()

    response = []
    for d in detections:
        bbox = None
        if d.bbox_x is not None and d.bbox_y is not None:
            bbox = BoundingBox(
                x=d.bbox_x,
                y=d.bbox_y,
                width=d.bbox_w or 0.5,
                height=d.bbox_h or 0.5,
            )

        sp = d.species_rel
        cam = d.camera_rel
        zn = d.zone_rel

        item = DetectionResponse(
            id=d.id,
            image_url=d.image_url,
            species_name=sp.common_name if sp else "Unknown Animal",
            scientific_name=sp.scientific_name if sp else None,
            confidence=round(d.confidence, 2),
            timestamp=d.timestamp,
            camera_id=d.camera_id,
            zone_id=d.zone_id,
            zone_name=zn.name if zn else d.zone_id,
            count=d.count,
            behaviour=d.behaviour,
            is_verified=d.is_verified,
            is_rare=d.is_rare,
            bounding_box=bbox,
            lat=cam.latitude if cam else None,
            lng=cam.longitude if cam else None,
        )
        response.append(item)

    return response

@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(detection_id: str, db: Session = Depends(get_db)):
    d = db.query(Detection).filter(Detection.id == detection_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Detection not found")

    bbox = None
    if d.bbox_x is not None and d.bbox_y is not None:
        bbox = BoundingBox(
            x=d.bbox_x,
            y=d.bbox_y,
            width=d.bbox_w or 0.5,
            height=d.bbox_h or 0.5,
        )

    sp = d.species_rel
    cam = d.camera_rel
    zn = d.zone_rel

    return DetectionResponse(
        id=d.id,
        image_url=d.image_url,
        species_name=sp.common_name if sp else "Unknown Animal",
        scientific_name=sp.scientific_name if sp else None,
        confidence=round(d.confidence, 2),
        timestamp=d.timestamp,
        camera_id=d.camera_id,
        zone_id=d.zone_id,
        zone_name=zn.name if zn else d.zone_id,
        count=d.count,
        behaviour=d.behaviour,
        is_verified=d.is_verified,
        is_rare=d.is_rare,
        bounding_box=bbox,
        lat=cam.latitude if cam else None,
        lng=cam.longitude if cam else None,
    )

@router.patch("/{detection_id}/verify", response_model=DetectionResponse)
def verify_detection(
    detection_id: str,
    payload: DetectionVerifyUpdate,
    db: Session = Depends(get_db)
):
    d = db.query(Detection).filter(Detection.id == detection_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Detection not found")

    d.is_verified = payload.is_verified
    db.commit()
    db.refresh(d)
    return get_detection(detection_id, db)
