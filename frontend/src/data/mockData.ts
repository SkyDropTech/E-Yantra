import type {
  Camera,
  CameraMarkerStatus,
  Detection,
  SpeciesRecord,
  ZoneSummary,
  AlertItem,
  TelemetryResource,
} from '../types';

export const TELEMETRY_DATA: TelemetryResource = {
  storageUsedGb: 348,
  storageTotalGb: 500,
  batteryOverallPct: 88,
  activeCamerasCount: 92,
  totalCamerasCount: 108,
};

export const SPECIES_DISTRIBUTION = [
  { name: 'Jaguar', value: 312, percentage: 25, color: '#059669' },
  { name: 'South American Tapir', value: 248, percentage: 20, color: '#10b981' },
  { name: 'Harpy Eagle', value: 162, percentage: 13, color: '#047857' },
  { name: 'Giant River Otter', value: 150, percentage: 12, color: '#0d9488' },
  { name: 'Black Caiman', value: 138, percentage: 11, color: '#16a34a' },
  { name: 'Pink River Dolphin', value: 98, percentage: 8, color: '#0f766e' },
  { name: 'Others (Sloth, Macaw, Ocelot)', value: 140, percentage: 11, color: '#2e7d32' },
];

export const HOURLY_ACTIVITY_DATA = [
  { time: '00:00', jaguar: 14, tapir: 8, harpyEagle: 1, others: 6, total: 29 },
  { time: '02:00', jaguar: 18, tapir: 12, harpyEagle: 0, others: 5, total: 35 },
  { time: '04:00', jaguar: 22, tapir: 18, harpyEagle: 2, others: 10, total: 52 },
  { time: '06:00', jaguar: 38, tapir: 28, harpyEagle: 12, others: 24, total: 102 },
  { time: '08:00', jaguar: 42, tapir: 36, harpyEagle: 25, others: 35, total: 138 },
  { time: '10:00', jaguar: 20, tapir: 24, harpyEagle: 18, others: 30, total: 92 },
  { time: '12:00', jaguar: 10, tapir: 14, harpyEagle: 8, others: 18, total: 50 },
  { time: '14:00', jaguar: 8, tapir: 10, harpyEagle: 6, others: 14, total: 38 },
  { time: '16:00', jaguar: 24, tapir: 22, harpyEagle: 14, others: 25, total: 85 },
  { time: '18:00', jaguar: 46, tapir: 32, harpyEagle: 18, others: 30, total: 126 },
  { time: '20:00', jaguar: 32, tapir: 20, harpyEagle: 4, others: 18, total: 74 },
  { time: '22:00', jaguar: 24, tapir: 15, harpyEagle: 2, others: 10, total: 51 },
];

export const ZONE_DETECTIONS_DATA = [
  { zone: 'Zone 01', count: 184, label: 'Zone 01 (Rio Negro)', color: '#059669' },
  { zone: 'Zone 02', count: 142, label: 'Zone 02 (Anavilhanas)', color: '#10b981' },
  { zone: 'Zone 03', count: 196, label: 'Zone 03 (Jaú Canopy)', color: '#047857' },
  { zone: 'Zone 04', count: 168, label: 'Zone 04 (Terra Firme)', color: '#15803d' },
  { zone: 'Zone 05', count: 115, label: 'Zone 05 (Igapó)', color: '#0d9488' },
  { zone: 'Zone 06', count: 210, label: 'Zone 06 (Uatumã Core)', color: '#16a34a' },
  { zone: 'Zone 07', count: 132, label: 'Zone 07 (Cuieiras Valley)', color: '#0f766e' },
  { zone: 'Zone 08', count: 124, label: 'Zone 08 (Tapajós Buffer)', color: '#22c55e' },
  { zone: 'Zone 09', count: 152, label: 'Zone 09 (Mamirauá Várzea)', color: '#065f46' },
  { zone: 'Zone 10', count: 165, label: 'Zone 10 (Purus Lowlands)', color: '#2e7d32' },
];

