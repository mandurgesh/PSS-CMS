/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Globe, 
  Stethoscope, 
  Pill, 
  FileCheck,
  Building2,
  Users,
  DollarSign,
  Tag,
  ArrowRight,
  Shield,
  PhoneCall
} from 'lucide-react';
import { OFFICIAL_STREE_CLINIC_RATE_LIST, RateItem } from '../data/officialRateList';

interface OfficialServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRateList?: () => void;
}

export const OfficialServicesModal: React.FC<OfficialServicesModalProps> = ({
  isOpen,
  onClose,
  onOpenRateList,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'services' | 'tariffs' | 'standards'>('overview');

  if (!isOpen) return null;

  const officialWebsiteUrl = 'https://www.streeclinic.com/';
  const logoUrl = '/assets/stree_clinic_logo.png';
  const cdnLogoUrl = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header with Enamored Brand Presence */}
        <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-rose-900/50">
          <div className="flex items-center gap-4">
            {/* BIGGER, PROMINENT LOGO */}
            <div className="h-16 w-16 bg-white rounded-2xl p-1.5 shadow-xl flex items-center justify-center overflow-hidden border-2 border-rose-300 ring-2 ring-rose-500/30 shrink-0">
              <img 
                src={logoUrl} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = cdnLogoUrl;
                }}
                alt="Parivar Seva Sanstha Stree Clinic Official Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-lg text-white tracking-tight">
                  Parivar Seva Sanstha · Stree Clinic
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/30 text-rose-200 border border-rose-400/40">
                  Estd. 1978 · Health for Bharat
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Official Clinical Services & Transparent Tariff Portfolio (streeclinic.com)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={officialWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors"
            >
              <span>Visit streeclinic.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'bg-rose-600 text-white font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mission & Heritage (45+ Years)
          </button>
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSubTab === 'services'
                ? 'bg-rose-600 text-white font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Clinical Services Spectrum
          </button>
          <button
            onClick={() => setActiveSubTab('tariffs')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeSubTab === 'tariffs'
                ? 'bg-rose-600 text-white font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rate List & Subsidies</span>
          </button>
          <button
            onClick={() => setActiveSubTab('standards')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSubTab === 'standards'
                ? 'bg-rose-600 text-white font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Quality Standards & Helplines
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 bg-slate-50/50 font-sans">
          
          {/* TAB 1: OVERVIEW & HERITAGE */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
                {/* BIGGER HERO LOGO */}
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center p-3 shrink-0 border-2 border-rose-200 shadow-md ring-4 ring-rose-50">
                  <img 
                    src={logoUrl} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = cdnLogoUrl;
                    }}
                    alt="Official Stree Clinic Logo" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-2 flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      National NGO · Estd. 1978
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      30+ Clinical Centres in 7+ States
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      MoHFW Government Partner
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Pioneering Reproductive, Maternal & Family Health Care Across Bharat Since 1978
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Parivar Seva Sanstha</strong> operates the specialized <strong>Stree Clinic</strong> network. Founded in 1978 by Late Smt. Sudha Tewari, we have delivered dignified, confidential, non-judgmental reproductive healthcare, safe abortion under the MTP Act, family planning, and preventive wellness checkups to over 15 million clients across Rajasthan, Delhi-NCR, Uttar Pradesh, Bihar, West Bengal, and Tamil Nadu.
                  </p>
                </div>
              </div>

              {/* Four Pillar Value System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 font-bold">
                    01
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Walk-In & Walk-Out Care</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Streamlined outpatient procedures and day-care recovery designed for minimal patient disruption and zero waiting anxiety.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold">
                    02
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">100% Subsidized BPL Care</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Free care under Government FPIS scheme and dedicated Parivar Seva Charitable Trust fund for economically disadvantaged women.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 font-bold">
                    03
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Safe Abortion (MTP Act 2021)</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Strict legal compliance for gestation up to 24 weeks with single/dual RMP certification, pre/post counseling, and confidentiality.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 font-bold">
                    04
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Autoclave Sterility Standards</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Stringent infection control with Class-B autoclaving, single-use Karman cannulae, and bio-medical waste segregation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL SERVICES SPECTRUM */}
          {activeSubTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Clinical Services Catalog (As per streeclinic.com)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive reproductive, maternal, and preventive wellness treatments
                  </p>
                </div>
                {onOpenRateList && (
                  <button
                    onClick={onOpenRateList}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                  >
                    <span>View Rate List</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Safe Abortion */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    CAC / MTP ACT 2021
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Safe & Legal Abortion Services
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Non-judgmental, confidential first and second trimester care.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• <strong>Medical Abortion (MA)</strong>: Mifepristone 200mg + Misoprostol 800mcg (≤9 wks / 63 days).</li>
                    <li>• <strong>Manual Vacuum Aspiration (MVA)</strong>: Gentle suction 6-12 wks.</li>
                    <li>• <strong>Second Trimester MTP (12-20 wks)</strong>: 1 RMP certification Form 1.</li>
                    <li>• <strong>Higher Gestation (20-24 wks)</strong>: 2 RMP certification Form E.</li>
                  </ul>
                </div>

                {/* Family Planning */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CONTRACEPTION & FP
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Temporary & Permanent Family Planning
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Empowering couples with full contraceptive basket choices.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• <strong>Copper-T 380A & Multiload 375</strong>: 5 to 10 year spacing.</li>
                    <li>• <strong>Antara DMPA</strong>: 150mg IM every 3 months.</li>
                    <li>• <strong>Minilap Pomeroy Tubectomy</strong>: 100% Free for BPL.</li>
                    <li>• <strong>No-Scalpel Vasectomy (NSV)</strong>: 15-minute stitch-free male sterilization.</li>
                  </ul>
                </div>

                {/* Medi-Check */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    PREVENTIVE PACKAGES
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Medi-Check Health & Wellness
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Early screening packages for women and men.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• <strong>Basic Medi-Check</strong>: Pap Smear, Hb%, Urine, Sugar, Breast Exam.</li>
                    <li>• <strong>Comprehensive Medi-Check</strong>: CBC, LFT, KFT, Lipids, Pap Smear.</li>
                    <li>• <strong>Thyroid & HbA1c Add-ons</strong>: Full endocrine evaluation.</li>
                    <li>• <strong>VIA Cervical Screening</strong>: Visual inspection with acetic acid.</li>
                  </ul>
                </div>

                {/* Gynaecology & Minor OT */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    GYNAECOLOGY OPD
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Gynaecology & Minor Procedures
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    OPD diagnosis and day-care surgical interventions.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• Menstrual disorders, PCOD/PCOS, and abnormal bleeding.</li>
                    <li>• <strong>Cervical Cryocautery</strong>: Painless freezing for erosion.</li>
                    <li>• Diagnostic & Therapeutic D&C and endometrial sampling.</li>
                    <li>• Bartholin cyst drainage & marsupialization.</li>
                  </ul>
                </div>

                {/* Infertility Workup */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    INFERTILITY CLINIC
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Couple Fertility & Sonography
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Systematic evaluation of male and female reproductive factors.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• Ovulation induction with Letrozole / Clomiphene.</li>
                    <li>• Serial <strong>Follicular Monitoring Sonography</strong>.</li>
                    <li>• Semen Analysis (WHO standard motility/morphology).</li>
                    <li>• Hormonal assays (AMH, FSH, LH, Prolactin, TSH).</li>
                  </ul>
                </div>

                {/* Peri-Menopause */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    MATURE WOMEN HEALTH
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2 mb-1">
                    Peri-Menopause & Menopause
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Holistic climacteric support and bone health preservation.
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    <li>• 11-item <strong>Menopause Rating Scale (MRS)</strong> scoring.</li>
                    <li>• Hot flashes, insomnia, and mood symptom management.</li>
                    <li>• DEXA bone density screening & calcium optimization.</li>
                    <li>• Non-hormonal isoflavones and vaginal health care.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RATE LIST & SUBSIDY HIGHLIGHTS */}
          {activeSubTab === 'tariffs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Transparent Tariff & Charitable Subsidy Card (Sample Rate Card)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Stree Clinic maintains standardized rates lower than private hospitals without hidden fees.
                  </p>
                </div>
                {onOpenRateList && (
                  <button
                    onClick={onOpenRateList}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
                  >
                    Open Full Interactive Rate Master
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Service Code</th>
                      <th className="py-2.5 px-3">Clinical Service Description</th>
                      <th className="py-2.5 px-3 text-right">Standard Fee</th>
                      <th className="py-2.5 px-3 text-right">BPL Subsidized Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {OFFICIAL_STREE_CLINIC_RATE_LIST.slice(0, 10).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{r.code}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{r.serviceName}</span>
                          <span className="text-[11px] text-slate-500">{r.description.slice(0, 85)}...</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                          ₹{r.standardFeeINR.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                          {r.isFreeForBpl ? 'FREE (₹0)' : `₹${r.bplSubsidizedFeeINR}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY STANDARDS & HELPLINES */}
          {activeSubTab === 'standards' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Infection Control */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      Clinical Infection Control & OT Protocol
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Stree Clinics enforce strict surgical sterility under the guidance of our Quality Assurance Committee:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Class-B Autoclave</strong>: Microprocessor vacuum sterilization of all surgical instruments with physical, chemical, and biological indicator strips.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Single-Use Cannulae</strong>: Sterile disposable Karman cannulae for vacuum aspiration.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Bio-Medical Waste Segregation</strong>: Standard color-coded yellow, red, white, and blue barcoded disposal compliant with BMW Rules 2016.</span>
                    </li>
                  </ul>
                </div>

                {/* Clinic Timings & Helplines */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-rose-600" />
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      Clinic Timings & 24x7 Emergency Helplines
                    </h4>
                  </div>
                  <div className="text-xs space-y-2 text-slate-700">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold block text-slate-900">OPD & Procedure Hours:</span>
                      <span className="text-slate-600">Monday to Saturday: 9:00 AM – 5:00 PM (Sunday Closed for Elective OT)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="font-bold block text-rose-900">Post-MTP 24x7 Patient Helpline:</span>
                      <span className="text-rose-800 font-mono font-bold text-xs">Toll-Free: 1800-11-7890 · Emergency WhatsApp: +91 98290 12345</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="font-bold block text-emerald-900">Central Communication Desk:</span>
                      <span className="text-emerald-800">Email: info@streeclinic.com · Portal: www.streeclinic.com</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-rose-600" />
            <span>Official Portal: <strong>https://www.streeclinic.com/</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
