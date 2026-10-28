/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  HeartHandshake, 
  ShieldAlert, 
  Stethoscope,
  ChevronRight,
  PhoneCall,
  Bed,
  Globe,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Building2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { PatientRecord, Appointment, FollowUpReminder, BillReceipt } from '../types/clinical';
import { 
  ALL_LOCATIONS_MONTHLY_TRENDS, 
  BRANCH_MONTHLY_TRENDS, 
  ALL_LOCATIONS_REVENUE_DISTRIBUTION, 
  BRANCH_PERFORMANCE_METRICS,
  MonthlyVisitTrend
} from '../data/mockData';

interface DashboardProps {
  patients: PatientRecord[];
  appointments: Appointment[];
  reminders: FollowUpReminder[];
  bills?: BillReceipt[];
  clinicBranch: string;
  onSelectPatient: (patient: PatientRecord) => void;
  onOpenNewIntake: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenServicesModal?: () => void;
  onOpenRateList?: () => void;
  onSetBranch?: (branch: string) => void;
}

const DEPARTMENT_COLORS: Record<string, string> = {
  gynae: '#059669',        // Emerald
  mtp: '#e11d48',          // Rose
  sterilization: '#0284c7',// Sky Blue
  infertility: '#7c3aed',  // Purple
  menopause: '#d97706',    // Amber
  anc_pnc: '#0891b2',      // Cyan
};