export const RECENT_DETECTIONS: Detection[] = [
  {
    id: 'det-001',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80',
    species: 'Jaguar',
    scientificName: 'Panthera onca',
    confidence: 0.96,
    timestamp: 'Today 09:42:15 AM',
    cameraId: 'CAM-003',
    zone: 'Zone 01',
    zoneName: 'Zone 01 - Rio Negro Basin',
    location: { lat: -2.5512, lng: -60.6384, description: 'Rio Negro riparian riverbank trail' },
    count: 1,
    behaviour: 'Walking',
    boundingBox: { x: 0.22, y: 0.24, width: 0.52, height: 0.65 },
    isVerified: true,
    isRare: true,
  },
  {
    id: 'det-002',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80',
    species: 'Harpy Eagle',
    scientificName: 'Harpia harpyja',
    confidence: 0.94,
    timestamp: 'Today 09:28:40 AM',
    cameraId: 'CAM-028',
    zone: 'Zone 03',
    zoneName: 'Zone 03 - Jaú Canopy Corridor',
    location: { lat: -2.5480, lng: -60.2190, description: 'Emergent Brazil nut tree canopy' },
    count: 1,
    behaviour: 'Sitting',
    boundingBox: { x: 0.28, y: 0.18, width: 0.44, height: 0.62 },
    isVerified: true,
    isRare: true,
  },
  {
    id: 'det-003',
    image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=600&auto=format&fit=crop&q=80',
    species: 'South American Tapir',
    scientificName: 'Tapirus terrestris',
    confidence: 0.91,
    timestamp: 'Today 09:15:22 AM',
    cameraId: 'CAM-039',
    zone: 'Zone 04',
    zoneName: 'Zone 04 - Terra Firme Plateau',
    location: { lat: -2.5620, lng: -60.0120, description: 'Clay mineral lick clearing' },
    count: 2,
    behaviour: 'Foraging',
    boundingBox: { x: 0.15, y: 0.32, width: 0.68, height: 0.55 },
    isVerified: true,
  },
  {
    id: 'det-004',
    image: 'https://images.unsplash.com/photo-1551984259-281b376c6691?w=600&auto=format&fit=crop&q=80',
    species: 'Giant River Otter',
    scientificName: 'Pteronura brasiliensis',
    confidence: 0.89,
    timestamp: 'Today 08:58:10 AM',
    cameraId: 'CAM-015',
    zone: 'Zone 02',
    zoneName: 'Zone 02 - Anavilhanas Archipelago',
    location: { lat: -2.5390, lng: -60.4420, description: 'Fluvial channel sandbar' },
    count: 3,
    behaviour: 'Walking',
    boundingBox: { x: 0.18, y: 0.28, width: 0.65, height: 0.60 },
    isVerified: true,
  },
  {
    id: 'det-005',
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80',
    species: 'Brown-throated Sloth',
    scientificName: 'Bradypus tridactylus',
    confidence: 0.92,
    timestamp: 'Today 08:44:05 AM',
    cameraId: 'CAM-082',
    zone: 'Zone 08',
    zoneName: 'Zone 08 - Tapajós Transition Corridor',
    location: { lat: -2.7650, lng: -59.9880, description: 'Cecropia tree branch' },
    count: 1,
    behaviour: 'Resting',
    boundingBox: { x: 0.25, y: 0.20, width: 0.50, height: 0.70 },
    isVerified: true,
  },
  {
    id: 'det-006',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    species: 'Black Caiman',
    scientificName: 'Melanosuchus niger',
    confidence: 0.88,
    timestamp: 'Today 08:21:50 AM',
    cameraId: 'CAM-092',
    zone: 'Zone 09',
    zoneName: 'Zone 09 - Mamirauá Várzea Wetland',
    location: { lat: -2.9650, lng: -60.5280, description: 'Várzea flood lake margin' },
    count: 1,
    behaviour: 'Resting',
    boundingBox: { x: 0.20, y: 0.25, width: 0.55, height: 0.65 },
    isVerified: true,
  },
];

