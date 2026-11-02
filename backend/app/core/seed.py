import datetime
import math
from sqlalchemy.orm import Session
from app.models import (
    Zone,
    Camera,
    Species,
    Detection,
    Alert,
    ModelVersion,
)

def seed_database(db: Session):
    """Populate database with initial baseline data if tables are empty."""
    # 1. Seed Zones
    if db.query(Zone).count() == 0:
        zones_data = [
            ("Zone A", "North Ridge", "Dense mixed deciduous forest area with high herbivore activity and significant canopy cover."),
            ("Zone B", "Waterhole", "Riparian wetland margin with seasonal watering basins, attracting evening mammal clusters."),
            ("Zone C", "Trail", "Transit ridge corridors, boulder outcrops, and natural animal highway routes."),
            ("Zone D", "Valley", "Southern bamboo-rich lowlands with perennial streams and high primate/avian diversity."),
        ]
        for z_id, name, desc in zones_data:
            db.add(Zone(id=z_id, name=name, habitat_description=desc))
        db.commit()

    # 2. Seed Species
    if db.query(Species).count() == 0:
        species_data = [
            ("sp-01", "Chital (Spotted Deer)", "Axis axis", "Mammal", "Common"),
            ("sp-02", "Wild Boar", "Sus scrofa", "Mammal", "Common"),
            ("sp-03", "Monkey (Rhesus Macaque)", "Macaca mulatta", "Mammal", "Common"),
            ("sp-04", "Peacock (Indian Peafowl)", "Pavo cristatus", "Bird", "Common"),
            ("sp-05", "Indian Leopard", "Panthera pardus fusca", "Mammal", "Vulnerable"),
            ("sp-06", "Sambar Deer", "Rusa unicolor", "Mammal", "Vulnerable"),
            ("sp-07", "Sloth Bear", "Melursus ursinus", "Mammal", "Rare"),
            ("sp-08", "Small Indian Civet", "Viverricula indica", "Mammal", "Near Threatened"),
        ]
        for s_id, cname, sname, cat, rarity in species_data:
            db.add(Species(
                id=s_id,
                common_name=cname,
                scientific_name=sname,
                category=cat,
                rarity_status=rarity,
                is_verified_baseline=True
            ))
        db.commit()

    # 3. Seed 108 Cameras
    if db.query(Camera).count() == 0:
        thumbnails = [
            "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&auto=format&fit=crop&q=70",
            "https://images.unsplash.com/photo-1590424744299-1a3eb64f6dfc?w=400&auto=format&fit=crop&q=70",
            "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=400&auto=format&fit=crop&q=70",
            "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&auto=format&fit=crop&q=70",
            "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&auto=format&fit=crop&q=70",
            "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=400&auto=format&fit=crop&q=70",
        ]

        offline_indices = [5, 18, 31, 44, 57, 63, 72, 81, 89, 95, 102, 107]
        maint_indices = [12, 38, 66, 99]

        for i in range(1, 109):
            cam_id = f"CAM-{str(i).zfill(3)}"
            
            # Zone distribution
            if i <= 24:
                zone_id = "Zone A"
                lat = 18.5230 + (math.sin(i) * 0.008)
                lng = 73.8567 + (math.cos(i) * 0.008)
                loc_name = f"Zone A - North Ridge Sector {(i % 6) + 1}"
            elif i <= 52:
                zone_id = "Zone B"
                lat = 18.5280 + (math.sin(i) * 0.009)
                lng = 73.8640 + (math.cos(i) * 0.009)
                loc_name = f"Zone B - Waterhole Sector {(i % 6) + 1}"
            elif i <= 78:
                zone_id = "Zone C"
                lat = 18.5170 + (math.sin(i) * 0.007)
                lng = 73.8490 + (math.cos(i) * 0.007)
                loc_name = f"Zone C - Trail Sector {(i % 6) + 1}"
            else:
                zone_id = "Zone D"
                lat = 18.5110 + (math.sin(i) * 0.010)
                lng = 73.8700 + (math.cos(i) * 0.010)
                loc_name = f"Zone D - Valley Sector {(i % 6) + 1}"

            # Status
            if i in offline_indices:
                status = "offline"
                battery = 8
                signal = "None"
                uptime = 71.4
            elif i in maint_indices:
                status = "maintenance"
                battery = 45
                signal = "Moderate"
                uptime = 84.2
            else:
                status = "online"
                battery = max(25, 95 - (i % 45))
                signal = "Moderate" if i % 7 == 0 else "Strong"
                uptime = 98.6

            camera = Camera(
                id=cam_id,
                name=f"Wildlife Trap {cam_id}",
                zone_id=zone_id,
                status=status,
                model="WildlifeCam Pro X" if i % 2 == 0 else "Reconyx HyperFire 2",
                battery_percentage=battery,
                storage_used_gb=280 + (i % 180),
                storage_total_gb=512,
                signal_strength=signal,
                uptime_percentage=uptime,
                latitude=round(lat, 4),
                longitude=round(lng, 4),
                location_name=loc_name,
                thumbnail_url=thumbnails[i % len(thumbnails)],
                last_capture_time=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=(i * 3) % 180)
            )
            db.add(camera)
        db.commit()

    # 4. Seed Baseline Detections
    if db.query(Detection).count() == 0:
        sample_dets = [
            ("det-001", "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&auto=format&fit=crop&q=80", "sp-01", "CAM-017", "Zone A", 0.94, 1, "Walking", 0.22, 0.24, 0.52, 0.65, True, False),
            ("det-002", "https://images.unsplash.com/photo-1590424744299-1a3eb64f6dfc?w=600&auto=format&fit=crop&q=80", "sp-02", "CAM-043", "Zone B", 0.88, 1, "Foraging", 0.15, 0.32, 0.68, 0.55, True, False),
            ("det-003", "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&auto=format&fit=crop&q=80", "sp-05", "CAM-068", "Zone C", 0.93, 1, "Walking", 0.18, 0.28, 0.65, 0.60, True, True),
            ("det-004", "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&auto=format&fit=crop&q=80", "sp-03", "CAM-029", "Zone D", 0.87, 2, "Sitting", 0.30, 0.25, 0.40, 0.60, False, False),
            ("det-005", "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop&q=80", "sp-04", "CAM-011", "Zone A", 0.89, 1, "Standing", 0.25, 0.20, 0.50, 0.70, True, False),
            ("det-006", "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&auto=format&fit=crop&q=80", "sp-01", "CAM-085", "Zone D", 0.90, 1, "Foraging", 0.20, 0.25, 0.55, 0.65, True, False),
        ]

        for d_id, img, sp_id, cam_id, z_id, conf, cnt, behav, bx, by, bw, bh, ver, rare in sample_dets:
            det = Detection(
                id=d_id,
                image_url=img,
                species_id=sp_id,
                camera_id=cam_id,
                zone_id=z_id,
                confidence=conf,
                count=cnt,
                behaviour=behav,
                bbox_x=bx,
                bbox_y=by,
                bbox_w=bw,
                bbox_h=bh,
                is_verified=ver,
                is_rare=rare,
                timestamp=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=int(d_id[-1]))
            )
            db.add(det)
        db.commit()

    # 5. Seed Alerts
    if db.query(Alert).count() == 0:
        sample_alerts = [
            ("alt-01", "Leopard activity increased", "wildlife", "high", "Zone A", "CAM-017", "Zone A - 65% higher nocturnal frequency than 30-day baseline.", "CAM-017, CAM-022 detections match corridor path"),
            ("alt-02", "Camera offline: CAM-005", "camera_outage", "medium", "Zone C", "CAM-005", "CAM-005 failed 3 consecutive ping keep-alives. Battery was 12%.", "Heartbeat lost Oct 7 14:10"),
            ("alt-03", "Sloth Bear sighted awaiting review", "rare_species", "high", "Zone A", "CAM-009", "Rare species detection: Sloth Bear with 0.92 confidence. Flagged for officer review.", "Bounding box model verification pending"),
        ]
        for a_id, title, atype, sev, z_id, c_id, desc, evid in sample_alerts:
            db.add(Alert(
                id=a_id,
                title=title,
                alert_type=atype,
                severity=sev,
                zone_id=z_id,
                camera_id=c_id,
                description=desc,
                evidence=evid,
                status="pending"
            ))
        db.commit()

    # 6. Seed Model Version
    if db.query(ModelVersion).count() == 0:
        db.add(ModelVersion(
            id="mv-01",
            version_name="YOLOv8-WildWatch-v1.2",
            framework="Ultralytics YOLOv8",
            weights_path="models/yolov8n.pt",
            confidence_floor=0.70,
            is_active=True
        ))
        db.commit()
