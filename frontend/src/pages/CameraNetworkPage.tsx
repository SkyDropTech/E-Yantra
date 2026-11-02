import React, { useState } from 'react';
import {
  Camera as CameraIcon,
  Search,
  Filter,
  Sliders,
  Battery,
  HardDrive,
  Signal,
  MapPin,
  RefreshCw,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon,
  Table as TableIcon,
  X,
  Radio,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CAMERAS_108 } from '../data/mockData';
import type { Camera } from '../types';
import { WildWatchMap } from '../components/map/WildWatchMap';
import { FOREST_ZONES_GEOJSON } from '../data/forestZonesGeoJSON';

export const CameraNetworkPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [viewLayout, setViewLayout] = useState<'both' | 'map' | 'table'>('both');

  const filtered = CAMERAS_108.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'alert' && c.hasAlert) ||
      (statusFilter === 'low_battery' && c.batteryPercentage < 25) ||
      c.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || c.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const alertCamerasCount = CAMERAS_108.filter((c) => c.hasAlert).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Camera Network"
        subtitle="Manage 108 sensor traps, hardware telemetry, edge nodes, and maintenance schedules"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCamera(null);
                setSearchQuery('');
                setStatusFilter('all');
                setZoneFilter('all');
              }}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        }
      />

      {/* Fleet KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Hardware Inventory"
          value="108"
          subtitle="10 Amazon Monitored Sectors"
          icon={CameraIcon}
        />
        <StatCard
          title="Online & Transmitting"
          value="92"
          subtitle="85% Operational rate"
          trend={{ value: "Stable", isPositive: true }}
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          title="Active Alert Triggers"
          value={String(alertCamerasCount)}
          subtitle="Conservation & outage alerts"
          trend={{ value: "High Priority", isPositive: false }}
          icon={AlertTriangle}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Field Maintenance"
          value="16"
          subtitle="12 Offline • 4 Servicing"
          icon={Wrench}
          iconBgColor="bg-stone-100"
          iconColor="text-stone-700"
        />
      </div>

      {/* View Layout Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewLayout('both')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              viewLayout === 'both'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Map & Inventory</span>
          </button>
          <button
            type="button"
            onClick={() => setViewLayout('map')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              viewLayout === 'map'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Map Only</span>
          </button>
          <button
            type="button"
            onClick={() => setViewLayout('table')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              viewLayout === 'table'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Table Only</span>
          </button>
        </div>

        {/* Selected Camera Banner */}
        {selectedCamera ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>
              Targeted:{' '}
              <strong className="font-bold">{selectedCamera.id}</strong> ({selectedCamera.zoneName})
            </span>
            <button
              onClick={() => setSelectedCamera(null)}
              className="text-emerald-700 hover:text-emerald-900 ml-1 p-0.5 rounded"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-stone-400">
            Tip: Click any marker or table row to synchronize location
          </div>
        )}
      </div>

      {/* Interactive Map View */}
      {(viewLayout === 'both' || viewLayout === 'map') && (
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Amazon Rainforest Spatial Telemetry Map
              </h3>
              <p className="text-xs text-stone-400">
                Interactive Leaflet trap markers, real-time alert beacons, and 10 demonstration forest zones
              </p>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
              {filtered.length} nodes plotted
            </span>
          </div>

          <WildWatchMap
            cameras={filtered}
            selectedCamera={selectedCamera}
            onSelectCamera={(cam) => setSelectedCamera(cam)}
            height={viewLayout === 'map' ? '600px' : '440px'}
            showFilters={true}
            showLegend={true}
          />
        </div>
      )}

      {/* Filter and Inventory List Table */}
      {(viewLayout === 'both' || viewLayout === 'table') && (
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search camera ID or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
              >
                <option value="all">All Statuses</option>
                <option value="online">Online (92)</option>
                <option value="alert">Alerts Active ({alertCamerasCount})</option>
                <option value="offline">Offline (12)</option>
                <option value="maintenance">Maintenance (4)</option>
                <option value="low_battery">Battery &lt; 25%</option>
              </select>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
              >
                <option value="all">All 10 Zones</option>
                {FOREST_ZONES_GEOJSON.features.map((f) => (
                  <option key={f.properties.id} value={f.properties.id}>
                    {f.properties.id} ({f.properties.name.split(' - ')[1] || f.properties.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-stone-400">
              Showing {filtered.length} of 108 units
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Device ID</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Coordinates (WGS84)</th>
                  <th className="py-2.5 px-3">Telemetry Status</th>
                  <th className="py-2.5 px-3">Battery</th>
                  <th className="py-2.5 px-3">Storage</th>
                  <th className="py-2.5 px-3">Signal</th>
                  <th className="py-2.5 px-3">Last Ping</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((cam) => {
                  const isSelected = selectedCamera?.id === cam.id;
                  const displayStatus = cam.hasAlert ? 'alert' : cam.status;

                  return (
                    <tr
                      key={cam.id}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-50/80 font-medium'
                          : 'hover:bg-stone-50'
                      }`}
                      onClick={() => setSelectedCamera(cam)}
                    >
                      <td className="py-2.5 px-3 font-bold text-stone-900 flex items-center gap-1.5">
                        {cam.hasAlert && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                        )}
                        <span>{cam.id}</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{cam.model}</td>
                      <td className="py-2.5 px-3 font-medium text-emerald-800">{cam.zone}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500">
                        {cam.location.lat}° N, {cam.location.lng}° E
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            displayStatus === 'alert'
                              ? 'alert'
                              : displayStatus === 'online'
                              ? 'online'
                              : displayStatus === 'offline'
                              ? 'offline'
                              : 'maintenance'
                          }
                          size="sm"
                          dot
                        >
                          {displayStatus.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span
                          className={
                            cam.batteryPercentage < 20
                              ? 'text-rose-600 font-bold'
                              : 'text-stone-800'
                          }
                        >
                          {cam.batteryPercentage}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">
                        {cam.storageUsedGb} / {cam.storageTotalGb} GB
                      </td>
                      <td className="py-2.5 px-3 text-stone-700">{cam.signalStrength}</td>
                      <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                        {cam.lastCaptureTime}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCamera(cam);
                          }}
                          className={`px-2 py-1 text-[11px] font-medium border rounded transition ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Focused on Map' : 'Locate on Map'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