export const PRIORITY_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'Jaguar corridor activity surge',
    type: 'rare_species',
    severity: 'high',
    timestamp: '1 hour ago',
    zone: 'Zone 01',
    cameraId: 'CAM-003',
    description: 'Zone 01 - 45% higher nocturnal frequency detected by edge inference. Verified adult Jaguar in transit.',
    evidence: 'CAM-003, CAM-009 matching transit path',
    status: 'pending',
  },
  {
    id: 'alt-02',
    title: 'Camera offline: CAM-018',
    type: 'camera_outage',
    severity: 'medium',
    timestamp: '3 hours ago',
    zone: 'Zone 02',
    cameraId: 'CAM-018',
    description: 'CAM-018 in Anavilhanas Archipelago failed consecutive ping telemetry. Battery level dropped below 10%.',
    status: 'pending',
  },
  {
    id: 'alt-03',
    title: 'Harpy Eagle nesting verified',
    type: 'rare_species',
    severity: 'high',
    timestamp: '5 hours ago',
    zone: 'Zone 03',
    cameraId: 'CAM-028',
    description: 'Rare species detection: Harpy Eagle (Harpia harpyja) with 0.94 confidence confirmed in upper canopy.',
    status: 'pending',
  },
  {
    id: 'alt-04',
    title: 'Rare Bald Uakari troop detected',
    type: 'rare_species',
    severity: 'high',
    timestamp: '7 hours ago',
    zone: 'Zone 09',
    cameraId: 'CAM-094',
    description: 'Vulnerable Bald Uakari troop sighted foraging in flooded igapó canopy in Mamirauá reserve.',
    status: 'pending',
  },
];

// Zone metadata centers for placing simulated cameras realistically inside each zone polygon
const ZONE_GEO_CENTERS: Record<string, { lat: number; lng: number; name: string }> = {
  'Zone 01': { lat: -2.5600, lng: -60.6400, name: 'Zone 01 - Rio Negro Basin' },
  'Zone 02': { lat: -2.5550, lng: -60.4350, name: 'Zone 02 - Anavilhanas Archipelago' },
  'Zone 03': { lat: -2.5650, lng: -60.2250, name: 'Zone 03 - Jaú Canopy Corridor' },
  'Zone 04': { lat: -2.5750, lng: -60.0050, name: 'Zone 04 - Terra Firme Plateau' },
  'Zone 05': { lat: -2.7650, lng: -60.6450, name: 'Zone 05 - Igapó Flooded Forest' },
  'Zone 06': { lat: -2.7600, lng: -60.4350, name: 'Zone 06 - Uatumã Biological Reserve' },
  'Zone 07': { lat: -2.7650, lng: -60.2250, name: 'Zone 07 - Cuieiras River Valley' },
  'Zone 08': { lat: -2.7750, lng: -60.0050, name: 'Zone 08 - Tapajós Transition Corridor' },
  'Zone 09': { lat: -2.9750, lng: -60.5400, name: 'Zone 09 - Mamirauá Várzea Wetland' },
  'Zone 10': { lat: -2.9800, lng: -60.1150, name: 'Zone 10 - Purus River Lowlands' },
};