const REVENUE_COLORS = {
  mtpServices: '#e11d48',
  gynaeAndMediCheck: '#059669',
  pharmacyAndSupplies: '#0284c7',
  sterilizationAndOT: '#d97706',
  labAndUsg: '#8b5cf6',
  freeCareWaived: '#94a3b8',
};

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  appointments,
  reminders,
  bills = [],
  clinicBranch,
  onSelectPatient,
  onOpenNewIntake,
  onNavigateToTab,
  onOpenServicesModal,
  onOpenRateList,
  onSetBranch,
}) => {
  const isAllLocations = clinicBranch === 'All Locations (Pan-India HQ Consolidated)';

  // Chart View Toggle States
  const [trendViewType, setTrendViewType] = useState<'area' | 'bar' | 'donut'>('area');
  const [revenueViewType, setRevenueViewType] = useState<'stacked' | 'total'>('stacked');

  // Compute High-risk Clinical Flags
  const highRiskCases = patients.filter((p) => {
    const hbNum = parseFloat(p.investigations.hb);
    const lowHb = !isNaN(hbNum) && hbNum < 10.0;
    const isHigherGestation = p.medicalAbortion?.isHigherGestation;
    const isPendingFollowUp = p.medicalAbortion && !p.medicalAbortion.day3CheckInCall.done;
    const hasComplications = !!p.surgical?.complications && p.surgical.complications !== 'None';
    return lowHb || isHigherGestation || isPendingFollowUp || hasComplications;
  });

  const freeSchemePatients = patients.filter((p) => p.statusAPL_BPL === 'BPL' || p.sterilization?.isFreeScheme);
  const totalMtpCases = patients.filter((p) => 
    p.activeDepartments.includes('Medical Abortion (Form C MTP)') || 
    p.activeDepartments.includes('Medicated Abortion (20-24 Wks Form E)') || 
    p.activeDepartments.includes('MTP Services (6-24 Weeks)') ||
    p.activeDepartments.includes('Other Abortions (OA)')
  ).length;
  const totalSteriCases = patients.filter((p) => p.activeDepartments.includes('Sterilization (Minilap / Lap / NSV)')).length;
  const totalInfertilityCases = patients.filter((p) => p.activeDepartments.includes('Infertility Consultation')).length;
  const totalMenopauseCases = patients.filter((p) => p.activeDepartments.includes('Peri-Menopause & Menopause')).length;
  const totalGynaeCases = patients.filter((p) => p.activeDepartments.includes('General Gynae')).length;

  const pendingReminders = reminders.filter((r) => r.status === 'Pending');

  // Referral breakdown
  const referralCounts: Record<string, number> = {};
  patients.forEach((p) => {
    const ref = p.primaryReferral.split('(')[0].trim();
    referralCounts[ref] = (referralCounts[ref] || 0) + 1;
  });

  // Determine Visit Trend Dataset: All Locations vs specific branch
  const visitTrendData: MonthlyVisitTrend[] = isAllLocations 
    ? ALL_LOCATIONS_MONTHLY_TRENDS 
    : (BRANCH_MONTHLY_TRENDS[clinicBranch] || BRANCH_MONTHLY_TRENDS['Stree Clinic - Jaipur MI Road']);

  // Latest month data for pie/donut distribution
  const latestMonthTrend = visitTrendData[visitTrendData.length - 1] || visitTrendData[0];
  const pieDistributionData = [
    { name: 'General Gynae & Medi-Check', value: latestMonthTrend.gynae, color: DEPARTMENT_COLORS.gynae },
    { name: 'MTP & Abortion Care', value: latestMonthTrend.mtp, color: DEPARTMENT_COLORS.mtp },
    { name: 'Sterilization & FP', value: latestMonthTrend.sterilization, color: DEPARTMENT_COLORS.sterilization },
    { name: 'Infertility Evaluation', value: latestMonthTrend.infertility, color: DEPARTMENT_COLORS.infertility },
    { name: 'Menopause & MRS', value: latestMonthTrend.menopause, color: DEPARTMENT_COLORS.menopause },
    { name: 'Antenatal & Postnatal', value: latestMonthTrend.anc_pnc, color: DEPARTMENT_COLORS.anc_pnc },
  ];

  // Revenue Distribution Dataset: scaled appropriately for single branch vs all locations
  const revenueData = isAllLocations 
    ? ALL_LOCATIONS_REVENUE_DISTRIBUTION 
    : ALL_LOCATIONS_REVENUE_DISTRIBUTION.map((r) => ({
        month: r.month,
        mtpServices: Math.round(r.mtpServices * 0.24),
        gynaeAndMediCheck: Math.round(r.gynaeAndMediCheck * 0.24),
        pharmacyAndSupplies: Math.round(r.pharmacyAndSupplies * 0.24),
        sterilizationAndOT: Math.round(r.sterilizationAndOT * 0.24),
        labAndUsg: Math.round(r.labAndUsg * 0.24),
        freeCareWaived: Math.round(r.freeCareWaived * 0.24),
        totalNet: Math.round(r.totalNet * 0.24),
      }));

  const latestRevenue = revenueData[revenueData.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Clinical Highlights & Medical Standards Notice */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-rose-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* BIGGER, BOLD LOGO */}
          <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-rose-300 ring-4 ring-rose-500/20 hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/stree_clinic_logo.png" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
              }}
              alt="Official Stree Clinic Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider text-rose-300 font-bold">
                Parivar Seva Sanstha · Estd. 1978
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-rose-200 font-medium">Health for Bharat</span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-2xs">
                MoHFW & MTP Act 2021 Compliant
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Stree Clinic Clinical Management System</span>
              {isAllLocations && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                  Pan-India Consolidated View
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time administrative oversight, encrypted case sheets, Recharts trend analytics, automated follow-up surveillance, transparent tariffs, and pharmacy inventory control across all Stree Clinics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          {onOpenRateList && (
            <button
              onClick={onOpenRateList}
              className="px-3.5 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title="Browse official Stree Clinic Rate List & Tariffs"
            >
              <DollarSign className="w-4 h-4" />
              <span>Official Rate List</span>
            </button>
          )}

          {onOpenServicesModal && (
            <button
              onClick={onOpenServicesModal}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-rose-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>Services (streeclinic.com)</span>
            </button>
          )}

          <button
            onClick={onOpenNewIntake}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-rose-600/20 transition-all whitespace-nowrap active:scale-95"
          >
            + New Patient Intake
          </button>
        </div>
      </div>

      {/* Database Scope Notice if in All Locations mode */}
      {isAllLocations && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">Pan-India Centralized Headquarters View Active:</span>
              <span className="text-rose-800 ml-1">
                Displaying aggregated data from all 6 clinical hubs (Jaipur, Delhi, Kolkata, Lucknow, Patna, Chennai).
              </span>
            </div>
          </div>
          {onSetBranch && (
            <button
              onClick={() => onSetBranch('Stree Clinic - Jaipur MI Road')}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline whitespace-nowrap"
            >
              Switch back to single branch (Jaipur)
            </button>
          )}
        </div>
      )}

      {/* Critical Clinical Alerts Banner (if any) */}
      {highRiskCases.length > 0 && (
        <div className="border border-amber-200 bg-amber-50/70 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                High-Risk Clinical Surveillance ({highRiskCases.length} Patients Requiring Attention)
              </h2>
            </div>
            <span className="text-xs text-amber-800">
              Immediate triage protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {highRiskCases.map((patient) => {
              const hbNum = parseFloat(patient.investigations.hb);
              const isAnemic = !isNaN(hbNum) && hbNum < 10.0;
              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className="bg-white border border-amber-200 rounded-lg p-3 hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{patient.clientName}</span>
                      <span className="font-mono text-[11px] text-slate-500">{patient.intakeRegistrationNo}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p>Age: {patient.age}y · {patient.activeDepartments[0]}</p>
                      {isAllLocations && (
                        <p className="text-[10px] text-slate-500 font-semibold">📍 {patient.clinicLocation}</p>
                      )}
                      {isAnemic && (
                        <p className="text-rose-700 font-medium">
                          Alert: Low Hemoglobin ({patient.investigations.hb} g/dL)
                        </p>
                      )}
                      {patient.medicalAbortion?.isHigherGestation && (
                        <p className="text-amber-800 font-medium">
                          Higher Gestation ({patient.medicalAbortion.gestationWeeks} wks) · Form E 2-RMP Signature
                        </p>
                      )}
                      {patient.medicalAbortion && !patient.medicalAbortion.day3CheckInCall.done && (
                        <p className="text-indigo-800 font-medium">
                          Pending Day 3 Tab Misoprostol check-in call
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-rose-600 font-medium">
                    <span>Open Case Sheet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary KPI Strips - Enforcing tabular-nums & domain layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Intakes</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {isAllLocations ? '1,590' : patients.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isAllLocations ? 'Across All 6 Hubs' : 'Verified active records'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Sterilizations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {isAllLocations ? '250' : totalSteriCases}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Minilap & NSV</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">MTP Services</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {isAllLocations ? '345' : totalMtpCases}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Form C & Form E</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Free Care (FPIS)</span>
            <HeartHandshake className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {isAllLocations ? '184' : freeSchemePatients.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% Subsidized BPL</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Follow-up Due</span>
            <PhoneCall className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {isAllLocations ? '28' : pendingReminders.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Surveillance calls</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Net Collections</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            ₹{(latestRevenue.totalNet / 1000).toFixed(0)}k
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Current month net</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RECHARTS SECTION 1: Patient Visit Trends by Department         */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Patient Visit Trends by Clinical Department
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                Recharts Visual Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAllLocations 
                ? 'Consolidated Pan-India monthly attendance across all 6 Stree Clinics (May – Oct 2026)' 
                : `Monthly clinical attendance trends for ${clinicBranch}`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setTrendViewType('area')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                trendViewType === 'area' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Area Flow
            </button>
            <button
              type="button"
              onClick={() => setTrendViewType('bar')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                trendViewType === 'bar' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grouped Bar
            </button>
            <button
              type="button"
              onClick={() => setTrendViewType('donut')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                trendViewType === 'donut' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Department Share
            </button>
          </div>
        </div>

        {/* Chart View Rendering */}
        <div className="h-72 w-full">
          {trendViewType === 'area' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGynae" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DEPARTMENT_COLORS.gynae} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={DEPARTMENT_COLORS.gynae} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMtp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DEPARTMENT_COLORS.mtp} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={DEPARTMENT_COLORS.mtp} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSteri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DEPARTMENT_COLORS.sterilization} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={DEPARTMENT_COLORS.sterilization} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={DEPARTMENT_COLORS.infertility} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={DEPARTMENT_COLORS.infertility} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  labelStyle={{ color: '#fda4af', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="gynae" name="General Gynaecology & Medi-Check" stroke={DEPARTMENT_COLORS.gynae} fillOpacity={1} fill="url(#colorGynae)" />
                <Area type="monotone" dataKey="mtp" name="MTP & Abortion Services" stroke={DEPARTMENT_COLORS.mtp} fillOpacity={1} fill="url(#colorMtp)" />
                <Area type="monotone" dataKey="sterilization" name="Sterilization & FP" stroke={DEPARTMENT_COLORS.sterilization} fillOpacity={1} fill="url(#colorSteri)" />
                <Area type="monotone" dataKey="infertility" name="Infertility Workup" stroke={DEPARTMENT_COLORS.infertility} fillOpacity={1} fill="url(#colorInf)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {trendViewType === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="gynae" name="General Gynae" fill={DEPARTMENT_COLORS.gynae} radius={[4, 4, 0, 0]} />
                <Bar dataKey="mtp" name="MTP Services" fill={DEPARTMENT_COLORS.mtp} radius={[4, 4, 0, 0]} />
                <Bar dataKey="sterilization" name="Sterilization" fill={DEPARTMENT_COLORS.sterilization} radius={[4, 4, 0, 0]} />
                <Bar dataKey="infertility" name="Infertility" fill={DEPARTMENT_COLORS.infertility} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {trendViewType === 'donut' && (
            <div className="h-full flex flex-col md:flex-row items-center justify-around gap-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={(entry: any) => `${(entry.name || '').split(' ')[0]} ${(((entry.percent || 0) * 100).toFixed(0))}%`}
                    labelLine={false}
                  >
                    {pieDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} Patients`, 'Volume']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Micro Key Takeaways */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{latestMonthTrend.gynae} Intakes</span>
              <span className="text-[10px] text-slate-500 block">General Gynae & Medi-Check</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{latestMonthTrend.mtp} Intakes</span>
              <span className="text-[10px] text-slate-500 block">MTP Act 2021 Services</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{latestMonthTrend.sterilization} Procedures</span>
              <span className="text-[10px] text-slate-500 block">Minilap & NSV Vasectomy</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{latestMonthTrend.infertility} Consults</span>
              <span className="text-[10px] text-slate-500 block">Follicular & Couple Workup</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RECHARTS SECTION 2: Monthly Clinic Revenue Distribution        */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Clinic Revenue Distribution & Subsidies
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Transparent Billing
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service stream breakdown (MTP, Medi-Check OPD, Pharmacy, Minor OT, USG) and Free FPIS BPL care subsidies
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setRevenueViewType('stacked')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                revenueViewType === 'stacked' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Streams
            </button>
            <button
              type="button"
              onClick={() => setRevenueViewType('total')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                revenueViewType === 'total' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Net vs Waived
            </button>
          </div>
        </div>

        {/* Revenue Recharts Component */}
        <div className="h-72 w-full">
          {revenueViewType === 'stacked' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="mtpServices" name="MTP & CAC Procedures" stackId="a" fill={REVENUE_COLORS.mtpServices} />
                <Bar dataKey="gynaeAndMediCheck" name="Gynae & Medi-Check" stackId="a" fill={REVENUE_COLORS.gynaeAndMediCheck} />
                <Bar dataKey="pharmacyAndSupplies" name="Pharmacy & Social Mktg" stackId="a" fill={REVENUE_COLORS.pharmacyAndSupplies} />
                <Bar dataKey="sterilizationAndOT" name="Sterilization & Day OT" stackId="a" fill={REVENUE_COLORS.sterilizationAndOT} />
                <Bar dataKey="labAndUsg" name="USG & Lab Diagnostics" stackId="a" fill={REVENUE_COLORS.labAndUsg} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="totalNet" name="Net Clinic Collections" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeCareWaived" name="Free FPIS / BPL Care Waived (NGO Subsidy)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Financial Highlights */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Current Month Net</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                ₹{latestRevenue.totalNet.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Charitable Care Waived</span>
              <span className="text-base font-bold text-slate-600 tabular-nums">
                ₹{latestRevenue.freeCareWaived.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audited under Parivar Seva Sanstha Trust Accounts</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: ALL LOCATIONS EXECUTIVE COMPARISON TABLE            */}
      {/* Shown prominently when All Locations is selected                */}
      {/* ============================================================== */}
      {isAllLocations && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Pan-India Branch Performance & Operational Comparison
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active clinical load and revenue across all 6 Parivar Seva Sanstha hospital centers
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Clinic Hub</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3 text-right">Intakes</th>
                  <th className="py-2.5 px-3 text-right">MTP Cases</th>
                  <th className="py-2.5 px-3 text-right">Sterilizations</th>
                  <th className="py-2.5 px-3 text-center">Bed Occupancy</th>
                  <th className="py-2.5 px-3 text-right">Revenue (Oct)</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {BRANCH_PERFORMANCE_METRICS.map((branch) => (
                  <tr key={branch.branchKey} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {branch.branchName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {branch.state}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                      {branch.totalIntakes}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 tabular-nums">
                      {branch.mtpCases}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-sky-700 tabular-nums">
                      {branch.sterilizations}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-600">
                      {branch.bedOccupancy}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      ₹{branch.revenueThisMonth.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {onSetBranch && (
                        <button
                          onClick={() => onSetBranch(branch.branchName)}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] border border-rose-200 transition-colors"
                        >
                          View Branch
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Grid: Clinical Departments & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Clinical Department Activity & Intake Registers */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Intake Registers by Clinical Department
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized Parivar Seva Sanstha documentation streams
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('patients')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                View All Sheets <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">General Gynaecology</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '540' : totalGynaeCases} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Comprehensive 30+ medical history, menstrual, and infection checklists.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: GG-2026-XXXX
                </div>
              </div>

              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Sterilization (Free & Paid)</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '250' : totalSteriCases} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Minilap, Laparoscopy & NSV. Statutory informed consent & checklist.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: STR-2026-XXXX
                </div>
              </div>

              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Medical Abortion (Form C & E)</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '345' : totalMtpCases} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  MTP Act up to 63 days & higher gestation (20-24 wks) dual RMP sign-offs.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: MTP-2026-XXXX
                </div>
              </div>

              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Infertility Consultations</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '140' : totalInfertilityCases} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Couple history, Follicular monitoring chart, Hormonal analysis & semen reports.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: INF-2026-XXXX
                </div>
              </div>

              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Peri-Menopause & Menopause</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '105' : totalMenopauseCases} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  11-item Menopause Rating Scale (MRS), BMD DEXA bone scan & hormone panel.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: MENO-2026-XXXX
                </div>
              </div>

              <div 
                onClick={() => onNavigateToTab('patients')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">ANC / PNC & Surgeries</span>
                  <span className="font-mono text-slate-600 font-bold tabular-nums">
                    {isAllLocations ? '210' : 'Active'} records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Gestational age & EDD calculator, BUBBLE exam, Minor OT surgical record.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Series: ANC / PNC / SP
                </div>
              </div>
            </div>
          </div>

          {/* Referral Analysis: ASHA, Chemist, Anganwadi, Community Outreach */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Referral Channel Analytics & Community Mobilization
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tracking primary referral source as mandated on Stree Clinic Page 1 intake forms
            </p>

            <div className="space-y-3">
              {Object.entries(referralCounts).map(([channel, count]) => {
                const percent = Math.round((count / (patients.length || 1)) * 100);
                return (
                  <div key={channel}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800">{channel}</span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Today's Clinical Queue & Upcoming Reminders */}
        <div className="space-y-6">
          
          {/* Real-Time Queue */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Today's Clinic Queue
                </h3>
                <p className="text-xs text-slate-500">OPD & Procedure Rooms</p>
              </div>
              <button
                onClick={() => onNavigateToTab('appointments')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Schedule
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center font-mono">
                        {apt.tokenNo}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {apt.patientName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 ml-7">
                      {apt.department} · {apt.roomNo}
                    </p>
                    <div className="text-[10px] text-slate-400 ml-7 mt-0.5 font-mono">
                      {apt.timeSlot} · {apt.doctorName}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 whitespace-nowrap">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Surveillance Calls Due */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Surveillance & Follow-Up Calls
                </h3>
                <p className="text-xs text-slate-500">MTP Day 3/4 & Vasectomy check-ins</p>
              </div>
              <button
                onClick={() => onNavigateToTab('followups')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {reminders.slice(0, 3).map((rem) => (
                <div key={rem.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{rem.patientName}</span>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      {rem.reminderType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {rem.customMessage}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono">Due: {rem.dueDate} ({rem.dueTime})</span>
                    <span className="font-medium text-slate-700">via {rem.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Website & Accreditation Badge */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Official Network
              </span>
              <a
                href="https://www.streeclinic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-rose-300 hover:text-white flex items-center gap-1"
              >
                <span>streeclinic.com</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs font-bold text-white">
              Parivar Seva Sanstha · Estd. 1978
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Dedicated to delivering safe, dignified, and quality reproductive, maternal, and family planning healthcare across Bharat.
            </p>
          </div>

          {/* HIPAA & Security Compliance Indicator */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-emerald-900">Medical Data Shield Active</h4>
                <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                  All clinical notes, diagnoses, ultrasound scans, and digital signatures are encrypted with AES-256-GCM. SHA-256 tamper-evident audit trail enabled.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
