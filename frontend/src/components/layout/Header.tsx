import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Bell, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('Last 7 days');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="h-16 bg-white border-b border-stone-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search species, camera ID, zone, date..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-stone-700 placeholder-stone-400 transition"
          />
        </div>
      </div>

      {/* Right Controls: Date Range, Notifications, Profile */}
      <div className="flex items-center space-x-3.5 ml-4">
        {/* Date Range Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>Oct 1, 2026 – Oct 9, 2026</span>
        </div>

        {/* Range Preset Selector */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium py-1.5 pl-3 pr-7 rounded-lg cursor-pointer hover:bg-stone-100 transition focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option>Today</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Current Season</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
          title="3 Unread Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-stone-200"></div>

        {/* User / Conservation Authority Profile */}
        <div className="flex items-center space-x-2.5 pl-1 cursor-pointer hover:opacity-90 transition">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-xs shadow-xs border border-emerald-700">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-stone-800 leading-tight">Forest Team</div>
            <div className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
              Authority Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
