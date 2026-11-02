import React, { useState, useMemo } from 'react';
import {
  Scan,
  Download,
  Filter,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Camera,
  Activity,
  Table as TableIcon,
  LayoutGrid,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import {
  RECENT_DETECTIONS,
  SPECIES_DISTRIBUTION,
  TELEMETRY_DATA,
} from '../data/mockData';
import type { Detection } from '../types';

export const DetectionsPage: React.FC = () => {
  const [selectedDetection, setSelectedDetection] = useState<Detection>(RECENT_DETECTIONS[0]);
  const [activeView, setActiveView] = useState<'table' | 'gallery'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  // Trend data for Detections chart
  const trendData = [
    { date: 'Oct 1', chital: 45, wildBoar: 22, leopard: 6, monkey: 15 },
    { date: 'Oct 2', chital: 52, wildBoar: 28, leopard: 9, monkey: 18 },
    { date: 'Oct 3', chital: 80, wildBoar: 35, leopard: 12, monkey: 25 },
    { date: 'Oct 4', chital: 64, wildBoar: 30, leopard: 8, monkey: 20 },
    { date: 'Oct 5', chital: 70, wildBoar: 32, leopard: 7, monkey: 22 },
    { date: 'Oct 6', chital: 60, wildBoar: 26, leopard: 5, monkey: 19 },
    { date: 'Oct 7', chital: 75, wildBoar: 34, leopard: 10, monkey: 24 },
  ];

  // Filter detections
  const filteredDetections = useMemo(() => {
    return RECENT_DETECTIONS.filter((item) => {
      const matchesSearch =
        item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = zoneFilter === 'all' || item.zone === zoneFilter;
      const matchesSpecies = speciesFilter === 'all' || item.species.includes(speciesFilter);
      const matchesConf =
        confidenceFilter === 'all' ||
        (confidenceFilter === 'high' && item.confidence >= 0.9) ||
        (confidenceFilter === 'med' && item.confidence >= 0.8 && item.confidence < 0.9);
      return matchesSearch && matchesZone && matchesSpecies && matchesConf;
    });
  }, [searchQuery, zoneFilter, speciesFilter, confidenceFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detections"
        subtitle="AI-detected wildlife from all camera traps across forest zones"
        actions={
          <button className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        }
      />

      {/* Multi-Facet Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Date Range
            </label>
            <select className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700">
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {/* Zones */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Zones
            </label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
            >
              <option value="all">All Zones</option>
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
              <option value="Zone C">Zone C</option>
              <option value="Zone D">Zone D</option>
            </select>
          </div>

          {/* Species */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Species
            </label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
            >
              <option value="all">All Species</option>
              <option value="Chital">Chital (Deer)</option>
              <option value="Wild Boar">Wild Boar</option>
              <option value="Leopard">Leopard</option>
              <option value="Monkey">Monkey</option>
              <option value="Peacock">Peacock</option>
            </select>
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Confidence
            </label>
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
            >
              <option value="all">All Scores</option>
              <option value="high">≥ 90% (High)</option>
              <option value="med">80% – 89% (Medium)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 sm:pt-0">
          <button className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Filter className="w-3 h-3" /> Apply Filters
          </button>
          <button
            onClick={() => {
              setZoneFilter('all');
              setSpeciesFilter('all');
              setConfidenceFilter('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 border border-stone-200 text-stone-600 rounded-lg text-xs hover:bg-stone-50 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Detections"
          value="1,248"
          trend={{ value: "12% vs last week", isPositive: true }}
          icon={Activity}
        />
        <StatCard
          title="Unique Animals (Est.)"
          value="186"
          trend={{ value: "8% vs last week", isPositive: true }}
          icon={Sparkles}
        />
        <StatCard
          title="Species Identified"
          value="23"
          trend={{ value: "0% vs last week", isNeutral: true }}
          icon={Layers}
        />
        <StatCard
          title="Active Cameras"
          value={`${TELEMETRY_DATA.activeCamerasCount} / ${TELEMETRY_DATA.totalCamerasCount}`}
          subtitle="85% online"
          icon={Camera}
        />
      </div>

      {/* Hero: Selected / Latest Detection Card with Bounding Box & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="font-semibold text-stone-900 text-sm">Featured AI Detection Details</h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">{selectedDetection.id}</span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual Image with Bounding Box Overlay (7 cols) */}
            <div className="md:col-span-7 relative rounded-lg overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              <img
                src={selectedDetection.image}
                alt={selectedDetection.species}
                className="w-full h-full object-cover"
              />

              {/* Simulated Bounding Box */}
              {selectedDetection.boundingBox && (
                <div
                  className="absolute border-2 border-emerald-400 bg-emerald-400/15 pointer-events-none transition-all duration-300"
                  style={{
                    left: `${selectedDetection.boundingBox.x * 100}%`,
                    top: `${selectedDetection.boundingBox.y * 100}%`,
                    width: `${selectedDetection.boundingBox.width * 100}%`,
                    height: `${selectedDetection.boundingBox.height * 100}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-emerald-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                    {selectedDetection.species.split(' ')[0]} ({(selectedDetection.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                {selectedDetection.cameraId} • {selectedDetection.timestamp}
              </div>
            </div>

            {/* Scientific Details Panel (5 cols) */}
            <div className="md:col-span-5 space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-stone-900">{selectedDetection.species}</h4>
                  <Badge variant="success" size="sm">
                    {(selectedDetection.confidence * 100).toFixed(0)}% Conf
                  </Badge>
                </div>
                <p className="text-stone-400 italic text-[11px]">{selectedDetection.scientificName}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-400">Camera ID:</span>
                  <span className="font-semibold text-stone-800">{selectedDetection.cameraId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Zone:</span>
                  <span className="font-medium text-emerald-700">{selectedDetection.zoneName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Date & Time:</span>
                  <span className="text-stone-700">{selectedDetection.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Coordinates:</span>
                  <span className="font-mono text-stone-600">
                    {selectedDetection.location.lat}° N, {selectedDetection.location.lng}° E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Behaviour:</span>
                  <span className="text-stone-800">{selectedDetection.behaviour || 'Walking'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Individual Count:</span>
                  <span className="font-semibold text-stone-800">{selectedDetection.count}</span>
                </div>
              </div>

              <div className="pt-3">
                <button className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition">
                  Confirm Human Verification
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Charts: Detection Trends (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
            <h4 className="text-xs font-semibold text-stone-800 mb-2">Detection Trend (7-Day)</h4>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                  <Line type="monotone" dataKey="chital" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="wildBoar" stroke="#b45309" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="leopard" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 text-[10px] text-stone-500 mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Chital</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span> Boar</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Leopard</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
            <h4 className="text-xs font-semibold text-stone-800 mb-2">Verification Status</h4>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Auto-Approved (High Conf):</span>
              <span className="font-semibold text-emerald-700">1,120</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
              <span className="text-stone-500">Pending Review:</span>
              <span className="font-semibold text-amber-600">84</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-stone-500">False Positives Flagged:</span>
              <span className="font-semibold text-rose-600">44</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Log Table & Gallery Section */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">Detection Log</h3>
            <p className="text-xs text-stone-400">Detailed list of all AI detections from camera traps</p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search detections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />

            {/* Toggle Table/Gallery */}
            <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => setActiveView('table')}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                  activeView === 'table' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" /> Table
              </button>
              <button
                onClick={() => setActiveView('gallery')}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                  activeView === 'gallery' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Gallery
              </button>
            </div>
          </div>
        </div>

        {/* View Component */}
        {activeView === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Image</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Species</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Camera ID</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Count</th>
                  <th className="py-2.5 px-3">Behaviour</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDetections.map((det, idx) => (
                  <tr
                    key={det.id}
                    onClick={() => setSelectedDetection(det)}
                    className={`hover:bg-stone-50 cursor-pointer transition ${
                      selectedDetection.id === det.id ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-stone-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <img
                        src={det.image}
                        alt={det.species}
                        className="w-10 h-10 rounded object-cover border border-stone-200"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{det.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{det.species}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {det.confidence}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{det.cameraId}</td>
                    <td className="py-2.5 px-3 font-medium text-emerald-800">{det.zone}</td>
                    <td className="py-2.5 px-3">{det.count}</td>
                    <td className="py-2.5 px-3 text-stone-600">{det.behaviour}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredDetections.map((det) => (
              <div
                key={det.id}
                onClick={() => setSelectedDetection(det)}
                className={`rounded-lg border overflow-hidden bg-white cursor-pointer group transition ${
                  selectedDetection.id === det.id ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-stone-200'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-stone-900">
                  <img
                    src={det.image}
                    alt={det.species}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                    {(det.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2 text-xs">
                  <div className="font-semibold text-stone-800 truncate">{det.species}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{det.cameraId} • {det.zone}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
