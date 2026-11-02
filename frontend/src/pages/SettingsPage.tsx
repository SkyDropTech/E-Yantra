import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Cpu,
  MapPin,
  Save,
  CheckCircle,
  Database,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const [minConfidence, setMinConfidence] = useState(0.70);
  const [autoVerifyThreshold, setAutoVerifyThreshold] = useState(0.90);
  const [duplicateWindowMinutes, setDuplicateWindowMinutes] = useState(15);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="AI inference thresholds, cross-camera heuristics, zone definitions, and sensor configurations"
        tagline="Wildlife Model Calibration"
      />

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully and synced with edge inference workers!</span>
        </div>
      )}

      {/* Model & Inference Confidence Thresholds */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Cpu className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">AI Model & Detection Confidence</h3>
            <p className="text-xs text-stone-400">Control Ultralytics YOLO sensitivity and auto-approval limits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Minimum Detection Confidence Threshold (Floor)</span>
              <span className="font-mono text-emerald-700">{(minConfidence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.85"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Detections scored below this value are suppressed as noise/vegetation movement.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Automatic Human Verification Threshold</span>
              <span className="font-mono text-emerald-700">{(autoVerifyThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="0.98"
              step="0.02"
              value={autoVerifyThreshold}
              onChange={(e) => setAutoVerifyThreshold(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Detections meeting or exceeding this confidence are auto-approved for ecological indices.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Camera Duplicate Association Heuristics */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Sliders className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">Cross-Camera Sightings Association</h3>
            <p className="text-xs text-stone-400">
              Heuristic constraints for associating likely identical animal sightings without false merges
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Sighting Co-occurrence Time Window</span>
              <span className="font-mono text-emerald-700">{duplicateWindowMinutes} minutes</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={duplicateWindowMinutes}
              onChange={(e) => setDuplicateWindowMinutes(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Sightings of the same species within adjacent sensors inside this time frame are linked under one estimated unique individual track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <span className="font-semibold text-stone-800 block mb-1">Spatial Constraint</span>
              <p className="text-stone-500 text-[11px]">
                Restricted to same-zone or adjacent boundary sensors within 1.2 km radius.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <span className="font-semibold text-stone-800 block mb-1">Uncertainty Preservation</span>
              <p className="text-stone-500 text-[11px]">
                Ambiguous tracks retain separate underlying model frames for human verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs transition"
        >
          <Save className="w-4 h-4" /> Save Configuration Parameters
        </button>
      </div>
    </div>
  );
};
