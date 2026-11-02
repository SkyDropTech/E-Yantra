import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class Zone(Base):
    __tablename__ = "zones"

    id = Column(String(50), primary_key=True, index=True) # e.g. "Zone A"
    name = Column(String(100), nullable=False)            # e.g. "North Ridge"
    habitat_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    cameras = relationship("Camera", back_populates="zone_rel")
    detections = relationship("Detection", back_populates="zone_rel")
    alerts = relationship("Alert", back_populates="zone_rel")


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String(50), primary_key=True, index=True) # e.g. "CAM-001"
    name = Column(String(100), nullable=False)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False, index=True)
    status = Column(String(20), default="online", index=True) # online, offline, maintenance
    model = Column(String(100), default="WildlifeCam Pro X")
    battery_percentage = Column(Integer, default=100)
    storage_used_gb = Column(Integer, default=200)
    storage_total_gb = Column(Integer, default=512)
    signal_strength = Column(String(20), default="Strong")
    uptime_percentage = Column(Float, default=95.0)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(150), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    last_capture_time = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    zone_rel = relationship("Zone", back_populates="cameras")
    detections = relationship("Detection", back_populates="camera_rel")
    health_events = relationship("CameraHealthEvent", back_populates="camera_rel")
    alerts = relationship("Alert", back_populates="camera_rel")


class Species(Base):
    __tablename__ = "species"

    id = Column(String(50), primary_key=True, index=True) # e.g. "sp-01"
    common_name = Column(String(100), nullable=False, index=True)
    scientific_name = Column(String(100), nullable=False)
    category = Column(String(50), default="Mammal")       # Mammal, Bird, Reptile
    rarity_status = Column(String(50), default="Common")  # Common, Vulnerable, Rare
    is_verified_baseline = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    detections = relationship("Detection", back_populates="species_rel")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(String(50), primary_key=True, index=True) # e.g. "det-001"
    image_url = Column(String(500), nullable=False)
    species_id = Column(String(50), ForeignKey("species.id"), nullable=False, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.id"), nullable=False, index=True)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False, index=True)
    confidence = Column(Float, nullable=False, index=True)
    count = Column(Integer, default=1)
    behaviour = Column(String(50), default="Walking")
    
    # Normalized bounding box coordinates (0.0 to 1.0)
    bbox_x = Column(Float, nullable=True)
    bbox_y = Column(Float, nullable=True)
    bbox_w = Column(Float, nullable=True)
    bbox_h = Column(Float, nullable=True)

    is_verified = Column(Boolean, default=False, index=True)
    is_rare = Column(Boolean, default=False, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    created_at = Column(DateTime, default=utc_now)

    species_rel = relationship("Species", back_populates="detections")
    camera_rel = relationship("Camera", back_populates="detections")
    zone_rel = relationship("Zone", back_populates="detections")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(String(50), primary_key=True, index=True)
    species_id = Column(String(50), ForeignKey("species.id"), nullable=False)
    primary_zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    estimated_individual_count = Column(Integer, default=1)
    association_confidence = Column(Float, default=0.85)
    association_evidence = Column(Text, nullable=True) # e.g. "Associated sightings CAM-017 & CAM-022 within 14 min"
    status = Column(String(20), default="provisional") # provisional, confirmed, rejected
    start_time = Column(DateTime, default=utc_now)
    end_time = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)


class CameraHealthEvent(Base):
    __tablename__ = "camera_health_events"

    id = Column(String(50), primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False) # low_battery, ping_timeout, lens_obscured
    severity = Column(String(20), default="medium")  # low, medium, high
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=utc_now)

    camera_rel = relationship("Camera", back_populates="health_events")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    alert_type = Column(String(50), default="wildlife") # wildlife, camera_outage, anomaly, rare_species
    severity = Column(String(20), default="medium")     # high, medium, low
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    camera_id = Column(String(50), ForeignKey("cameras.id"), nullable=True)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    status = Column(String(20), default="pending")      # pending, acknowledged, resolved
    created_at = Column(DateTime, default=utc_now)
    resolved_at = Column(DateTime, nullable=True)

    zone_rel = relationship("Zone", back_populates="alerts")
    camera_rel = relationship("Camera", back_populates="alerts")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(50), primary_key=True, index=True)
    version_name = Column(String(100), nullable=False)
    framework = Column(String(50), default="Ultralytics YOLOv8")
    weights_path = Column(String(250), nullable=False)
    confidence_floor = Column(Float, default=0.70)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(50), primary_key=True, index=True)
    actor = Column(String(100), default="Ranger Admin")
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(50), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
