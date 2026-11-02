from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import Optional
import io
import csv
from app.core.database import get_db
from app.models import Detection, Species, Camera, Zone

router = APIRouter()

@router.get("/export-csv")
def export_csv_report(
    zone_id: Optional[str] = Query(None),
    species_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Detection).order_by(Detection.timestamp.desc())
    if zone_id and zone_id != "all":
        query = query.filter(Detection.zone_id == zone_id)
    if species_id and species_id != "all":
        query = query.filter(Detection.species_id == species_id)
    
    detections = query.limit(500).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Record_ID",
        "Camera_ID",
        "Zone",
        "Species",
        "Scientific_Name",
        "Confidence",
        "Count",
        "Behaviour",
        "Verified",
        "Timestamp_UTC"
    ])

    for d in detections:
        sp = d.species_rel
        writer.writerow([
            d.id,
            d.camera_id,
            d.zone_id,
            sp.common_name if sp else "Unknown",
            sp.scientific_name if sp else "",
            f"{d.confidence:.2f}",
            d.count,
            d.behaviour,
            "TRUE" if d.is_verified else "FALSE",
            d.timestamp.isoformat()
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=wildwatch_detections_audit.csv"}
    )