// Generate 108 realistic camera devices distributed across all 10 Amazon Rainforest demonstration zones
export const CAMERAS_108: Camera[] = Array.from({ length: 108 }, (_, i) => {
  const index = i + 1;
  const idStr = `CAM-${index.toString().padStart(3, '0')}`;

  // Distribute 108 cameras across 10 zones:
  // Zone 01: 1-11 (11 cams)
  // Zone 02: 12-22 (11 cams)
  // Zone 03: 23-33 (11 cams)
  // Zone 04: 34-44 (11 cams)
  // Zone 05: 45-55 (11 cams)
  // Zone 06: 56-66 (11 cams)
  // Zone 07: 67-77 (11 cams)
  // Zone 08: 78-88 (11 cams)
  // Zone 09: 89-98 (10 cams)
  // Zone 10: 99-108 (10 cams)
  let zoneId = 'Zone 01';
  let zoneIndex = 1;

  if (index <= 11) {
    zoneId = 'Zone 01';
    zoneIndex = 1;
  } else if (index <= 22) {
    zoneId = 'Zone 02';
    zoneIndex = 2;
  } else if (index <= 33) {
    zoneId = 'Zone 03';
    zoneIndex = 3;
  } else if (index <= 44) {
    zoneId = 'Zone 04';
    zoneIndex = 4;
  } else if (index <= 55) {
    zoneId = 'Zone 05';
    zoneIndex = 5;
  } else if (index <= 66) {
    zoneId = 'Zone 06';
    zoneIndex = 6;
  } else if (index <= 77) {
    zoneId = 'Zone 07';
    zoneIndex = 7;
  } else if (index <= 88) {
    zoneId = 'Zone 08';
    zoneIndex = 8;
  } else if (index <= 98) {
    zoneId = 'Zone 09';
    zoneIndex = 9;
  } else {
    zoneId = 'Zone 10';
    zoneIndex = 10;
  }

  const zoneCenter = ZONE_GEO_CENTERS[zoneId];
  // Pseudo-random dispersion inside the zone bounds
  const offsetLat = Math.sin(index * 1.7) * 0.055;
  const offsetLng = Math.cos(index * 1.9) * 0.055;
  const lat = Number((zoneCenter.lat + offsetLat).toFixed(4));
  const lng = Number((zoneCenter.lng + offsetLng).toFixed(4));

  // Assigned operational statuses: 92 Online, 12 Offline, 4 Maintenance
  let status: Camera['status'] = 'online';
  if ([5, 18, 31, 44, 55, 63, 72, 81, 89, 95, 102, 107].includes(index)) {
    status = 'offline';
  } else if ([12, 38, 66, 99].includes(index)) {
    status = 'maintenance';
  }

  // Active conservation alerts
  let hasAlert = false;
  let alertDetails: Camera['alertDetails'] = undefined;
  if (index === 3) {
    hasAlert = true;
    alertDetails = {
      title: 'Rare species: Adult Jaguar verified',
      severity: 'high',
      timestamp: '1 hour ago',
    };
  } else if (index === 17) {
    hasAlert = true;
    alertDetails = {
      title: 'River dolphin pod migration surge',
      severity: 'medium',
      timestamp: '2 hours ago',
    };
  } else if (index === 28) {
    hasAlert = true;
    alertDetails = {
      title: 'Harpy Eagle canopy nesting verified',
      severity: 'high',
      timestamp: '5 hours ago',
    };
  } else if (index === 42) {
    hasAlert = true;
    alertDetails = {
      title: 'Peccary herd nocturnal stream crossing',
      severity: 'medium',
      timestamp: '4 hours ago',
    };
  } else if (index === 62) {
    hasAlert = true;
    alertDetails = {
      title: 'Melanistic Jaguar confirmed on trail',
      severity: 'high',
      timestamp: '6 hours ago',
    };
  } else if (index === 75) {
    hasAlert = true;
    alertDetails = {
      title: 'Giant Anteater foraging detected',
      severity: 'medium',
      timestamp: '8 hours ago',
    };
  } else if (index === 94) {
    hasAlert = true;
    alertDetails = {
      title: 'Rare Bald Uakari troop sighted',
      severity: 'high',
      timestamp: '7 hours ago',
    };
  } else if (index === 104) {
    hasAlert = true;
    alertDetails = {
      title: 'Tapir mother & calf recorded',
      severity: 'medium',
      timestamp: '3 hours ago',
    };
  }

  const amazonSpecies = [
    'Jaguar',
    'South American Tapir',
    'Harpy Eagle',
    'Giant River Otter',
    'Black Caiman',
    'Pink River Dolphin',
    'Brown-throated Sloth',
    'Ocelot',
    'Capybara',
    'Scarlet Macaw',
    'Giant Anteater',
    'Red Howler Monkey',
  ];
  const species = amazonSpecies[(index * 3) % amazonSpecies.length];

  const thumbnails = [
    'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=400&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1551984259-281b376c6691?w=400&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=400&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=70',
  ];

  return {
    id: idStr,
    name: `Amazon Trap Node ${idStr}`,
    zone: zoneId as Camera['zone'],
    zoneName: zoneCenter.name,
    status,
    hasAlert,
    alertDetails,
    lastCaptureTime: status === 'offline' ? 'Yesterday 18:20:14' : 'Today 09:35:10',
    lastDetection: status === 'offline' ? undefined : {
      species,
      timestamp: 'Today 09:32 AM',
      confidence: 0.86 + ((index % 12) * 0.01),
    },
    location: {
      lat,
      lng,
      name: `${zoneCenter.name} • Sector ${(index % 4) + 1}`,
    },
    model: index % 2 === 0 ? 'AmazonCam Solar 4K' : 'Reconyx HyperFire 2 Solar',
    batteryPercentage: status === 'offline' ? 7 : Math.max(28, 98 - (index % 40)),
    storageUsedGb: 240 + (index % 190),
    storageTotalGb: 512,
    signalStrength: status === 'offline' ? 'None' : (index % 6 === 0 ? 'Moderate' : 'Strong'),
    uptimePercentage: status === 'offline' ? 68.2 : (status === 'maintenance' ? 82.5 : 99.1),
    thumbnailUrl: thumbnails[index % thumbnails.length],
  };
});

