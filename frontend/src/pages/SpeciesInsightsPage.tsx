import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Sparkles,
  Layers,
  Leaf,
  AlertCircle,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { SPECIES_RECORDS } from '../data/mockData';
import type { SpeciesRecord } from '../types';

export const SpeciesInsightsPage: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesRecord>(SPECIES_RECORDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredSpecies = SPECIES_RECORDS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Species Insights"
        subtitle="Taxonomical analysis, estimated populations, and zone presence verification"
        tagline="IUCN Red List & Regional Conservation"
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Identified Species"
          value="23"
          subtitle="Taxa recorded"
          trend={{ value: "2 new this month", isPositive: true }}
          icon={Leaf}
        />
        <StatCard
          title="Estimated Unique Animals"
          value="186"
          subtitle="Cross-camera baseline"
          trend={{ value: "8% growth", isPositive: true }}
          icon={Sparkles}
        />
        <StatCard
          title="Total Sighting Events"
          value="1,248"
          trend={{ value: "12% vs last week", isPositive: true }}
          icon={Layers}
        />
        <StatCard
          title="Rare Species Records"
          value="4"
          subtitle="Awaiting review"
          trend={{ value: "Urgent triage", isPositive: false }}
          icon={AlertCircle}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* Main Grid: Species Inventory Table & Heatmap Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Searchable Species Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Monitored Species Catalog</h3>
              <p className="text-xs text-stone-400">Classified wildlife across forest camera traps</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search species..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg text-stone-700"
              >
                <option value="all">All Classes</option>
                <option value="Mammal">Mammals</option>
                <option value="Bird">Birds</option>
                <option value="Reptile">Reptiles</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Species Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Total Events</th>
                  <th className="py-2.5 px-3">Unique (Est.)</th>
                  <th className="py-2.5 px-3">Rarity Status</th>
                  <th className="py-2.5 px-3">Last Sighting</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSpecies.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSpecies(s)}
                    className={`cursor-pointer hover:bg-stone-50 transition ${
                      selectedSpecies.id === s.id ? 'bg-emerald-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-400 italic">{s.scientificName}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{s.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{s.totalDetections}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-800">{s.estimatedUnique}</td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          s.rarity === 'Common'
                            ? 'neutral'
                            : s.rarity === 'Rare'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {s.rarity}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 text-[11px]">{s.lastSightingTime}</td>
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
        </div>

        {/* Right Side: Selected Species Detail Profile (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-base">{selectedSpecies.name}</h3>
                <p className="text-xs text-stone-400 italic mt-0.5">{selectedSpecies.scientificName}</p>
              </div>
              <Badge variant={selectedSpecies.rarity === 'Rare' ? 'danger' : 'neutral'} size="sm">
                {selectedSpecies.rarity}
              </Badge>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Total Sighted</div>
                  <div className="text-xl font-bold text-stone-900 mt-0.5">{selectedSpecies.totalDetections}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Unique Animals (Est.)</div>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5">{selectedSpecies.estimatedUnique}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> Last Detected:
                  </span>
                  <span className="font-medium text-stone-800">{selectedSpecies.lastSightingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" /> Sensor Trigger:
                  </span>
                  <span className="font-mono text-emerald-800 font-semibold">{selectedSpecies.lastCameraId}</span>
                </div>
              </div>

              {/* Zone Presence Distribution */}
              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-semibold text-stone-800 mb-2">Zone Occurrence Footprint</h4>
                <div className="space-y-1.5">
                  {Object.entries(selectedSpecies.zonePresence).map(([zone, count]) => (
                    <div key={zone} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">{zone}</span>
                      <span className="font-mono text-stone-800">{count} events</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition">
              Download Species Conservation Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
