from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Camera, Detection, Species
from app.schemas import CameraResponse, CameraStatusUpdate

router = APIRouter()

@router.get("", response_model=List[CameraResponse])
def get_cameras(
    zone_id: Optional[str] = Query(None, description="Filter by zone ID (e.g. Zone A)"),
    status: Optional[str] = Query(None, description="Filter by status (online, offline, maintenance)"),
    search: Optional[str] = Query(None, description="Search by camera ID or location"),
    limit: int = Query(108, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Camera)
    if zone_id and zone_id != "all":
        query = query.filter(Camera.zone_id == zone_id)
    if status and status != "all":
        query = query.filter(Camera.status == status)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Camera.id.ilike(search_fmt)) | (Camera.location_name.ilike(search_fmt))
        )
    
    cameras = query.offset(offset).limit(limit).all()

    # Enrich with latest detection info if available
    response = []
    for c in cameras:
        cam_dict = CameraResponse.model_validate(c)
        latest_det = (
            db.query(Detection)
            .filter(Detection.camera_id == c.id)
            .order_by(Detection.timestamp.desc())
            .first()
        )
        if latest_det:
            sp = db.query(Species).filter(Species.id == latest_det.species_id).first()
            cam_dict.last_detection_species = sp.common_name if sp else None
        cam_dict.zone_name = c.zone_rel.name if c.zone_rel else c.zone_id
        response.append(cam_dict)

    return response

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    res = CameraResponse.model_validate(camera)
    res.zone_name = camera.zone_rel.name if camera.zone_rel else camera.zone_id
    latest_det = (
        db.query(Detection)
        .filter(Detection.camera_id == camera.id)
        .order_by(Detection.timestamp.desc())
        .first()
    )
    if latest_det:
        sp = db.query(Species).filter(Species.id == latest_det.species_id).first()
        res.last_detection_species = sp.common_name if sp else None
    return res

@router.patch("/{camera_id}/status", response_model=CameraResponse)
def update_camera_status(
    camera_id: str,
    payload: CameraStatusUpdate,
    db: Session = Depends(get_db)
):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    if payload.status not in ["online", "offline", "maintenance"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    camera.status = payload.status
    db.commit()
    db.refresh(camera)
    return get_camera(camera_id, db)
