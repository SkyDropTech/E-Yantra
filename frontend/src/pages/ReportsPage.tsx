import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const ReportsPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate generation of CSV data
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Record_ID,Camera_ID,Zone,Species,Confidence,Timestamp,Verified\n' +
        'DET-001,CAM-017,Zone A,Chital (Spotted Deer),0.94,2026-10-01 09:21:10,TRUE\n' +
        'DET-002,CAM-043,Zone B,Wild Boar,0.88,2026-10-01 09:18:32,TRUE\n' +
        'DET-003,CAM-068,Zone C,Leopard,0.93,2026-10-01 09:15:47,TRUE\n' +
        'DET-004,CAM-029,Zone D,Monkey (Rhesus Macaque),0.87,2026-10-01 09:11:05,FALSE\n' +
        'DET-005,CAM-011,Zone A,Peacock (Indian Peafowl),0.89,2026-10-01 09:08:21,TRUE\n';

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `WildWatch_Wildlife_Report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conservation Reports"
        subtitle="Generate peer-reviewed biodiversity audit dossiers and raw CSV data logs for regional authorities"
        tagline="Standardized Forest Department Audit Format"
      />

      {/* Generator Configuration Box */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" /> Report Parameters & Scope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Date Horizon</label>
            <select className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700">
              <option>Oct 1, 2026 – Oct 9, 2026 (Last 7 Days)</option>
              <option>September 2026 (Full Month)</option>
              <option>Monsoon Season 2026 (Q3)</option>
              <option>Annual Cycle 2025-2026</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Monitored Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700"
            >
              <option value="all">All 4 Monitored Zones (A, B, C, D)</option>
              <option value="Zone A">Zone A - North Ridge</option>
              <option value="Zone B">Zone B - Waterhole</option>
              <option value="Zone C">Zone C - Trail</option>
              <option value="Zone D">Zone D - Valley</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Export Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700"
            >
              <option value="csv">Comma-Separated Values (.CSV)</option>
              <option value="json">Structured JSON Dataset (.JSON)</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <span className="text-xs text-stone-400">
            Includes verified sightings, camera uptime logs, and detection confidence indices.
          </span>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Compiling Dataset...' : 'Generate & Download CSV'}</span>
          </button>
        </div>
      </div>

      {/* Pre-Compiled Recent Reports Archive */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
        <h3 className="text-sm font-semibold text-stone-900 mb-3">Archived Official Audits</h3>
        <div className="space-y-2.5">
          <div className="p-3 rounded-lg border border-stone-200 flex items-center justify-between hover:bg-stone-50 transition">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <div>
                <div className="text-xs font-bold text-stone-900">
                  WildWatch_Weekly_Audit_Q4_W1.csv
                </div>
                <div className="text-[10px] text-stone-400">
                  Compiled on Oct 8, 2026 • 1,248 Records • 108 Sensors
                </div>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>

          <div className="p-3 rounded-lg border border-stone-200 flex items-center justify-between hover:bg-stone-50 transition">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <div>
                <div className="text-xs font-bold text-stone-900">
                  September_Monthly_Biodiversity_Summary.csv
                </div>
                <div className="text-[10px] text-stone-400">
                  Compiled on Oct 1, 2026 • 5,420 Records • Verified by Range Officer
                </div>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
