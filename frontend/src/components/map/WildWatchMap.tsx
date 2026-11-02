import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  AlertTriangle,
  Battery,
  Signal,
  HardDrive,
  Compass,
  Camera as CameraIcon,
  X,
  ArrowRight,
} from 'lucide-react';

import type { Camera, CameraMarkerStatus } from '../../types';
import { Badge } from '../common/Badge';
import { FOREST_ZONES_GEOJSON, type ForestZoneProperties } from '../../data/forestZonesGeoJSON';
import {
  SANCTUARY_MAP_CONFIG,
  getCameraMarkerStatus,
  RECENT_DETECTIONS,
} from '../../data/mockData';

// Custom SVG-based Leaflet DivIcon for crisp rendering and zero missing-asset issues
const createCustomMarkerIcon = (status: CameraMarkerStatus, isSelected: boolean = false) => {
  const markerColors = {
    online: {
      bg: '#10b981',       // emerald-500
      ring: '#34d399',      // emerald-400
      pulse: false,
    },
    offline: {
      bg: '#f43f5e',       // rose-500
      ring: '#fb7185',      // rose-400
      pulse: false,
    },
    alert: {
      bg: '#ea580c',       // orange-600
      ring: '#f97316',      // orange-500
      pulse: true,
    },
    maintenance: {
      bg: '#64748b',       // slate-500
      ring: '#94a3b8',      // slate-400
      pulse: false,
    },
  }[status];

  const size = isSelected ? 34 : 26;
  const iconInnerSize = isSelected ? 16 : 13;

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; cursor: pointer;">
      ${markerColors.pulse ? `
        <span style="position: absolute; inset: -5px; border-radius: 9999px; background-color: ${markerColors.ring}; opacity: 0.7; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      ` : ''}
      <span style="position: absolute; inset: -2px; border-radius: 9999px; background-color: ${markerColors.ring}; opacity: 0.35;"></span>
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; border-radius: 9999px; background-color: ${markerColors.bg}; border: 2px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2); transition: transform 0.2s ease;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconInnerSize}" height="${iconInnerSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${status === 'alert'
            ? '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
            : status === 'offline'
            ? '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'
            : status === 'maintenance'
            ? '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
            : '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'
          }
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'wildwatch-marker-div',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

// Map controller for reactive zooming, bounds fitting, and pan
function MapViewController({
  selectedCamera,
  resetTrigger,
}: {
  selectedCamera?: Camera | null;
  resetTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  // Pan to selected camera trap
  useEffect(() => {
    if (selectedCamera) {
      map.flyTo([selectedCamera.location.lat, selectedCamera.location.lng], 13, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedCamera, map]);

  // Reset to full Amazon demonstration region
  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(SANCTUARY_MAP_CONFIG.center, SANCTUARY_MAP_CONFIG.defaultZoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [resetTrigger, map]);

  return null;
}

// Map Zoom and Reset control buttons
function CustomMapControls({
  onReset,
  onToggleFullscreen,
  isFullscreen,
}: {
  onReset: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}) {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', margin: '12px' }}>
      <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-stone-200/90 overflow-hidden text-stone-700">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          title="Zoom In"
          className="p-2 hover:bg-stone-100 hover:text-emerald-700 transition flex items-center justify-center border-b border-stone-200"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          title="Zoom Out"
          className="p-2 hover:bg-stone-100 hover:text-emerald-700 transition flex items-center justify-center border-b border-stone-200"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReset}
          title="Reset Amazon View"
          className="p-2 hover:bg-stone-100 hover:text-emerald-700 transition flex items-center justify-center border-b border-stone-200"
        >
          <Compass className="w-4 h-4" />
        </button>
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}
            className="p-2 hover:bg-stone-100 hover:text-emerald-700 transition flex items-center justify-center"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export interface WildWatchMapProps {
  cameras: Camera[];
  selectedCamera?: Camera | null;
  onSelectCamera?: (camera: Camera) => void;
  height?: string;
  className?: string;
  showFilters?: boolean;
  showLegend?: boolean;
  compactMode?: boolean;
}

export const WildWatchMap: React.FC<WildWatchMapProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  height = '500px',
  className = '',
  showFilters = true,
  showLegend = true,
  compactMode = false,
}) => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'alert'>('all');
  const [zoneFilter, setZoneFilter] = useState<'all' | string>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<ForestZoneProperties | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique species across all cameras for filter dropdown
  const uniqueSpecies = useMemo(() => {
    const set = new Set<string>();
    cameras.forEach((c) => {
      if (c.lastDetection?.species) {
        set.add(c.lastDetection.species);
      }
    });
    return Array.from(set).sort();
  }, [cameras]);

  // Compute marker statuses and counts
  const statusCounts = useMemo(() => {
    let online = 0;
    let offline = 0;
    let alert = 0;
    let maintenance = 0;

    cameras.forEach((c) => {
      const st = getCameraMarkerStatus(c);
      if (st === 'alert') alert++;
      else if (st === 'offline') offline++;
      else if (st === 'maintenance') maintenance++;
      else online++;
    });

    return { online, offline, alert, maintenance, total: cameras.length };
  }, [cameras]);

  // Filter cameras according to user filters (zone, status, animal species)
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const markerStatus = getCameraMarkerStatus(cam);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'online' && markerStatus === 'online') ||
        (statusFilter === 'offline' && markerStatus === 'offline') ||
        (statusFilter === 'alert' && markerStatus === 'alert');

      const matchesZone =
        zoneFilter === 'all' ||
        cam.zone === zoneFilter ||
        cam.zoneName.toLowerCase().includes(zoneFilter.toLowerCase());

      const matchesSpecies =
        speciesFilter === 'all' ||
        cam.lastDetection?.species === speciesFilter;

      return matchesStatus && matchesZone && matchesSpecies;
    });
  }, [cameras, statusFilter, zoneFilter, speciesFilter]);

  // Filter recent detections matching the selected zone
  const selectedZoneDetections = useMemo(() => {
    if (!selectedZoneInfo) return [];
    return RECENT_DETECTIONS.filter(
      (d) =>
        d.zone === selectedZoneInfo.id ||
        d.zoneName?.toLowerCase().includes(selectedZoneInfo.id.toLowerCase())
    );
  }, [selectedZoneInfo]);

  // Style function for the 10 green Forest Zone polygons
  const getZoneStyle = (feature: any) => {
    const props = feature?.properties as ForestZoneProperties;
    const isSelected = selectedZoneInfo?.id === props?.id;
    return {
      color: props?.color || '#059669',
      weight: isSelected ? 3.5 : 2,
      opacity: isSelected ? 1 : 0.85,
      dashArray: isSelected ? '' : '4, 4',
      fillColor: props?.fillColor || '#10b981',
      fillOpacity: isSelected ? 0.36 : 0.20,
    };
  };

  // Interactive handler for GeoJSON features
  const onEachZoneFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties as ForestZoneProperties;
    // Add tooltip label for clear zone identification
    layer.bindTooltip(
      `<div class="font-bold text-xs text-stone-900">${props.id}</div><div class="text-[10px] text-stone-600">${props.name.split(' - ')[1] || props.name}</div>`,
      {
        permanent: false,
        direction: 'center',
        className: 'wildwatch-zone-tooltip',
      }
    );

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          fillOpacity: 0.34,
          dashArray: '',
        });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(getZoneStyle(feature));
      },
      click: () => {
        setSelectedZoneInfo(props);
      },
    });
  };

  const handleResetView = () => {
    setResetTrigger((prev) => prev + 1);
    setStatusFilter('all');
    setZoneFilter('all');
    setSpeciesFilter('all');
  };

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className={`relative rounded-xl overflow-hidden border border-emerald-900/20 bg-stone-100 shadow-xs flex flex-col ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Map Toolbar: Amazon Header, Filters & Reset Button */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 pointer-events-auto max-w-[calc(100%-80px)]">
        {/* Amazon Basin Region Badge */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-emerald-200/80 flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="font-bold text-stone-900">Amazon Rainforest (Brazil)</span>
          <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">
            • 10 Zones • {filteredCameras.length} Traps Visible
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-200/70">
            Illustrative Demo • Simulated
          </span>
        </div>

        {/* Filters Bar */}
        {showFilters && !compactMode && (
          <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-stone-200/90 text-[11px]">
            {/* Zone Filter */}
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 rounded px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All 10 Zones</option>
              {FOREST_ZONES_GEOJSON.features.map((f) => (
                <option key={f.properties.id} value={f.properties.id}>
                  {f.properties.id} ({f.properties.name.split(' - ')[1] || f.properties.name})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-stone-700 rounded px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All Statuses ({statusCounts.total})</option>
              <option value="online">Online ({statusCounts.online})</option>
              <option value="alert">Alerts ({statusCounts.alert})</option>
              <option value="offline">Offline ({statusCounts.offline})</option>
            </select>

            {/* Species Filter */}
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-700 rounded px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer max-w-[140px]"
            >
              <option value="all">All Species</option>
              {uniqueSpecies.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>

            {/* Reset Map View Button */}
            <button
              type="button"
              onClick={handleResetView}
              title="Reset View to Amazon Rainforest Center"
              className="px-2 py-1 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw className="w-3 h-3 text-stone-500" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Layer Visibility Toggles (Top Left Secondary) */}
      <div className="absolute top-14 left-3 z-[1000] flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-stone-200/90 text-[11px] text-stone-700 pointer-events-auto">
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800 px-1 py-0.5">
          <input
            type="checkbox"
            checked={showZones}
            onChange={(e) => setShowZones(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
          />
          <span className="font-semibold text-stone-800">10 Forest Zones</span>
        </label>
        <div className="h-3 w-px bg-stone-200"></div>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800 px-1 py-0.5">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
          />
          <span className="font-semibold text-stone-800">Camera Traps ({filteredCameras.length})</span>
        </label>
      </div>

      {/* Interactive React Leaflet Map */}
      <MapContainer
        center={SANCTUARY_MAP_CONFIG.center}
        zoom={SANCTUARY_MAP_CONFIG.defaultZoom}
        minZoom={SANCTUARY_MAP_CONFIG.minZoom}
        maxZoom={SANCTUARY_MAP_CONFIG.maxZoom}
        maxBounds={SANCTUARY_MAP_CONFIG.maxBounds}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* OpenStreetMap TileLayer with strict Attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* View Controller */}
        <MapViewController
          selectedCamera={selectedCamera}
          resetTrigger={resetTrigger}
        />

        {/* Custom Zoom & Fullscreen Controls */}
        <CustomMapControls
          onReset={handleResetView}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />

        {/* 10 Forest Zones GeoJSON Layer (Green Semi-Transparent Polygons) */}
        {showZones && (
          <GeoJSON
            key={`geojson-amazon-zones-${showZones}-${selectedZoneInfo?.id || 'none'}`}
            data={FOREST_ZONES_GEOJSON}
            style={getZoneStyle}
            onEachFeature={onEachZoneFeature}
          />
        )}

        {/* Camera Trap Markers */}
        {showMarkers &&
          filteredCameras.map((cam) => {
            const markerStatus = getCameraMarkerStatus(cam);
            const isSelected = selectedCamera?.id === cam.id;
            const icon = createCustomMarkerIcon(markerStatus, isSelected);

            return (
              <Marker
                key={cam.id}
                position={[cam.location.lat, cam.location.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    onSelectCamera?.(cam);
                  },
                }}
              >
                {/* Clicking camera shows camera ID, zone, status, last capture time, and latest detection */}
                <Popup className="wildwatch-leaflet-popup" maxWidth={330} minWidth={280}>
                  <div className="p-3 text-stone-800">
                    {/* Header: Camera ID, Status Badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CameraIcon className="w-3.5 h-3.5 text-emerald-700" />
                          <h4 className="font-bold text-sm text-stone-900 tracking-tight">
                            {cam.id}
                          </h4>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {cam.location.lat.toFixed(4)}° S, {Math.abs(cam.location.lng).toFixed(4)}° W
                        </p>
                      </div>

                      <Badge
                        variant={
                          markerStatus === 'alert'
                            ? 'alert'
                            : markerStatus === 'online'
                            ? 'online'
                            : markerStatus === 'offline'
                            ? 'offline'
                            : 'maintenance'
                        }
                        size="sm"
                        dot
                      >
                        {markerStatus.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Zone ID & Name */}
                    <div className="py-2 text-xs flex items-center justify-between text-stone-600">
                      <span className="text-stone-400">Monitoring Zone:</span>
                      <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/70">
                        {cam.zone} — {cam.zoneName.replace(/Zone \d+ - /, '')}
                      </span>
                    </div>

                    {/* Last Capture Time */}
                    <div className="pb-2 text-xs flex items-center justify-between text-stone-600">
                      <span className="text-stone-400">Last Capture Time:</span>
                      <span className="font-medium text-stone-800 text-[11px]">
                        {cam.lastCaptureTime}
                      </span>
                    </div>

                    {/* Priority Alert Banner if active */}
                    {cam.hasAlert && cam.alertDetails && (
                      <div className="mb-2 p-2 rounded-lg bg-orange-50 border border-orange-200/80 text-[11px] text-orange-900 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">{cam.alertDetails.title}</div>
                          <div className="text-[10px] text-orange-700 mt-0.5">
                            Triggered {cam.alertDetails.timestamp} • Priority: {cam.alertDetails.severity.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Latest Detection Details */}
                    <div className="rounded-lg bg-stone-50 p-2.5 border border-stone-200/80 mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Latest Wildlife Detection
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {cam.lastDetection ? cam.lastDetection.timestamp : 'Awaiting ping'}
                        </span>
                      </div>

                      {cam.lastDetection ? (
                        <div className="flex items-center gap-2.5">
                          {cam.thumbnailUrl && (
                            <img
                              src={cam.thumbnailUrl}
                              alt={cam.lastDetection.species}
                              className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0 shadow-2xs"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-stone-900 truncate">
                              {cam.lastDetection.species}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                              <span>Confidence:</span>
                              <span className="font-semibold text-emerald-700">
                                {Math.round(cam.lastDetection.confidence * 100)}%
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-400 truncate mt-0.5">
                              Model: YOLOv8-AmazonBio Edge
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-stone-400 italic py-1">
                          Camera offline. Awaiting satellite/LoRa uplink telemetry.
                        </div>
                      )}
                    </div>

                    {/* Telemetry Stats */}
                    <div className="grid grid-cols-3 gap-1 py-1.5 border-t border-stone-100 text-[10px] text-stone-600">
                      <div className="flex flex-col">
                        <span className="text-stone-400 flex items-center gap-0.5">
                          <Battery className="w-3 h-3 text-emerald-600" /> Battery
                        </span>
                        <span className={`font-semibold ${cam.batteryPercentage < 20 ? 'text-rose-600 font-bold' : 'text-stone-800'}`}>
                          {cam.batteryPercentage}%
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-stone-400 flex items-center gap-0.5">
                          <Signal className="w-3 h-3 text-sky-600" /> Signal
                        </span>
                        <span className="font-semibold text-stone-800">{cam.signalStrength}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-stone-400 flex items-center gap-0.5">
                          <HardDrive className="w-3 h-3 text-stone-400" /> Storage
                        </span>
                        <span className="font-semibold text-stone-800 truncate">
                          {cam.storageUsedGb}GB
                        </span>
                      </div>
                    </div>

                    {/* Footer: Simulated Data tag */}
                    <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                      <span>Model: {cam.model}</span>
                      <span className="text-amber-700 font-medium bg-amber-50 px-1 rounded">Simulated Node</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Map Legend Overlay (Bottom Left) */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-stone-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-lg text-white text-[11px] border border-stone-700/80 shadow-md max-w-[360px] pointer-events-auto">
          <div className="flex items-center justify-between gap-4 font-semibold text-stone-200 text-[10px] uppercase tracking-wider mb-1.5">
            <span className="text-emerald-400">Amazon Monitoring Legend</span>
            <span className="text-stone-400 lowercase font-normal">WGS84 • EPSG:4326</span>
          </div>

          {/* Camera Status Markers */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
              <span className="text-stone-300">Online ({statusCounts.online})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs"></span>
              <span className="text-stone-300">Offline ({statusCounts.offline})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-xs"></span>
              <span className="text-amber-300 font-medium">Alert ({statusCounts.alert})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-xs"></span>
              <span className="text-stone-300">Maint. ({statusCounts.maintenance})</span>
            </div>
          </div>

          {/* 10 Demonstration Zone Swatches */}
          {showZones && (
            <div className="pt-2 mt-2 border-t border-stone-800 text-[10px] text-stone-400 space-y-1">
              <div className="flex items-center justify-between font-medium text-stone-300">
                <span>10 Demonstration Zones:</span>
                <span className="text-amber-400/90 text-[9px]">Illustrative Overlays</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[9px]">
                {FOREST_ZONES_GEOJSON.features.map((f) => (
                  <button
                    key={f.properties.id}
                    type="button"
                    onClick={() => setSelectedZoneInfo(f.properties)}
                    className="flex items-center gap-1 p-0.5 rounded hover:bg-stone-800 transition text-left"
                    title={f.properties.name}
                  >
                    <span
                      className="w-2 h-2 rounded shrink-0 border border-white/30"
                      style={{ backgroundColor: f.properties.color }}
                    ></span>
                    <span className="truncate">{f.properties.id.replace('Zone ', 'Z')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Zone Details Drawer / Modal when a Zone is clicked */}
      {selectedZoneInfo && (
        <div className="absolute top-14 right-3 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl border border-emerald-200/90 shadow-xl text-stone-800 text-xs max-w-sm pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2">
          {/* Header: Zone ID & Name */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: selectedZoneInfo.color }}
                ></span>
                <h4 className="font-bold text-sm text-stone-900 tracking-tight">
                  {selectedZoneInfo.name}
                </h4>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
                {selectedZoneInfo.sectorName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedZoneInfo(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition"
              title="Close zone details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Illustrative Notice */}
          <div className="my-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-800 font-medium">
            Illustrative Demonstration Zone • Not an official forest boundary
          </div>

          {/* Habitat Description */}
          <p className="text-[11px] text-stone-600 mb-2 leading-relaxed">
            {selectedZoneInfo.habitatDescription}
          </p>

          {/* Camera Count & Online/Offline Status */}
          <div className="grid grid-cols-4 gap-1.5 bg-stone-50 p-2 rounded-lg border border-stone-200/80 mb-2.5 text-center">
            <div>
              <span className="text-[10px] text-stone-400 block">Total</span>
              <span className="font-bold text-stone-800 text-xs">{selectedZoneInfo.cameraCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 block">Online</span>
              <span className="font-bold text-emerald-700 text-xs">{selectedZoneInfo.onlineCameras}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 block">Offline</span>
              <span className="font-bold text-rose-700 text-xs">{selectedZoneInfo.offlineCameras}</span>
            </div>
            <div>
              <span className="text-[10px] text-orange-600 block">Alerts</span>
              <span className="font-bold text-orange-700 text-xs">{selectedZoneInfo.alertCameras}</span>
            </div>
          </div>

          {/* Detected Species List */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Detected Wildlife Species
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedZoneInfo.detectedSpecies.map((species) => (
                <span
                  key={species}
                  className="bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded text-[10px] font-medium"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>

          {/* Rare Sighting Alerts in this Zone */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Rare-Sighting Alerts
            </span>
            {selectedZoneInfo.rareAlerts.length > 0 ? (
              <div className="space-y-1">
                {selectedZoneInfo.rareAlerts.map((alertText, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-orange-50 border border-orange-200/80 text-[10px] text-orange-900 flex items-start gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>{alertText}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-stone-400 italic">No active rare-sighting alerts in this sector.</p>
            )}
          </div>

          {/* Recent Detections in this Zone */}
          {selectedZoneDetections.length > 0 && (
            <div className="mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Recent Detections in {selectedZoneInfo.id}
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {selectedZoneDetections.map((det) => (
                  <div
                    key={det.id}
                    className="flex items-center justify-between p-1 rounded bg-stone-50 border border-stone-100 text-[10px]"
                  >
                    <span className="font-semibold text-stone-800">{det.species}</span>
                    <span className="text-stone-400 font-mono">{det.cameraId}</span>
                    <span className="text-emerald-700 font-semibold">{Math.round(det.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action: Filter map by this zone */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setZoneFilter(selectedZoneInfo.id);
                setSelectedZoneInfo(null);
              }}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition"
            >
              Filter cameras by {selectedZoneInfo.id} <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-stone-400 font-mono">
              Area: {selectedZoneInfo.areaKm2} km²
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
