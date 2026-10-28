/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  MessageSquare, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Plus,
  Pill
} from 'lucide-react';
import { PatientRecord, ClinicalDepartment } from '../types/clinical';

interface PatientListProps {
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord) => void;
  onPrintPatient: (patient: PatientRecord) => void;
  onOpenBilling: (patient: PatientRecord) => void;
  onMessagePatient: (patient: PatientRecord) => void;
  onOpenNewIntake: () => void;
  onPrescribePatient?: (patient: PatientRecord) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onSelectPatient,
  onPrintPatient,
  onOpenBilling,
  onMessagePatient,
  onOpenNewIntake,
  onPrescribePatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [schemeFilter, setSchemeFilter] = useState<'All' | 'BPL' | 'APL' | 'Free'>('All');

  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      patient.clientName.toLowerCase().includes(q) ||
      patient.contactNo.includes(q) ||
      patient.intakeRegistrationNo.toLowerCase().includes(q) ||
      (patient.ggNo && patient.ggNo.toLowerCase().includes(q)) ||
      (patient.steriRegisterNo && patient.steriRegisterNo.toLowerCase().includes(q)) ||
      (patient.mtpAdmissionNo && patient.mtpAdmissionNo.toLowerCase().includes(q)) ||
      (patient.infertilityNo && patient.infertilityNo.toLowerCase().includes(q));

    const matchesDept =
      departmentFilter === 'All' ||
      patient.activeDepartments.includes(departmentFilter as ClinicalDepartment);

    const matchesScheme =
      schemeFilter === 'All' ||
      (schemeFilter === 'BPL' && patient.statusAPL_BPL === 'BPL') ||
      (schemeFilter === 'APL' && patient.statusAPL_BPL === 'APL') ||
      (schemeFilter === 'Free' && patient.sterilization?.isFreeScheme);

    return matchesSearch && matchesDept && matchesScheme;
  });

  return (
    <div className="space-y-4">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Registered Patient Clinical Records
          </h2>
          <p className="text-xs text-slate-500">
            Unified intake registry for Stree Clinics. Auto-generated medical identifiers and verified consent records.
          </p>
        </div>

        <button
          onClick={onOpenNewIntake}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Intake</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, Phone, Intake No (PSS-2026-...), Steri No, MTP No..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="All">All Departments</option>
              <option value="General Gynae">General Gynae</option>
              <option value="Sterilization (Minilap / Lap / NSV)">Sterilization (Minilap/NSV)</option>
              <option value="Medical Abortion (Form C MTP)">Medical Abortion (Form C)</option>
              <option value="Infertility Consultation">Infertility Consultation</option>
              <option value="Peri-Menopause & Menopause">Menopause (MRS)</option>
              <option value="Surgical Procedures">Surgical Procedures</option>
            </select>

            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value as any)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="All">All Schemes</option>
              <option value="BPL">BPL Beneficiaries</option>
              <option value="APL">APL</option>
              <option value="Free">Free FPIS Scheme</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Counts */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="font-semibold text-slate-800">{filteredPatients.length}</strong> of{' '}
            <span className="font-mono">{patients.length}</span> patient records
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            AES-256 Encrypted at Rest
          </span>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Unique Intake No</th>
                <th className="px-4 py-3">Patient Details</th>
                <th className="px-4 py-3">Primary Department & Sheet No</th>
                <th className="px-4 py-3">Vitals / Hb</th>
                <th className="px-4 py-3">Status / Scheme</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No matching clinical records found. Try adjusting your search query.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const hbVal = parseFloat(patient.investigations.hb);
                  const isAnemic = !isNaN(hbVal) && hbVal < 10.0;
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Unique Intake No */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {patient.intakeRegistrationNo}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Patient Details */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{patient.clientName}</span>
                          <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                            {patient.clinicLocation.replace('Stree Clinic - ', '')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {patient.age}y · {patient.gender} · Ph: {patient.contactNo}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {patient.presentAddress}
                        </div>
                      </td>

                      {/* Department & Form Sheet Numbers */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-rose-700">
                          {patient.activeDepartments[0]}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 space-x-1">
                          {patient.steriRegisterNo && <span>Steri: {patient.steriRegisterNo}</span>}
                          {patient.mtpAdmissionNo && <span>MTP: {patient.mtpAdmissionNo}</span>}
                          {patient.ggNo && <span>GG: {patient.ggNo}</span>}
                          {patient.infertilityNo && <span>INF: {patient.infertilityNo}</span>}
                          {patient.menopauseNo && <span>M: {patient.menopauseNo}</span>}
                        </div>
                      </td>

                      {/* Vitals / Hb */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="tabular-nums">
                          BP: <span className="font-medium text-slate-800">{patient.vitals.bp}</span>
                        </div>
                        <div className="text-[11px]">
                          Hb:{' '}
                          <span
                            className={`font-semibold tabular-nums ${
                              isAnemic ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {patient.investigations.hb} g/dL
                          </span>
                          {isAnemic && (
                            <span className="text-[10px] text-rose-600 block">
                              Low Hb Alert
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status / Scheme */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {patient.sterilization?.isFreeScheme ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
                            Free FPIS Scheme
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded">
                            {patient.statusAPL_BPL} · {patient.billingStatus}
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Ref: {patient.primaryReferral.split('(')[0]}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onSelectPatient(patient)}
                          title="Open Complete Case Sheet"
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          Case Sheet
                        </button>
                        <button
                          onClick={() => onPrintPatient(patient)}
                          title="Print Official Stree Clinic Form"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors inline-flex items-center"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMessagePatient(patient)}
                          title="Message Patient via Encrypted Portal"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors inline-flex items-center"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        {onPrescribePatient && (
                          <button
                            onClick={() => onPrescribePatient(patient)}
                            title="Prescribe Medication & Auto-Notes"
                            className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded-md transition-colors inline-flex items-center"
                          >
                            <Pill className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenBilling(patient)}
                          title="View / Generate Billing Receipt"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors inline-flex items-center"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
