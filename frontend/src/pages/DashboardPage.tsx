import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Camera,
  Layers,
  Leaf,
  Sparkles,
  ArrowRight,
  HardDrive,
  BatteryCharging,
  Video,
  FileSpreadsheet,
  Download,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  RECENT_DETECTIONS,
  SPECIES_DISTRIBUTION,
  HOURLY_ACTIVITY_DATA,
  ZONE_DETECTIONS_DATA,
  PRIORITY_ALERTS,
  TELEMETRY_DATA,
  CAMERAS_108,
} from '../data/mockData';
import { WildWatchMap } from '../components/map/WildWatchMap';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time insights from camera traps across forest zones"
        tagline="Monitoring Today for a Wilder Tomorrow"
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Detections"
          value="1,248"
          trend={{ value: "12% vs last week", isPositive: true }}
          icon={Activity}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="Estimated Unique Animals"
          value="186"
          subtitle="Cross-camera heuristic"
          trend={{ value: "8% vs last week", isPositive: true }}
          icon={Sparkles}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-700"
        />

        <StatCard
          title="Species Identified"
          value="23"
          trend={{ value: "0% vs last week", isNeutral: true }}
          icon={Leaf}
          iconBgColor="bg-lime-50"
          iconColor="text-lime-700"
        />

        <StatCard
          title="Active Cameras"
          value={`${TELEMETRY_DATA.activeCamerasCount} / ${TELEMETRY_DATA.totalCamerasCount}`}
          subtitle="12 offline • 4 maintenance"
          trend={{ value: "85% online rate", isPositive: true }}
          icon={Camera}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-700"
        />

        <StatCard
          title="Zones Monitored"
          value="10"
          subtitle="Zone 01 to Zone 10"
          trend={{ value: "100% Amazon coverage", isPositive: true }}
          icon={Layers}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />
      </div>

      {/* Middle Row: Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Species Distribution */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-stone-800">Species Distribution</h3>
            <span className="text-[11px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
              Last 30 days
            </span>
          </div>

          <div className="flex items-center justify-center my-1 relative">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SPECIES_DISTRIBUTION}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SPECIES_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} detections`, 'Count']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-stone-800">1,248</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Detections</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-stone-100 text-xs">
            {SPECIES_DISTRIBUTION.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-stone-600">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                  <span className="truncate">{s.name}</span>
                </div>
                <span className="font-semibold text-stone-700 ml-1">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Diurnal Activity Pattern */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-stone-800">Activity Pattern (Diurnal Curve)</h3>
            <span className="text-[11px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
              Last 7 days
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Chital</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span> Wild Boar</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Leopard</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Others</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_ACTIVITY_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="chitalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="boarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="chital" stroke="#10b981" fillOpacity={1} fill="url(#chitalGrad)" />
                <Area type="monotone" dataKey="wildBoar" stroke="#b45309" fillOpacity={1} fill="url(#boarGrad)" />
                <Area type="monotone" dataKey="leopard" stroke="#f59e0b" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-stone-400 text-center pt-2 border-t border-stone-100">
            Detections peak in early morning (06:00 - 09:00) and twilight (18:00 - 20:00)
          </div>
        </div>

        {/* 3. Zone-wise Detections */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-stone-800">Zone-wise Detections</h3>
            <span className="text-[11px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
              Last 7 days
            </span>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_DETECTIONS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} detections`, 'Total']}
                  contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ZONE_DETECTIONS_DATA.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100 text-stone-600">
            <span>Highest: <strong className="text-emerald-700">Zone 06 (210)</strong></span>
            <button
              onClick={() => navigate('/zones')}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px] flex items-center gap-1"
            >
              Analyze Zones <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Main Grid: Recent Detections + Forest Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent AI Detections Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Recent AI Detections</h3>
              <p className="text-xs text-stone-400">Latest camera trap events with model inference</p>
            </div>
            <button
              onClick={() => navigate('/detections')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {RECENT_DETECTIONS.map((det) => (
              <div
                key={det.id}
                onClick={() => navigate('/detections')}
                className="group cursor-pointer rounded-lg border border-stone-200 overflow-hidden bg-stone-50 hover:border-emerald-600 hover:shadow-xs transition"
              >
                <div className="relative h-28 w-full overflow-hidden bg-stone-800">
                  <img
                    src={det.image}
                    alt={det.species}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Bounding box simulation pill */}
                  <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                    {det.species.split(' ')[0]} {det.confidence}
                  </div>
                </div>

                <div className="p-2.5 text-xs">
                  <div className="font-semibold text-stone-800 truncate">{det.species}</div>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                    <span>{det.cameraId}</span>
                    <span>{det.timestamp.split(' ')[2]} {det.timestamp.split(' ')[3]}</span>
                    <span className="font-medium text-emerald-700">{det.zone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forest Map & Camera Locations (5 cols) */}
        {/* Forest Map & Camera Traps (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Amazon Rainforest Map & Traps</h3>
              <p className="text-xs text-stone-400">Interactive OpenStreetMap across 10 demonstration zones (Brazil)</p>
            </div>
            <button
              onClick={() => navigate('/cameras')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Full Fleet Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive Leaflet Map Component */}
          <WildWatchMap
            cameras={CAMERAS_108}
            height="340px"
            compactMode={false}
            showFilters={true}
            showLegend={true}
          />

          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>Coordinate System: WGS84 (Amazonas, Brazil)</span>
            <span className="font-medium text-emerald-700">108 Active Nodes • 10 Zones</span>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Widgets: Priority Alerts, Resource Telemetry, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Priority Alerts */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-semibold text-stone-800">Priority Alerts</h3>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {PRIORITY_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs font-semibold text-stone-800">{alert.title}</div>
                  <span className="text-[10px] text-stone-400">{alert.timestamp}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Availability */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800">Resource Availability</h3>
            <Badge variant="online" size="sm" dot>Live Telemetry</Badge>
          </div>

          <div className="space-y-4 my-auto">
            {/* Storage Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-stone-400" /> Storage Capacity
                </span>
                <span className="font-semibold text-stone-800">
                  {TELEMETRY_DATA.storageUsedGb} GB / {TELEMETRY_DATA.storageTotalGb} GB (62%)
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            {/* Battery Status */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Battery Health
                </span>
                <span className="font-semibold text-stone-800">
                  {TELEMETRY_DATA.batteryOverallPct}% Average
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <div className="text-[10px] text-stone-400 mt-1 flex justify-between">
                <span>92 / 108 online with solar backup</span>
                <span className="text-amber-600 font-medium">3 low battery warnings</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            Telemetry refreshed every 60s from edge gateways
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800">Quick Actions</h3>
            <span className="text-xs text-stone-400">Operational Tools</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-auto">
            <button
              onClick={() => navigate('/live')}
              className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition text-center"
            >
              <Video className="w-4 h-4 text-emerald-700" />
              <span>View Live Feed</span>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="p-3 rounded-lg border border-sky-100 bg-sky-50/60 hover:bg-sky-100/70 text-sky-800 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition text-center"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-700" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={() => navigate('/detections')}
              className="p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition text-center"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Export Data</span>
            </button>

            <button
              onClick={() => navigate('/cameras')}
              className="p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition text-center"
            >
              <Sliders className="w-4 h-4 text-stone-600" />
              <span>Manage Cameras</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
            Direct access to field operational tools
          </div>
        </div>
      </div>
    </div>
  );
};
