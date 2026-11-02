import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.core.seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "WildWatch"

def test_dashboard_summary(client):
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_detections" in data
    assert "active_cameras_count" in data
    assert data["total_cameras_count"] == 108
    assert data["zones_monitored_count"] == 4
    assert "telemetry" in data
    assert data["telemetry"]["battery_overall_pct"] == 87

def test_cameras_inventory(client):
    response = client.get("/api/v1/cameras?limit=108")
    assert response.status_code == 200
    cameras = response.json()
    assert len(cameras) == 108
    
    # Check camera fields
    first_cam = cameras[0]
    assert first_cam["id"] == "CAM-001"
    assert first_cam["zone_id"] == "Zone A"
    assert "battery_percentage" in first_cam

def test_cameras_filter(client):
    response = client.get("/api/v1/cameras?zone_id=Zone%20A")
    assert response.status_code == 200
    cams_zone_a = response.json()
    assert len(cams_zone_a) == 24
    for c in cams_zone_a:
        assert c["zone_id"] == "Zone A"

def test_detections_list(client):
    response = client.get("/api/v1/detections")
    assert response.status_code == 200
    detections = response.json()
    assert len(detections) > 0
    first = detections[0]
    assert "species_name" in first
    assert "confidence" in first
    assert "camera_id" in first

def test_detection_verification_flow(client):
    # Verify first detection
    response = client.get("/api/v1/detections?limit=1")
    assert response.status_code == 200
    first_det = response.json()[0]
    det_id = first_det["id"]

    patch_res = client.patch(f"/api/v1/detections/{det_id}/verify", json={"is_verified": True})
    assert patch_res.status_code == 200
    assert patch_res.json()["is_verified"] is True

def test_alerts_and_resolve(client):
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) > 0
    
    first_alert = alerts[0]
    patch_res = client.patch(f"/api/v1/alerts/{first_alert['id']}/status", json={"status": "resolved"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "resolved"

def test_reports_csv_export(client):
    response = client.get("/api/v1/reports/export-csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "Record_ID,Camera_ID,Zone,Species" in response.text
