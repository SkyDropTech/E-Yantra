const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchCameras(params?: { zone_id?: string; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.zone_id && params.zone_id !== 'all') query.append('zone_id', params.zone_id);
  if (params?.status && params.status !== 'all') query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  query.append('limit', '108');

  const res = await fetch(`${API_BASE_URL}/cameras?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch cameras');
  return res.json();
}

export async function fetchDetections(params?: { zone_id?: string; species_id?: string; min_confidence?: number }) {
  const query = new URLSearchParams();
  if (params?.zone_id && params.zone_id !== 'all') query.append('zone_id', params.zone_id);
  if (params?.species_id && params.species_id !== 'all') query.append('species_id', params.species_id);
  if (params?.min_confidence !== undefined) query.append('min_confidence', params.min_confidence.toString());
  query.append('limit', '50');

  const res = await fetch(`${API_BASE_URL}/detections?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch detections');
  return res.json();
}

export async function updateDetectionVerification(detectionId: string, isVerified: boolean) {
  const res = await fetch(`${API_BASE_URL}/detections/${detectionId}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_verified: isVerified }),
  });
  if (!res.ok) throw new Error('Failed to update verification status');
  return res.json();
}

export async function fetchAlerts(status?: string) {
  const query = new URLSearchParams();
  if (status && status !== 'all') query.append('status', status);

  const res = await fetch(`${API_BASE_URL}/alerts?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function updateAlertStatus(alertId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update alert status');
  return res.json();
}

export async function fetchZones() {
  const res = await fetch(`${API_BASE_URL}/zones`);
  if (!res.ok) throw new Error('Failed to fetch zones');
  return res.json();
}

export async function fetchSpecies() {
  const res = await fetch(`${API_BASE_URL}/species`);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

export function getExportCsvUrl(zoneId?: string, speciesId?: string) {
  const query = new URLSearchParams();
  if (zoneId && zoneId !== 'all') query.append('zone_id', zoneId);
  if (speciesId && speciesId !== 'all') query.append('species_id', speciesId);
  return `${API_BASE_URL}/reports/export-csv?${query.toString()}`;
}
