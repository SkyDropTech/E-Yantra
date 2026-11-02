export type CameraStatus = 'online' | 'offline' | 'maintenance' | 'alert';

export type CameraMarkerStatus = 'online' | 'offline' | 'alert' | 'maintenance';

export type ZoneId =
  | 'Zone 01'
  | 'Zone 02'
  | 'Zone 03'
  | 'Zone 04'
  | 'Zone 05'
  | 'Zone 06'
  | 'Zone 07'
  | 'Zone 08'
  | 'Zone 09'
  | 'Zone 10'
  | 'Zone A'
  | 'Zone B'
  | 'Zone C'
  | 'Zone D'
  | string;

export interface BoundingBox {
  x: number;      // 0-1 normalized or pixel coordinates
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  image: string;
  species: string;
  scientificName?: string;
  commonName?: string;
  confidence: number;
  timestamp: string;
  cameraId: string;
  zone: ZoneId;
  zoneName?: string;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  count: number;
  behaviour?: 'Walking' | 'Foraging' | 'Resting' | 'Running' | 'Sitting' | 'Standing';
  boundingBox?: BoundingBox;
  isVerified?: boolean;
  isRare?: boolean;
}

export interface Camera {
  id: string;
  name: string;
  zone: ZoneId;
  zoneName: string;
  status: CameraStatus;
  hasAlert?: boolean;
  alertDetails?: {
    title: string;
    severity: 'high' | 'medium' | 'low';
    timestamp: string;
  };
  lastCaptureTime: string;
  lastDetection?: {
    species: string;
    timestamp: string;
    confidence: number;
  };
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  model: string;
  batteryPercentage: number;
  storageUsedGb: number;
  storageTotalGb: number;
  signalStrength: 'Strong' | 'Moderate' | 'Weak' | 'None';
  uptimePercentage: number;
  thumbnailUrl: string;
}

export interface SpeciesRecord {
  id: string;
  name: string;
  scientificName: string;
  category: 'Mammal' | 'Bird' | 'Reptile';
  totalDetections: number;
  estimatedUnique: number;
  percentage: number;
  rarity: 'Common' | 'Vulnerable' | 'Endangered' | 'Rare' | 'Near Threatened';
  lastSightingTime: string;
  lastCameraId: string;
  zonePresence: Record<string, number>;
  needsVerification?: boolean;
}

export interface ZoneSummary {
  id: ZoneId;
  name: string;
  habitatDescription: string;
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  maintenanceCameras: number;
  uptimePercentage: number;
  totalDetections: number;
  estimatedUniqueAnimals: number;
  speciesObserved: number;
  rareSpeciesCount: number;
  mostCommonSpecies: string;
  mostCommonPercentage: number;
  recentIssues: Array<{
    cameraId: string;
    issue: string;
    date: string;
  }>;
}

export interface AlertItem {
  id: string;
  title: string;
  type: 'wildlife' | 'camera_outage' | 'anomaly' | 'rare_species';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  zone: ZoneId;
  cameraId?: string;
  description: string;
  evidence?: string;
  status: 'pending' | 'acknowledged' | 'resolved';
}

export interface TelemetryResource {
  storageUsedGb: number;
  storageTotalGb: number;
  batteryOverallPct: number;
  activeCamerasCount: number;
  totalCamerasCount: number;
}
