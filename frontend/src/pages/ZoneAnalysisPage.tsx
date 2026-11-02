import React, { useState } from 'react';
import {
  Map,
  Download,
  AlertTriangle,
  Camera,
  Activity,
  Layers,
  Sparkles,
  Leaf,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { ZONE_SUMMARIES, SPECIES_RECORDS } from '../data/mockData';
import type { ZoneId } from '../types';

export const ZoneAnalysisPage: React.FC = () => {
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('Zone A');
  const zoneData = ZONE_SUMMARIES[selectedZoneId];

  const zoneTabs: Array<{ id: ZoneId; label: string; sub: string }> = [
    { id: 'Zone A', label: 'Zone A', sub: 'North Ridge' },
    { id: 'Zone B', label: 'Zone B', sub: 'Waterhole' },
    { id: 'Zone C', label: 'Zone C', sub: 'Trail' },
    { id: 'Zone D', label: 'Zone D', sub: 'Valley' },
  ];

  // Species in this zone
  const zoneSpecies = SPECIES_RECORDS.map((sp) => ({
    name: sp.name,
    detections: sp.zonePresence[selectedZoneId],
    estimatedUnique: Math.ceil(sp.zonePresence[selectedZoneId] * 0.18),
    percentage: Math.round((sp.zonePresence[selectedZoneId] / zoneData.totalDetections) * 100),
  })).filter((s) => s.detections > 0);

  // Heatmap matrix days vs species
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapSpecies = ['Chital (Deer)', 'Wild Boar', 'Monkey', 'Sambar Deer', 'Leopard', 'Peacock', 'Sloth Bear', 'Others'];

  // Intensity generator
  const getIntensityClass = (sp: string, dIdx: number) => {
    const seed = (sp.charCodeAt(0) + dIdx * 7) % 5;
    switch (seed) {
      case 0: return 'bg-emerald-50';
      case 1: return 'bg-emerald-200';
      case 2: return 'bg-emerald-400';
      case 3: return 'bg-emerald-600';
      default: return 'bg-emerald-800 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zone Analysis"
        subtitle="Detailed analysis of wildlife activity, species presence, camera performance and key insights across forest zones."
        actions={
          <button className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        }
      />

      {/* Top Monitored Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-stone-400 uppercase">Zones Monitored</div>
          <div className="text-xl font-bold text-stone-900 mt-1">4</div>
          <div className="text-[10px] text-stone-400">Total sectors</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-emerald-600 uppercase">Cameras Online</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">92 / 108</div>
          <div className="text-[10px] text-emerald-600 font-medium">85% uptime</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-stone-400 uppercase">Total Detections</div>
          <div className="text-xl font-bold text-stone-900 mt-1">1,248</div>
          <div className="text-[10px] text-emerald-600 font-medium">↑ 12% vs last week</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-stone-400 uppercase">Unique Animals (Est.)</div>
          <div className="text-xl font-bold text-stone-900 mt-1">186</div>
          <div className="text-[10px] text-emerald-600 font-medium">↑ 8% vs last week</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-stone-400 uppercase">Total Species</div>
          <div className="text-xl font-bold text-stone-900 mt-1">23</div>
          <div className="text-[10px] text-stone-400">Identified</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-semibold text-amber-600 uppercase">Rare Records</div>
          <div className="text-xl font-bold text-amber-600 mt-1">4</div>
          <div className="text-[10px] text-amber-600 font-medium">Needs review</div>
        </div>
      </div>

      {/* Zone Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {zoneTabs.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelectedZoneId(z.id)}
            className={`p-4 rounded-xl border text-left transition duration-150 flex items-center justify-between ${
              selectedZoneId === z.id
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div>
              <div className="font-bold text-sm">{z.label}</div>
              <div className={`text-xs mt-0.5 ${selectedZoneId === z.id ? 'text-emerald-200' : 'text-stone-400'}`}>
                {z.sub}
              </div>
            </div>
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
              selectedZoneId === z.id ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-100 text-stone-600'
            }`}>
              {ZONE_SUMMARIES[z.id].totalCameras} Cams
            </span>
          </button>
        ))}
      </div>

      {/* Selected Zone Header & Specific KPIs */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              {selectedZoneId} – {zoneData.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-stone-50 border border-stone-200 px-2.5 py-1 rounded text-stone-600">
                Compare with: <strong>Previous 7 days</strong>
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-1">{zoneData.habitatDescription}</p>
        </div>

        {/* 6 Micro Stats for the Selected Zone */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Total Cameras</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">{zoneData.totalCameras}</div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {zoneData.onlineCameras} Online • {zoneData.offlineCameras} Offline
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Total Detections</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">{zoneData.totalDetections}</div>
            <div className="text-[10px] text-emerald-600 font-medium">↑ 14% vs last week</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Unique Animals (Est.)</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">{zoneData.estimatedUniqueAnimals}</div>
            <div className="text-[10px] text-emerald-600 font-medium">↑ 9% vs last week</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Species Observed</div>
            <div className="text-base font-bold text-stone-900 mt-0.5">{zoneData.speciesObserved}</div>
            <div className="text-[10px] text-emerald-600 font-medium">↑ 2 new species</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Rare Species Records</div>
            <div className="text-base font-bold text-amber-600 mt-0.5">{zoneData.rareSpeciesCount}</div>
            <div className="text-[10px] text-stone-400">Sloth Bear record</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Dominant Species</div>
            <div className="text-sm font-bold text-stone-900 mt-0.5 truncate">{zoneData.mostCommonSpecies}</div>
            <div className="text-[10px] text-stone-500 font-medium">{zoneData.mostCommonPercentage}% frequency</div>
          </div>
        </div>
      </div>

      {/* Middle Row: Species Distribution Table + Activity Heatmap + Camera Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Species in Zone A (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">Species in {selectedZoneId}</h3>
            <span className="text-[11px] text-stone-400">Total {zoneSpecies.length} Taxa</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72 pr-1">
            {zoneSpecies.map((s, idx) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs text-stone-700">
                  <span className="font-medium truncate">{idx + 1}. {s.name}</span>
                  <span className="font-semibold text-stone-800 ml-2">{s.detections} ({s.percentage}%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, s.percentage * 2)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            Herbivore dominance reflects habitat canopy and water proximity.
          </div>
        </div>

        {/* Activity Heatmap (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-stone-900">Activity Heatmap ({selectedZoneId})</h3>
            <span className="text-[11px] text-stone-400">Mon – Sun</span>
          </div>

          <div className="overflow-x-auto my-auto">
            <table className="w-full text-[11px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left font-medium text-stone-400 w-24">Species</th>
                  {days.map((d) => (
                    <th key={d} className="font-semibold text-stone-500 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapSpecies.map((sp) => (
                  <tr key={sp}>
                    <td className="text-stone-700 font-medium truncate pr-1">{sp}</td>
                    {days.map((d, dIdx) => (
                      <td
                        key={d}
                        className={`h-5 w-6 rounded-xs text-center ${getIntensityClass(sp, dIdx)}`}
                        title={`${sp} on ${d}`}
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-500">
            <span>Low Activity</span>
            <div className="flex gap-1 items-center">
              <span className="w-3 h-3 rounded-xs bg-emerald-50 border border-stone-200"></span>
              <span className="w-3 h-3 rounded-xs bg-emerald-200"></span>
              <span className="w-3 h-3 rounded-xs bg-emerald-400"></span>
              <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
              <span className="w-3 h-3 rounded-xs bg-emerald-800"></span>
            </div>
            <span>High Activity</span>
          </div>
        </div>

        {/* Camera Performance & Issues in this Zone (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-2">Camera Health</h3>
            <div className="p-3 bg-stone-50 rounded-lg text-center mb-3">
              <div className="text-2xl font-black text-emerald-700">{zoneData.uptimePercentage}%</div>
              <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Average Uptime</div>
            </div>

            <div className="text-xs font-semibold text-stone-800 mb-2">Recent Sensor Issues</div>
            <div className="space-y-2">
              {zoneData.recentIssues.map((issue) => (
                <div key={issue.cameraId} className="p-2 border border-rose-100 bg-rose-50/50 rounded text-xs">
                  <div className="flex justify-between font-semibold text-rose-800 text-[11px]">
                    <span>{issue.cameraId}</span>
                    <span className="text-stone-400 text-[10px]">{issue.date}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">{issue.issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[10px] text-stone-400">
            Automated maintenance ticket created for field team.
          </div>
        </div>
      </div>

      {/* Bottom Row: Rare & Notable Sightings Table + Key Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rare Sightings Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">Rare & Notable Sightings ({selectedZoneId})</h3>
            <span className="text-xs text-stone-400">Human Verification Required</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Species</th>
                  <th className="py-2.5 px-3">Camera ID</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 text-stone-600">Oct 5, 2026 09:18 PM</td>
                  <td className="py-2.5 px-3 font-semibold text-stone-900">Sloth Bear</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">CAM-009</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">0.92</td>
                  <td className="py-2.5 px-3"><Badge variant="danger" size="sm">Rare</Badge></td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 text-stone-600">Oct 4, 2026 06:47 AM</td>
                  <td className="py-2.5 px-3 font-semibold text-stone-900">Leopard</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">CAM-017</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">0.89</td>
                  <td className="py-2.5 px-3"><Badge variant="warning" size="sm">Rare</Badge></td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 text-stone-600">Oct 2, 2026 08:12 PM</td>
                  <td className="py-2.5 px-3 font-semibold text-stone-900">Sambar Deer</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">CAM-021</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">0.86</td>
                  <td className="py-2.5 px-3"><Badge variant="info" size="sm">Unusual</Badge></td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 text-stone-600">Oct 1, 2026 10:33 PM</td>
                  <td className="py-2.5 px-3 font-semibold text-stone-900">Indian Civet</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">CAM-023</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">0.84</td>
                  <td className="py-2.5 px-3"><Badge variant="rare" size="sm">New Species</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Takeaways (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Key Ecological Takeaways</h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>Peak mammal traffic occurs between 05:00 AM – 08:00 AM along stream crossings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Chital represents 38% of total recorded events in {selectedZoneId}.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                <span>1 rare species detection logged (Sloth Bear), awaiting ranger verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">4</span>
                <span>Overall sector activity increased by 14% compared to the prior baseline window.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            Validated by Wildlife Conservation Framework
          </div>
        </div>
      </div>
    </div>
  );
};
