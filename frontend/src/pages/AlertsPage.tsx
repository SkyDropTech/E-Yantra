import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { PRIORITY_ALERTS } from '../data/mockData';
import type { AlertItem } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    ...PRIORITY_ALERTS,
    {
      id: 'alt-04',
      title: 'Zone B Waterhole: Night Gathering Anomaly',
      type: 'anomaly',
      severity: 'medium',
      timestamp: '12 hours ago',
      zone: 'Zone B',
      description: 'Abnormal clustering of 4 distinct species around Waterhole #2 past midnight. Potential poaching risk or predator pressure.',
      evidence: 'CAM-032, CAM-034 burst logs',
      status: 'pending',
    },
    {
      id: 'alt-05',
      title: 'New Species Candidate: Small Indian Civet',
      type: 'rare_species',
      severity: 'low',
      timestamp: '1 day ago',
      zone: 'Zone A',
      cameraId: 'CAM-023',
      description: 'First sighting of Viverricula indica recorded in Sector 4. Model confidence 0.84.',
      evidence: 'Bounding box #9481 image asset',
      status: 'acknowledged',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'resolved') return a.status === 'resolved';
    return true;
  });

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Incident Triage"
        subtitle="Operational triage for wildlife sightings, hardware outages, and environmental anomalies"
        badge={
          <Badge variant="danger" size="md">
            {pendingCount} Pending Action
          </Badge>
        }
        tagline="Automated Model Flags vs. Verified Incidents"
      />

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 transition ${
            activeTab === 'all'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          All Incident Reports ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2.5 transition ${
            activeTab === 'pending'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`pb-2.5 transition ${
            activeTab === 'resolved'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Resolved ({alerts.filter((a) => a.status === 'resolved').length})
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-xl border transition bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.status === 'resolved'
                ? 'opacity-65 border-stone-200'
                : alert.severity === 'high'
                ? 'border-rose-200 ring-1 ring-rose-100'
                : 'border-stone-200'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    alert.severity === 'high'
                      ? 'danger'
                      : alert.severity === 'medium'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {alert.severity.toUpperCase()} PRIORITY
                </Badge>
                <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {alert.zone}
                </span>
                {alert.cameraId && (
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {alert.cameraId}
                  </span>
                )}
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {alert.timestamp}
                </span>
              </div>

              <h3 className="text-sm font-bold text-stone-900">{alert.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{alert.description}</p>

              {alert.evidence && (
                <div className="text-[11px] text-stone-400 font-mono bg-stone-50 px-2.5 py-1 rounded inline-block">
                  Evidence: {alert.evidence}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              {alert.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs transition"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Resolve
                  </button>
                </>
              )}

              {alert.status === 'acknowledged' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Resolve
                </button>
              )}

              {alert.status === 'resolved' && (
                <Badge variant="success" size="md" dot>
                  Resolved by Ranger Team
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
