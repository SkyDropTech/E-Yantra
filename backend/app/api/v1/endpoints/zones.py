from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Zone, Camera, Detection
from app.schemas import ZoneResponse

router = APIRouter()

@router.get("", response_model=List[ZoneResponse])
def get_zones(db: Session = Depends(get_db)):
    zones = db.query(Zone).all()
    results = []
    for z in zones:
        total_cams = db.query(Camera).filter(Camera.zone_id == z.id).count()
        online_cams = db.query(Camera).filter(Camera.zone_id == z.id, Camera.status == "online").count()
        offline_cams = db.query(Camera).filter(Camera.zone_id == z.id, Camera.status == "offline").count()
        total_dets = db.query(Detection).filter(Detection.zone_id == z.id).count()
        
        uptime = round((online_cams / total_cams * 100), 1) if total_cams > 0 else 0.0

        results.append(
            ZoneResponse(
                id=z.id,
                name=z.name,
                habitat_description=z.habitat_description,
                total_cameras=total_cams,
                online_cameras=online_cams,
                offline_cameras=offline_cams,
                total_detections=total_dets,
                uptime_percentage=uptime,
            )
        )
    return results

@router.get("/{zone_id}", response_model=ZoneResponse)
def get_zone(zone_id: str, db: Session = Depends(get_db)):
    z = db.query(Zone).filter(Zone.id == zone_id).first()
    if not z:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    total_cams = db.query(Camera).filter(Camera.zone_id == z.id).count()
    online_cams = db.query(Camera).filter(Camera.zone_id == z.id, Camera.status == "online").count()
    offline_cams = db.query(Camera).filter(Camera.zone_id == z.id, Camera.status == "offline").count()
    total_dets = db.query(Detection).filter(Detection.zone_id == z.id).count()
    uptime = round((online_cams / total_cams * 100), 1) if total_cams > 0 else 0.0

    return ZoneResponse(
        id=z.id,
        name=z.name,
        habitat_description=z.habitat_description,
        total_cameras=total_cams,
        online_cameras=online_cams,
        offline_cameras=offline_cams,
        total_detections=total_dets,
        uptime_percentage=uptime,
    )
