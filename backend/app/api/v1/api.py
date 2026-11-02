from fastapi import APIRouter
from app.api.v1.endpoints import (
    cameras,
    detections,
    species,
    zones,
    alerts,
    dashboard,
    reports,
)

api_router = APIRouter()

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(cameras.router, prefix="/cameras", tags=["Cameras"])
api_router.include_router(detections.router, prefix="/detections", tags=["Detections"])
api_router.include_router(species.router, prefix="/species", tags=["Species"])
api_router.include_router(zones.router, prefix="/zones", tags=["Zones"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