// Zone Summaries for all 10 zones + backward compatibility aliases
export const ZONE_SUMMARIES: Record<string, ZoneSummary> = {
  'Zone 01': {
    id: 'Zone 01',
    name: 'Rio Negro Basin',
    habitatDescription: 'Dense igapó blackwater flooded forest and riverine gallery trees with high aquatic mammal biodiversity.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 184,
    estimatedUniqueAnimals: 38,
    speciesObserved: 14,
    rareSpeciesCount: 2,
    mostCommonSpecies: 'Jaguar',
    mostCommonPercentage: 32,
    recentIssues: [
      { cameraId: 'CAM-005', issue: 'Solar cell shading by emergent vines', date: 'Oct 8, 2026' },
    ],
  },
  'Zone 02': {
    id: 'Zone 02',
    name: 'Anavilhanas Archipelago',
    habitatDescription: 'Extensive river island labyrinth with seasonal flood variations and sandbank reptile nesting.',
    totalCameras: 11,
    onlineCameras: 9,
    offlineCameras: 2,
    maintenanceCameras: 0,
    uptimePercentage: 82,
    totalDetections: 142,
    estimatedUniqueAnimals: 32,
    speciesObserved: 12,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'Pink River Dolphin',
    mostCommonPercentage: 28,
    recentIssues: [
      { cameraId: 'CAM-018', issue: 'Battery depletion (9%) due to persistent canopy shade', date: 'Oct 9, 2026' },
    ],
  },
  'Zone 03': {
    id: 'Zone 03',
    name: 'Jaú Canopy Corridor',
    habitatDescription: 'Primary high-canopy terra firme rainforest with emergent trees reaching 45m and apex raptors.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 196,
    estimatedUniqueAnimals: 42,
    speciesObserved: 16,
    rareSpeciesCount: 3,
    mostCommonSpecies: 'Harpy Eagle',
    mostCommonPercentage: 26,
    recentIssues: [
      { cameraId: 'CAM-031', issue: 'Lens moisture sensor trigger', date: 'Oct 7, 2026' },
    ],
  },
  'Zone 04': {
    id: 'Zone 04',
    name: 'Terra Firme Plateau',
    habitatDescription: 'Well-drained clay soil rainforest with giant Bertholletia trees, deeply rutted tapir trails, and peccary herds.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 168,
    estimatedUniqueAnimals: 36,
    speciesObserved: 13,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'South American Tapir',
    mostCommonPercentage: 34,
    recentIssues: [
      { cameraId: 'CAM-044', issue: 'RF telemetry repeater sync delay', date: 'Oct 8, 2026' },
    ],
  },
  'Zone 05': {
    id: 'Zone 05',
    name: 'Igapó Flooded Forest',
    habitatDescription: 'Seasonally inundated blackwater woodland supporting endemic aquatic fauna and canopy primates.',
    totalCameras: 11,
    onlineCameras: 9,
    offlineCameras: 2,
    maintenanceCameras: 0,
    uptimePercentage: 82,
    totalDetections: 115,
    estimatedUniqueAnimals: 26,
    speciesObserved: 11,
    rareSpeciesCount: 0,
    mostCommonSpecies: 'Red Howler Monkey',
    mostCommonPercentage: 30,
    recentIssues: [
      { cameraId: 'CAM-055', issue: 'High water level warning on tree mount', date: 'Oct 6, 2026' },
    ],
  },
  'Zone 06': {
    id: 'Zone 06',
    name: 'Uatumã Biological Reserve',
    habitatDescription: 'Strict protection core reserve featuring old-growth stands and big cat breeding corridors.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 210,
    estimatedUniqueAnimals: 48,
    speciesObserved: 18,
    rareSpeciesCount: 2,
    mostCommonSpecies: 'Jaguar',
    mostCommonPercentage: 36,
    recentIssues: [
      { cameraId: 'CAM-063', issue: 'Optical obstruction by lianas', date: 'Oct 7, 2026' },
    ],
  },
  'Zone 07': {
    id: 'Zone 07',
    name: 'Cuieiras River Valley',
    habitatDescription: 'Meandering forest stream valleys lined with natural mineral salt licks that attract ungulates.',
    totalCameras: 11,
    onlineCameras: 9,
    offlineCameras: 2,
    maintenanceCameras: 0,
    uptimePercentage: 82,
    totalDetections: 132,
    estimatedUniqueAnimals: 28,
    speciesObserved: 12,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'Giant Anteater',
    mostCommonPercentage: 24,
    recentIssues: [
      { cameraId: 'CAM-072', issue: 'Intermittent LoRa gateway packet drop', date: 'Oct 8, 2026' },
    ],
  },
  'Zone 08': {
    id: 'Zone 08',
    name: 'Tapajós Transition Corridor',
    habitatDescription: 'Dense submontane tropical canopy transitioning into clearwater basins with abundant frugivore birds.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 124,
    estimatedUniqueAnimals: 27,
    speciesObserved: 13,
    rareSpeciesCount: 0,
    mostCommonSpecies: 'Brown-throated Sloth',
    mostCommonPercentage: 29,
    recentIssues: [
      { cameraId: 'CAM-081', issue: 'SD card write endurance threshold reached (92%)', date: 'Oct 5, 2026' },
    ],
  },
  'Zone 09': {
    id: 'Zone 09',
    name: 'Mamirauá Várzea Wetland',
    habitatDescription: 'Alluvial floodplain subject to major seasonal inundation pulses, critical habitat for uakaris and caimans.',
    totalCameras: 10,
    onlineCameras: 8,
    offlineCameras: 2,
    maintenanceCameras: 0,
    uptimePercentage: 80,
    totalDetections: 152,
    estimatedUniqueAnimals: 34,
    speciesObserved: 14,
    rareSpeciesCount: 2,
    mostCommonSpecies: 'Black Caiman',
    mostCommonPercentage: 35,
    recentIssues: [
      { cameraId: 'CAM-089', issue: 'Solar regulator thermal trip in high humidity', date: 'Oct 9, 2026' },
    ],
  },
  'Zone 10': {
    id: 'Zone 10',
    name: 'Purus River Lowlands',
    habitatDescription: 'Lowland tropical evergreen rainforest along south river meanders with dense undergrowth and tapir trails.',
    totalCameras: 10,
    onlineCameras: 9,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 90,
    totalDetections: 165,
    estimatedUniqueAnimals: 37,
    speciesObserved: 15,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'South American Tapir',
    mostCommonPercentage: 31,
    recentIssues: [
      { cameraId: 'CAM-102', issue: 'Firmware hash mismatch, scheduled for patch', date: 'Oct 6, 2026' },
    ],
  },
  // Backward compatibility aliases
  'Zone A': {
    id: 'Zone 01',
    name: 'Rio Negro Basin',
    habitatDescription: 'Dense igapó blackwater flooded forest and riverine gallery trees with high aquatic mammal biodiversity.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 184,
    estimatedUniqueAnimals: 38,
    speciesObserved: 14,
    rareSpeciesCount: 2,
    mostCommonSpecies: 'Jaguar',
    mostCommonPercentage: 32,
    recentIssues: [],
  },
  'Zone B': {
    id: 'Zone 02',
    name: 'Anavilhanas Archipelago',
    habitatDescription: 'Extensive river island labyrinth with seasonal flood variations.',
    totalCameras: 11,
    onlineCameras: 9,
    offlineCameras: 2,
    maintenanceCameras: 0,
    uptimePercentage: 82,
    totalDetections: 142,
    estimatedUniqueAnimals: 32,
    speciesObserved: 12,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'Pink River Dolphin',
    mostCommonPercentage: 28,
    recentIssues: [],
  },
  'Zone C': {
    id: 'Zone 03',
    name: 'Jaú Canopy Corridor',
    habitatDescription: 'Primary high-canopy terra firme rainforest with emergent trees reaching 45m.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 196,
    estimatedUniqueAnimals: 42,
    speciesObserved: 16,
    rareSpeciesCount: 3,
    mostCommonSpecies: 'Harpy Eagle',
    mostCommonPercentage: 26,
    recentIssues: [],
  },
  'Zone D': {
    id: 'Zone 04',
    name: 'Terra Firme Plateau',
    habitatDescription: 'Well-drained clay soil rainforest with giant Bertholletia trees.',
    totalCameras: 11,
    onlineCameras: 10,
    offlineCameras: 1,
    maintenanceCameras: 0,
    uptimePercentage: 91,
    totalDetections: 168,
    estimatedUniqueAnimals: 36,
    speciesObserved: 13,
    rareSpeciesCount: 1,
    mostCommonSpecies: 'South American Tapir',
    mostCommonPercentage: 34,
    recentIssues: [],
  },
};

