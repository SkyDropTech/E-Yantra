import React, { useState, useMemo } from 'react';
import {
  Video,
  Camera as CameraIcon,
  Search,
  Grid,
  List,
  Battery,
  HardDrive,
  Signal,
  Sliders,
  Download,
  History,
  Activity,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { CAMERAS_108, RECENT_DETECTIONS, ZONE_SUMMARIES } from '../data/mockData';
import type { Camera, CameraStatus, ZoneId } from '../types';

export const LiveMonitoringPage: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera>(CAMERAS_108[0]);
  const [activeTab, setActiveTab] = useState<'live' | 'details' | 'detections' | 'analytics'>('live');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36; // 3 pages for 108 cameras

  // Filter cameras
  const filteredCameras = useMemo(() => {
    return CAMERAS_108.filter((cam) => {
      const matchesSearch =
        cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.location.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = zoneFilter === 'all' || cam.zone === zoneFilter;
      const matchesStatus = statusFilter === 'all' || cam.status === statusFilter;
      return matchesSearch && matchesZone && matchesStatus;
    });
  }, [searchQuery, zoneFilter, statusFilter]);

  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
  const paginatedCameras = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCameras.slice(start, start + itemsPerPage);
  }, [filteredCameras, currentPage]);

  const onlineCount = CAMERAS_108.filter(c => c.status === 'online').length;
  const offlineCount = CAMERAS_108.filter(c => c.status === 'offline').length;
  const maintenanceCount = CAMERAS_108.filter(c => c.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        subtitle="Monitor 100+ camera traps across forest zones in real-time"
        badge={
          <Badge variant="online" size="md" dot>
            Simulated Live Polling (15s)
          </Badge>
        }
        tagline="Hardware Health & Environmental Telemetry"
      />

      {/* KPI Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Total Cameras</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">108</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Configured traps</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-emerald-600 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{onlineCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">85% operational</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-rose-600 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Offline
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{offlineCount}</div>
          <div className="text-[10px] text-rose-500 font-medium mt-0.5">11% unreachable</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-amber-600 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Maintenance
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{maintenanceCount}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">4% servicing</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Animals (1h)</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">186</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Recent sightings</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Species Today</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">23</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Unique taxa logged</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-stone-500 uppercase">System Health</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">85%</div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left (Camera Inventory + Feed), Right (Selected Camera Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 108 Cameras Grid / List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative w-full max-w-xs">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search CAM-001 or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Zone Filter */}
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 text-stone-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">All Zones (4)</option>
                <option value="Zone A">Zone A (24)</option>
                <option value="Zone B">Zone B (28)</option>
                <option value="Zone C">Zone C (26)</option>
                <option value="Zone D">Zone D (30)</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 text-stone-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">All Statuses</option>
                <option value="online">Online (92)</option>
                <option value="offline">Offline (12)</option>
                <option value="maintenance">Maintenance (4)</option>
              </select>
            </div>

            {/* View Mode & Page Info */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-400 hidden sm:inline">
                Showing {paginatedCameras.length} of {filteredCameras.length}
              </span>

              <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-500'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-500'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Camera Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {paginatedCameras.map((cam) => {
                const isSelected = selectedCamera.id === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamera(cam)}
                    className={`group cursor-pointer rounded-xl border overflow-hidden bg-white transition duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-stone-200/90 hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="relative h-24 w-full bg-stone-800 overflow-hidden">
                      {cam.status === 'offline' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-500">
                          <CameraIcon className="w-6 h-6 opacity-40 mb-1" />
                          <span className="text-[10px] font-semibold text-rose-400">OFFLINE</span>
                        </div>
                      ) : (
                        <img
                          src={cam.thumbnailUrl}
                          alt={cam.id}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}

                      {/* Status Tag */}
                      <div className="absolute top-1.5 left-1.5">
                        <Badge
                          variant={cam.status === 'online' ? 'online' : cam.status === 'offline' ? 'offline' : 'maintenance'}
                          size="sm"
                          dot
                        >
                          {cam.status === 'online' ? 'LIVE' : cam.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Battery Pill */}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Battery className="w-2.5 h-2.5" />
                        {cam.batteryPercentage}%
                      </div>
                    </div>

                    <div className="p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">{cam.id}</span>
                        <span className="text-[10px] font-medium text-stone-500">{cam.zone}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 truncate">
                        {cam.lastDetection ? `Recent: ${cam.lastDetection.species}` : 'No recent detection'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Camera ID</th>
                    <th className="py-2.5 px-4">Zone & Location</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Battery</th>
                    <th className="py-2.5 px-4">Last Detection</th>
                    <th className="py-2.5 px-4">Uptime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {paginatedCameras.map((cam) => (
                    <tr
                      key={cam.id}
                      onClick={() => setSelectedCamera(cam)}
                      className={`cursor-pointer hover:bg-stone-50 transition ${
                        selectedCamera.id === cam.id ? 'bg-emerald-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 font-bold text-stone-900">{cam.id}</td>
                      <td className="py-2.5 px-4 text-stone-600">{cam.location.name}</td>
                      <td className="py-2.5 px-4">
                        <Badge
                          variant={cam.status === 'online' ? 'online' : cam.status === 'offline' ? 'offline' : 'maintenance'}
                          size="sm"
                          dot
                        >
                          {cam.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 font-mono">{cam.batteryPercentage}%</td>
                      <td className="py-2.5 px-4 text-stone-600">
                        {cam.lastDetection?.species || '—'}
                      </td>
                      <td className="py-2.5 px-4 font-mono">{cam.uptimePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 px-1 text-xs text-stone-500">
              <span>
                Page {currentPage} of {totalPages} ({filteredCameras.length} total records)
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-stone-200 bg-white disabled:opacity-40 hover:bg-stone-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-semibold ${
                      currentPage === pg
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-stone-200 bg-white disabled:opacity-40 hover:bg-stone-50 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Selected Camera Details Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header with Camera ID & Status */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-base">{selectedCamera.id}</h3>
                  <Badge
                    variant={selectedCamera.status === 'online' ? 'online' : selectedCamera.status === 'offline' ? 'offline' : 'maintenance'}
                    size="sm"
                    dot
                  >
                    {selectedCamera.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{selectedCamera.location.name}</p>
              </div>

              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {selectedCamera.zone}
              </span>
            </div>

            {/* Camera Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'live'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Live Feed
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'details'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('detections')}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'detections'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Detections
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'analytics'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4">
              {activeTab === 'live' && (
                <div className="space-y-4">
                  {/* Live Feed Simulator */}
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                    {selectedCamera.status === 'offline' ? (
                      <div className="text-center text-stone-400 p-4">
                        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                        <p className="font-semibold text-xs text-rose-300">Camera Unreachable</p>
                        <p className="text-[10px] text-stone-500 mt-1">Check gateway telemetry or solar power unit.</p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={selectedCamera.thumbnailUrl}
                          alt="Live Stream"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          SIMULATED PREVIEW
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          {selectedCamera.lastCaptureTime}
                        </div>
                        <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded text-white hover:bg-black/80">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Hardware Telemetry Specs */}
                  <div className="space-y-2.5 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Battery className="w-3.5 h-3.5 text-stone-400" /> Battery
                      </span>
                      <span className="font-semibold text-stone-800 font-mono">
                        {selectedCamera.batteryPercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-stone-400" /> Local Storage
                      </span>
                      <span className="font-semibold text-stone-800 font-mono">
                        {selectedCamera.storageUsedGb} GB / {selectedCamera.storageTotalGb} GB
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Signal className="w-3.5 h-3.5 text-stone-400" /> 4G Edge Signal
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {selectedCamera.signalStrength}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-stone-400" /> Model
                      </span>
                      <span className="font-medium text-stone-700">
                        {selectedCamera.model}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-3 text-xs text-stone-700">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Coordinates</div>
                    <div className="font-mono text-stone-800 mt-0.5">
                      {selectedCamera.location.lat}° N, {selectedCamera.location.lng}° E
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Zone Habitat</div>
                    <div className="text-stone-800 mt-0.5">
                      {ZONE_SUMMARIES[selectedCamera.zone]?.habitatDescription || 'Forest sector'}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">30-Day Uptime</div>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">
                      {selectedCamera.uptimePercentage}%
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'detections' && (
                <div className="space-y-2 text-xs">
                  <div className="text-stone-400 text-[11px] mb-2">Recent captures from this sensor</div>
                  {RECENT_DETECTIONS.filter(d => d.zone === selectedCamera.zone).slice(0, 3).map(det => (
                    <div key={det.id} className="p-2 border border-stone-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-stone-800">{det.species}</div>
                        <div className="text-[10px] text-stone-400">{det.timestamp}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {(det.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="p-4 text-center text-xs text-stone-500">
                  <Activity className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-medium text-stone-700">Camera Activity Footprint</p>
                  <p className="text-[11px] text-stone-400 mt-1">Average 14 triggers/day with 0.91 mean confidence score.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 grid grid-cols-3 gap-2">
            <button className="py-2 px-2 bg-white border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1">
              <History className="w-3 h-3" /> History
            </button>
            <button className="py-2 px-2 bg-white border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1">
              <Download className="w-3 h-3" /> Clip
            </button>
            <button className="py-2 px-2 bg-emerald-800 text-white rounded-lg text-[11px] font-medium hover:bg-emerald-700 flex items-center justify-center gap-1">
              <Sliders className="w-3 h-3" /> Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
