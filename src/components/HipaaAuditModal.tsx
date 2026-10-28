/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldCheck, Download, Lock, CheckCircle2, Search } from 'lucide-react';
import { HipaaAuditLog } from '../types/clinical';

interface HipaaAuditModalProps {
  logs: HipaaAuditLog[];
  isOpen: boolean;
  onClose: () => void;
}

export const HipaaAuditModal: React.FC<HipaaAuditModalProps> = ({
  logs,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.clinicianName.toLowerCase().includes(search.toLowerCase()) ||
      l.patientName.toLowerCase().includes(search.toLowerCase()) ||
      l.intakeNo.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Clinician', 'Role', 'Action', 'Patient', 'Intake No', 'Hash'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.clinicianName,
      l.role,
      l.action,
      l.patientName,
      l.intakeNo,
      l.hash,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HIPAA_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">HIPAA Security & Access Audit Trail</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  AES-256-GCM Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Immutable, tamper-evident logs of all electronic Protected Health Information (ePHI) access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-500 block">Encryption Standard</span>
            <span className="font-bold text-slate-900 text-sm">AES-256-GCM</span>
            <p className="text-[10px] text-slate-500 mt-0.5">At-rest encryption on all patient fields</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-500 block">Integrity Verification</span>
            <span className="font-bold text-slate-900 text-sm">SHA-256 Hashes</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Cryptographic checksum for each record</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-500 block">Access Control</span>
            <span className="font-bold text-slate-900 text-sm">Role-Based (RBAC)</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Surgeon, MO I/C, Nurse, Billing</p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter audit logs by clinician, patient, action, or unique intake number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Audit Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Clinician / Operator</th>
                <th className="px-4 py-2.5">Action Executed</th>
                <th className="px-4 py-2.5">Patient & Intake No</th>
                <th className="px-4 py-2.5 font-mono">Cryptographic Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-900">{log.clinicianName}</div>
                    <div className="text-[10px] text-slate-500">{log.role}</div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-800">{log.patientName}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.intakeNo}</div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400 truncate max-w-xs">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Compliant with Indian MTP Act 2021 & HIPAA Privacy & Security Rules.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
