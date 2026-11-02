from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from app.core.database import get_db
from app.models import Alert
from app.schemas import AlertResponse, AlertStatusUpdate

router = APIRouter()

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    status: Optional[str] = Query(None, description="pending, acknowledged, resolved"),
    severity: Optional[str] = Query(None, description="high, medium, low"),
    db: Session = Depends(get_db)
):
    query = db.query(Alert).order_by(Alert.created_at.desc())
    if status and status != "all":
        query = query.filter(Alert.status == status)
    if severity and severity != "all":
        query = query.filter(Alert.severity == severity)
    return query.all()

@router.patch("/{alert_id}/status", response_model=AlertResponse)
def update_alert_status(
    alert_id: str,
    payload: AlertStatusUpdate,
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if payload.status not in ["pending", "acknowledged", "resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    alert.status = payload.status
    if payload.status == "resolved":
        alert.resolved_at = datetime.datetime.now(datetime.timezone.utc)
    else:
        alert.resolved_at = None

    db.commit()
    db.refresh(alert)
    return alert
