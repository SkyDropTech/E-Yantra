from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Camera, Detection, Species, Zone
from app.schemas import DashboardSummaryResponse, TelemetryResponse

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_detections = db.query(Detection).count()
    species_count = db.query(Species).count()
    total_cameras = db.query(Camera).count()
    active_cameras = db.query(Camera).filter(Camera.status == "online").count()
    zones_count = db.query(Zone).count()

    # Conservative heuristic for unique animals
    est_unique = max(1, int(total_detections * 0.18)) if total_detections > 0 else 0

    # Species distribution
    species_records = db.query(Species).all()
    species_dist = []
    color_map = {
        "Chital (Spotted Deer)": "#10b981",
        "Wild Boar": "#b45309",
        "Monkey (Rhesus Macaque)": "#3b82f6",
        "Peacock (Indian Peafowl)": "#8b5cf6",
        "Indian Leopard": "#f59e0b",
    }
    for sp in species_records:
        c = db.query(Detection).filter(Detection.species_id == sp.id).count()
        if c > 0:
            pct = round((c / total_detections) * 100, 1) if total_detections > 0 else 0
            species_dist.append({
                "name": sp.common_name,
                "value": c,
                "percentage": pct,
                "color": color_map.get(sp.common_name, "#94a3b8")
            })

    # Zone detections
    zones = db.query(Zone).all()
    zone_dets = []
    for z in zones:
        zc = db.query(Detection).filter(Detection.zone_id == z.id).count()
        zone_dets.append({
            "zone": z.id,
            "name": z.name,
            "count": zc,
        })

    # Telemetry
    telemetry = TelemetryResponse(
        storage_used_gb=312,
        storage_total_gb=512,
        battery_overall_pct=87,
        active_cameras_count=active_cameras,
        total_cameras_count=total_cameras,
    )

    return DashboardSummaryResponse(
        total_detections=total_detections,
        unique_animals_estimated=est_unique,
        species_identified_count=species_count,
        active_cameras_count=active_cameras,
        total_cameras_count=total_cameras,
        zones_monitored_count=zones_count,
        telemetry=telemetry,
        species_distribution=species_dist,
        zone_detections=zone_dets,
    )
