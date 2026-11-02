import React, { useState } from 'react';
import {
  TrendingUp,
  Info,
  Calendar,
  AlertTriangle,
  Layers,
  Sparkles,
  Leaf,
  Activity,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const BiodiversityTrendsPage: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState('90d');

  const trendData = [
    { week: 'W1', rawDetections: 140, effortNormalized: 160, cameraUptime: 94 },
    { week: 'W2', rawDetections: 155, effortNormalized: 165, cameraUptime: 92 },
    { week: 'W3', rawDetections: 120, effortNormalized: 158, cameraUptime: 75 }, // Camera outage dip
    { week: 'W4', rawDetections: 180, effortNormalized: 182, cameraUptime: 96 },
    { week: 'W5', rawDetections: 195, effortNormalized: 190, cameraUptime: 95 },
    { week: 'W6', rawDetections: 210, effortNormalized: 205, cameraUptime: 97 },
    { week: 'W7', rawDetections: 175, effortNormalized: 185, cameraUptime: 88 },
    { week: 'W8', rawDetections: 230, effortNormalized: 220, cameraUptime: 98 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biodiversity Trends"
        subtitle="Longitudinal species occurrence, detection effort normalization, and ecological baseline tracking"
        tagline="Effort-Adjusted Bio-Index"
      />

      {/* Critical Scientific Note on Observational Effort */}
      <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Ecological Data Integrity Notice:</span>
          Raw detection counts are correlated with camera uptime and trap-nights. WildWatch normalizes raw sightings against active sensor hours to prevent false population decline conclusions during hardware outages (e.g. Week 3 dip was a 75% uptime artifact, not an animal decline).
        </div>
      </div>

      {/* Trend KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Trap-Nights Logged"
          value="7,560"
          subtitle="Cumulative effort"
          trend={{ value: "+840 this cycle", isPositive: true }}
          icon={Activity}
        />
        <StatCard
          title="Relative Abundance Index"
          value="2.84"
          subtitle="Captures per 100 trap-nights"
          trend={{ value: "+4.2% baseline", isPositive: true }}
          icon={TrendingUp}
        />
        <StatCard
          title="Shannon Diversity Index"
          value="1.92"
          subtitle="High species evenness"
          trend={{ value: "Stable (±0.05)", isNeutral: true }}
          icon={Leaf}
        />
        <StatCard
          title="Detected Anomalies"
          value="2"
          subtitle="1 effort artifact, 1 corridor surge"
          trend={{ value: "Triage complete", isPositive: true }}
          icon={AlertTriangle}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* Primary Effort-Normalized Trend Chart */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Raw Detections vs. Effort-Normalized Sightings
            </h3>
            <p className="text-xs text-stone-400">
              Accounting for active camera uptime and weather variance across 8 recording weeks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Window:</span>
            <select
              value={selectedHorizon}
              onChange={(e) => setSelectedHorizon(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 font-medium"
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 8 Weeks (Quarterly)</option>
              <option value="1y">Annual Cycle</option>
            </select>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #cbd5e1' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="rawDetections"
                name="Raw Detections (Count)"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="effortNormalized"
                name="Effort-Normalized Index"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="cameraUptime"
                name="Sensor Uptime (%)"
                stroke="#3b82f6"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly & Seasonal Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            Seasonal Migration Footprints
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            During pre-monsoon dry intervals, herbivore presence converges heavily towards Zone B (Waterhole). Post-monsoon vegetation regeneration triggers dispersal into Zone A (North Ridge) and Zone D (Valley).
          </p>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Current Season: <strong>Post-Monsoon Transition</strong></span>
            <span className="text-emerald-700 font-semibold">Normal Activity</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            Data Quality & Sensor Health Confidence
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Overall fleet reporting confidence is rated at <strong>91.4%</strong>. No systematic detection drop observed once 12 offline units in Zone D are normalized against historic trap grids.
          </p>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Model Version: <strong>YOLOv8-WildWatch-v1.2</strong></span>
            <span className="text-emerald-700 font-semibold">Calibrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
