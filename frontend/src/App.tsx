import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { DetectionsPage } from './pages/DetectionsPage';
import { SpeciesInsightsPage } from './pages/SpeciesInsightsPage';
import { CameraNetworkPage } from './pages/CameraNetworkPage';
import { ZoneAnalysisPage } from './pages/ZoneAnalysisPage';
import { BiodiversityTrendsPage } from './pages/BiodiversityTrendsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/live" element={<LiveMonitoringPage />} />
          <Route path="/detections" element={<DetectionsPage />} />
          <Route path="/species" element={<SpeciesInsightsPage />} />
          <Route path="/cameras" element={<CameraNetworkPage />} />
          <Route path="/zones" element={<ZoneAnalysisPage />} />
          <Route path="/trends" element={<BiodiversityTrendsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
