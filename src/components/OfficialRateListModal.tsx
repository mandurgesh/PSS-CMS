/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  Tag, 
  FileText, 
  HeartHandshake, 
  Clock, 
  Info,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { OFFICIAL_STREE_CLINIC_RATE_LIST, RateItem } from '../data/officialRateList';

interface OfficialRateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicBranch: string;
  onSelectForBilling?: (item: RateItem) => void;
}

export const OfficialRateListModal: React.FC<OfficialRateListModalProps> = ({
  isOpen,
  onClose,
  clinicBranch,
  onSelectForBilling,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFreeBpl, setOnlyFreeBpl] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Preventive Medi-Check Packages',
    'MTP & Abortion Services (MTP Act 2021)',
    'Contraception & Family Planning',
    'Gynaecology & Minor OPD Procedures',
    'Ultrasound (USG) & Imaging',
    'Laboratory & Pathology Investigations',
    'Walk-In & Day-Care Services',
  ];

  const filteredRates = OFFICIAL_STREE_CLINIC_RATE_LIST.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesFree = !onlyFreeBpl || item.isFreeForBpl;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      item.serviceName.toLowerCase().includes(q) || 
      item.code.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
    return matchesCat && matchesFree && matchesSearch;
  });

  const handlePrintTariff = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-rose-900/50">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden border border-rose-200">
              <img 
                src="/assets/stree_clinic_logo.png" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
                }}
                alt="Stree Clinic Official Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white tracking-tight">
                  Official Clinical Tariff & Rate List · Stree Clinic
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  Fixed & Transparent Tariffs
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                Parivar Seva Sanstha · Effective 2026-2027 · Regulated Under MoHFW Guidelines ({clinicBranch})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintTariff}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors flex items-center gap-1.5"
              title="Print official price list for patient reception"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Tariff Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Controls: Search & Category Chips */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tariff by service name, code (e.g., MC-BASIC, MTP-MA), procedure, or test..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 bg-white shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={onlyFreeBpl}
                  onChange={(e) => setOnlyFreeBpl(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-emerald-700 font-bold">100% Free for BPL Only</span>
              </label>

              <span className="text-xs text-slate-500 hidden md:inline">
                Found <strong>{filteredRates.length}</strong> services
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 font-medium ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white font-bold shadow-2xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tariff Table / Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRates.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-rose-300 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.code}
                    </span>
                    {item.isFreeForBpl ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100% Free for BPL
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Subsidized Tariff
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition-colors leading-snug">
                    {item.serviceName}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {item.preparationAdvice && (
                    <div className="mt-2 text-[10px] text-amber-800 bg-amber-50/70 border border-amber-200 rounded p-1.5 flex items-start gap-1">
                      <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.preparationAdvice}</span>
                    </div>
                  )}

                  {item.turnaroundTime && (
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.turnaroundTime}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Standard Fee
                    </div>
                    <div className="text-base font-extrabold text-slate-900 tabular-nums">
                      ₹{item.standardFeeINR.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      BPL: {item.isFreeForBpl ? 'FREE (₹0)' : `₹${item.bplSubsidizedFeeINR}`}
                    </div>
                  </div>

                  {onSelectForBilling && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectForBilling(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Add to Bill</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRates.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No services matched your search filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setOnlyFreeBpl(false);
                }}
                className="mt-2 text-xs text-rose-600 font-bold underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Charitable Subsidy Policy:</strong> Parivar Seva Sanstha guarantees that no patient is denied essential care due to inability to pay.
            </span>
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