export const SPECIES_RECORDS: SpeciesRecord[] = [
  {
    id: 'sp-01',
    name: 'Jaguar',
    scientificName: 'Panthera onca',
    category: 'Mammal',
    totalDetections: 312,
    estimatedUnique: 24,
    percentage: 25,
    rarity: 'Near Threatened',
    lastSightingTime: 'Today 09:42 AM',
    lastCameraId: 'CAM-003',
    zonePresence: {
      'Zone 01': 58,
      'Zone 02': 22,
      'Zone 03': 46,
      'Zone 04': 38,
      'Zone 05': 12,
      'Zone 06': 64,
      'Zone 07': 24,
      'Zone 08': 16,
      'Zone 09': 14,
      'Zone 10': 18,
      'Zone A': 58,
      'Zone B': 22,
      'Zone C': 46,
      'Zone D': 38,
    },
    needsVerification: false,
  },
  {
    id: 'sp-02',
    name: 'South American Tapir',
    scientificName: 'Tapirus terrestris',
    category: 'Mammal',
    totalDetections: 248,
    estimatedUnique: 34,
    percentage: 20,
    rarity: 'Vulnerable',
    lastSightingTime: 'Today 09:15 AM',
    lastCameraId: 'CAM-039',
    zonePresence: {
      'Zone 01': 20,
      'Zone 02': 14,
      'Zone 03': 28,
      'Zone 04': 48,
      'Zone 05': 18,
      'Zone 06': 32,
      'Zone 07': 22,
      'Zone 08': 20,
      'Zone 09': 16,
      'Zone 10': 30,
      'Zone A': 20,
      'Zone B': 14,
      'Zone C': 28,
      'Zone D': 48,
    },
    needsVerification: false,
  },
  {
    id: 'sp-03',
    name: 'Harpy Eagle',
    scientificName: 'Harpia harpyja',
    category: 'Bird',
    totalDetections: 162,
    estimatedUnique: 8,
    percentage: 13,
    rarity: 'Vulnerable',
    lastSightingTime: 'Today 09:28 AM',
    lastCameraId: 'CAM-028',
    zonePresence: {
      'Zone 01': 14,
      'Zone 02': 10,
      'Zone 03': 44,
      'Zone 04': 26,
      'Zone 05': 8,
      'Zone 06': 30,
      'Zone 07': 12,
      'Zone 08': 8,
      'Zone 09': 4,
      'Zone 10': 6,
      'Zone A': 14,
      'Zone B': 10,
      'Zone C': 44,
      'Zone D': 26,
    },
    needsVerification: true,
  },
  {
    id: 'sp-04',
    name: 'Giant River Otter',
    scientificName: 'Pteronura brasiliensis',
    category: 'Mammal',
    totalDetections: 150,
    estimatedUnique: 18,
    percentage: 12,
    rarity: 'Endangered',
    lastSightingTime: 'Today 08:58 AM',
    lastCameraId: 'CAM-015',
    zonePresence: {
      'Zone 01': 32,
      'Zone 02': 38,
      'Zone 03': 12,
      'Zone 04': 6,
      'Zone 05': 24,
      'Zone 06': 8,
      'Zone 07': 10,
      'Zone 08': 4,
      'Zone 09': 12,
      'Zone 10': 4,
      'Zone A': 32,
      'Zone B': 38,
      'Zone C': 12,
      'Zone D': 6,
    },
    needsVerification: false,
  },
  {
    id: 'sp-05',
    name: 'Black Caiman',
    scientificName: 'Melanosuchus niger',
    category: 'Reptile',
    totalDetections: 138,
    estimatedUnique: 22,
    percentage: 11,
    rarity: 'Common',
    lastSightingTime: 'Today 08:21 AM',
    lastCameraId: 'CAM-092',
    zonePresence: {
      'Zone 01': 16,
      'Zone 02': 28,
      'Zone 03': 8,
      'Zone 04': 4,
      'Zone 05': 22,
      'Zone 06': 6,
      'Zone 07': 8,
      'Zone 08': 4,
      'Zone 09': 36,
      'Zone 10': 6,
      'Zone A': 16,
      'Zone B': 28,
      'Zone C': 8,
      'Zone D': 4,
    },
  },
  {
    id: 'sp-06',
    name: 'Pink River Dolphin (Boto)',
    scientificName: 'Inia geoffrensis',
    category: 'Mammal',
    totalDetections: 98,
    estimatedUnique: 15,
    percentage: 8,
    rarity: 'Endangered',
    lastSightingTime: 'Today 07:44 AM',
    lastCameraId: 'CAM-017',
    zonePresence: {
      'Zone 01': 24,
      'Zone 02': 34,
      'Zone 03': 6,
      'Zone 04': 2,
      'Zone 05': 16,
      'Zone 06': 4,
      'Zone 07': 4,
      'Zone 08': 2,
      'Zone 09': 6,
      'Zone 10': 0,
      'Zone A': 24,
      'Zone B': 34,
      'Zone C': 6,
      'Zone D': 2,
    },
    needsVerification: true,
  },
  {
    id: 'sp-07',
    name: 'Brown-throated Sloth',
    scientificName: 'Bradypus tridactylus',
    category: 'Mammal',
    totalDetections: 82,
    estimatedUnique: 16,
    percentage: 6,
    rarity: 'Common',
    lastSightingTime: 'Today 08:44 AM',
    lastCameraId: 'CAM-082',
    zonePresence: {
      'Zone 01': 6,
      'Zone 02': 4,
      'Zone 03': 18,
      'Zone 04': 12,
      'Zone 05': 8,
      'Zone 06': 10,
      'Zone 07': 10,
      'Zone 08': 12,
      'Zone 09': 2,
      'Zone 10': 0,
      'Zone A': 6,
      'Zone B': 4,
      'Zone C': 18,
      'Zone D': 12,
    },
  },
];

export const SANCTUARY_MAP_CONFIG = {
  center: [-2.7800, -60.3200] as [number, number],
  defaultZoom: 10,
  minZoom: 8,
  maxZoom: 18,
  maxBounds: [
    [-4.5000, -62.5000],
    [-1.0000, -58.0000],
  ] as [[number, number], [number, number]],
  isSimulatedData: true,
  regionName: 'Central Amazon Rainforest Basin (Amazonas, Brazil)',
  coordinateSystem: 'WGS84 (EPSG:4326)',
  zoneCount: 10,
  disclaimer: 'Illustrative Demonstration Zones • Simulated Field Data',
};

export const getCameraMarkerStatus = (camera: Camera): CameraMarkerStatus => {
  if (camera.hasAlert) return 'alert';
  if (camera.status === 'offline') return 'offline';
  if (camera.status === 'maintenance') return 'maintenance';
  return 'online';
};
