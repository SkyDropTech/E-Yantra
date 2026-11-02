from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import datetime

# --- Base & Common Schemas ---
class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

# --- Zone Schemas ---
class ZoneBase(BaseModel):
    id: str
    name: str
    habitat_description: Optional[str] = None

class ZoneResponse(ZoneBase):
    model_config = ConfigDict(from_attributes=True)
    total_cameras: int = 0
    online_cameras: int = 0
    offline_cameras: int = 0
    total_detections: int = 0
    uptime_percentage: float = 90.0

# --- Camera Schemas ---
class CameraBase(BaseModel):
    id: str
    name: str
    zone_id: str
    status: str
    model: str
    battery_percentage: int
    storage_used_gb: int
    storage_total_gb: int
    signal_strength: str
    uptime_percentage: float
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    thumbnail_url: Optional[str] = None

class CameraResponse(CameraBase):
    model_config = ConfigDict(from_attributes=True)
    last_capture_time: datetime.datetime
    zone_name: Optional[str] = None
    last_detection_species: Optional[str] = None

class CameraStatusUpdate(BaseModel):
    status: str # online, offline, maintenance

# --- Species Schemas ---
class SpeciesBase(BaseModel):
    id: str
    common_name: str
    scientific_name: str
    category: str
    rarity_status: str

class SpeciesResponse(SpeciesBase):
    model_config = ConfigDict(from_attributes=True)
    total_detections: int = 0
    estimated_unique: int = 0
    last_sighting_time: Optional[datetime.datetime] = None

# --- Detection Schemas ---
class DetectionBase(BaseModel):
    species_id: str
    camera_id: str
    zone_id: str
    confidence: float
    count: int = 1
    behaviour: str = "Walking"
    bbox_x: Optional[float] = None
    bbox_y: Optional[float] = None
    bbox_w: Optional[float] = None
    bbox_h: Optional[float] = None

class DetectionCreate(DetectionBase):
    image_url: str
    timestamp: Optional[datetime.datetime] = None

class DetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    image_url: str
    species_name: str
    scientific_name: Optional[str] = None
    confidence: float
    timestamp: datetime.datetime
    camera_id: str
    zone_id: str
    zone_name: Optional[str] = None
    count: int
    behaviour: Optional[str] = None
    is_verified: bool
    is_rare: bool
    bounding_box: Optional[BoundingBox] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class DetectionVerifyUpdate(BaseModel):
    is_verified: bool

# --- Alert Schemas ---
class AlertBase(BaseModel):
    title: str
    alert_type: str
    severity: str
    zone_id: str
    camera_id: Optional[str] = None
    description: str
    evidence: Optional[str] = None

class AlertResponse(AlertBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None

class AlertStatusUpdate(BaseModel):
    status: str # pending, acknowledged, resolved

# --- Dashboard & Telemetry Summaries ---
class TelemetryResponse(BaseModel):
    storage_used_gb: int
    storage_total_gb: int
    battery_overall_pct: int
    active_cameras_count: int
    total_cameras_count: int

class DashboardSummaryResponse(BaseModel):
    total_detections: int
    unique_animals_estimated: int
    species_identified_count: int
    active_cameras_count: int
    total_cameras_count: int
    zones_monitored_count: int
    telemetry: TelemetryResponse
    species_distribution: List[dict]
    zone_detections: List[dict]
