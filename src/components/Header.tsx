/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Plus, 
  ShieldCheck, 
  HeartPulse, 
  LogOut, 
  MapPin, 
  Pill, 
  Activity, 
  FileText, 
  FileCheck,
  Calendar,
  MessageSquare,
  Bell,
  Sparkles,
  Globe,
  Building2,
  Layers,
  Tag
} from 'lucide-react';
import { UserRole, UserAccount } from '../types/clinical';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount;
  onLogout: () => void;
  clinicBranch: string;
  setClinicBranch: (branch: string) => void;
  onOpenNewIntake: () => void;
  onOpenAuditLogs: () => void;
  onOpenClinicalAi?: () => void;
  onOpenServicesModal?: () => void;
  onOpenRateList?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  clinicBranch,
  setClinicBranch,
  onOpenNewIntake,
  onOpenAuditLogs,
  onOpenClinicalAi,
  onOpenServicesModal,
  onOpenRateList,
}) => {
  const branches = [
    'All Locations (Pan-India HQ Consolidated)',
    'Stree Clinic - Jaipur MI Road',
    'Stree Clinic - Karol Bagh, Delhi',
    'Stree Clinic - Kolkata Central',
    'Stree Clinic - Lucknow Hazratganj',
    'Stree Clinic - Patna Kankarbagh',
    'Stree Clinic - Chennai Mylapore',
  ];

  const isAllLocations = clinicBranch === 'All Locations (Pan-India HQ Consolidated)';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Clinic Identity & Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          
          {/* Zone 1: BIGGER Official Logo & Brand Wordmark */}
          <div className="flex items-center gap-3.5 shrink-0 py-1">
            <div className="h-14 w-14 sm:h-15 sm:w-15 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-center p-1.5 overflow-hidden shrink-0 ring-2 ring-rose-500/10 hover:ring-rose-500/30 transition-all">
              <img 
                src="/assets/stree_clinic_logo.png" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
                }}
                alt="Parivar Seva Sanstha Stree Clinic Official Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap">
                  Stree Clinic
                </span>
                <span className="text-xs text-rose-600 font-extrabold tracking-wider uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Parivar Seva
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Health for Bharat · Estd. 1978 · streeclinic.com
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3.5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'dashboard'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'patients'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Case Sheets
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'prescriptions'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Prescriptions & Rx
            </button>
            <button
              onClick={() => setActiveTab('stock-master')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'stock-master'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Pharmacy Stock
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'appointments'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Queue
            </button>
            <button
              onClick={() => setActiveTab('followups')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'followups'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`whitespace-nowrap shrink-0 transition-all py-1 px-1.5 rounded ${
                activeTab === 'messages'
                  ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Messages
            </button>

            {/* Official Tariff & Rate List Button */}
            {onOpenRateList && (
              <button
                onClick={onOpenRateList}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all whitespace-nowrap shadow-2xs hover:shadow-xs"
                title="View Official Stree Clinic Rate List & Tariffs"
              >
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rate List</span>
              </button>
            )}

            {/* Official Website Services & About Tab */}
            {onOpenServicesModal && (
              <button
                onClick={onOpenServicesModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all whitespace-nowrap shadow-2xs hover:shadow-xs"
                title="View Official Stree Clinic Services & Details (streeclinic.com)"
              >
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                <span>Services</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action & User Session */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Clinical AI Copilot Badge */}
            {onOpenClinicalAi && (
              <button
                onClick={onOpenClinicalAi}
                title="Consult Clinical AI Assistant with Google Search Grounding & Offline Protocols"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">Clinical AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* HIPAA Compliance Badge */}
            <button
              onClick={onOpenAuditLogs}
              title="Click to view HIPAA Access Audit Logs"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>HIPAA</span>
            </button>

            {/* New Intake CTA */}
            <button
              onClick={onOpenNewIntake}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Intake</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.displayName.split(',')[0]}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out of clinic session"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-strip: Active Location Database, All Locations Toggle & Responsive Navigation */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 py-2 text-xs text-slate-500 gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-bold text-slate-800">Database Scope:</span>
            </div>

            {/* Location Selector Dropdown */}
            <select
              value={clinicBranch}
              onChange={(e) => setClinicBranch(e.target.value)}
              className={`border rounded px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs transition-colors ${
                isAllLocations 
                  ? 'bg-rose-50 border-rose-300 text-rose-900' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b === 'All Locations (Pan-India HQ Consolidated)' ? '🌐 All Locations (Pan-India HQ Consolidated)' : b}
                </option>
              ))}
            </select>

            {/* One-Click Quick Toggle for All Locations */}
            <button
              type="button"
              onClick={() => {
                if (isAllLocations) {
                  setClinicBranch('Stree Clinic - Jaipur MI Road');
                } else {
                  setClinicBranch('All Locations (Pan-India HQ Consolidated)');
                }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                isAllLocations
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Toggle between All Locations and single branch database"
            >
              <Layers className="w-3 h-3" />
              <span>{isAllLocations ? 'Showing All Locations' : 'View All Locations'}</span>
            </button>

            {/* Status indicator */}
            {isAllLocations ? (
              <span className="text-[10px] text-rose-700 font-bold bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                <Globe className="w-3 h-3 text-rose-600" />
                Pan-India Consolidated Data Active
              </span>
            ) : (
              <span className="text-[10px] text-emerald-700 font-semibold hidden sm:inline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Single Branch Database
              </span>
            )}
          </div>

          {/* Responsive Navigation Tabs for medium/small screens */}
          <div className="flex xl:hidden overflow-x-auto gap-2 py-1 scrollbar-none text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'patients' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Case Sheets
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'prescriptions' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('stock-master')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'stock-master' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Pharmacy Stock
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'appointments' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Queue
            </button>
            <button
              onClick={() => setActiveTab('followups')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'followups' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-2 py-1 rounded whitespace-nowrap ${
                activeTab === 'messages' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600'
              }`}
            >
              Messages
            </button>
            {onOpenServicesModal && (
              <button
                onClick={onOpenServicesModal}
                className="px-2 py-1 rounded whitespace-nowrap text-rose-700 bg-rose-50 font-bold border border-rose-200"
              >
                Services
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden md:block">
            Logged in: <strong className="text-slate-800">{currentUser.username}</strong> ({currentUser.role})
          </div>

        </div>
      </div>
    </header>
  );
};
