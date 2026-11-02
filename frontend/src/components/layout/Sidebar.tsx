import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Scan,
  BarChart3,
  Camera,
  Map,
  TrendingUp,
  Bell,
  FileText,
  Settings,
  TreePine,
  Leaf,
} from 'lucide-react';

interface SidebarProps {
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ alertsCount = 3 }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Monitoring', path: '/live', icon: Video },
    { name: 'Detections', path: '/detections', icon: Scan },
    { name: 'Species Insights', path: '/species', icon: BarChart3 },
    { name: 'Camera Network', path: '/cameras', icon: Camera },
    { name: 'Zone Analysis', path: '/zones', icon: Map },
    { name: 'Biodiversity Trends', path: '/trends', icon: TrendingUp },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: alertsCount },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a1f16] text-white flex flex-col min-h-screen shrink-0 border-r border-[#143324] select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-[#143324] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <TreePine className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <div className="font-bold text-lg tracking-tight leading-tight flex items-center gap-1.5 text-white">
            WildWatch
          </div>
          <p className="text-[11px] font-medium text-emerald-400/80 tracking-wide uppercase">
            AI for Biodiversity
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#153e2b] text-white shadow-sm border-l-4 border-emerald-400 pl-2.5 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-[#112d20]'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 opacity-85" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Forestry Conservation Footer */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#0e271c] border border-[#163827] text-stone-300">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs">
          <Leaf className="w-3.5 h-3.5" />
          <span>Conservation Mission</span>
        </div>
        <div className="text-[11px] text-stone-400 space-y-0.5 leading-relaxed font-mono">
          <p>• Conserve</p>
          <p>• Monitor</p>
          <p>• Understand</p>
          <p>• Protect</p>
        </div>
      </div>
    </aside>
  );
};
