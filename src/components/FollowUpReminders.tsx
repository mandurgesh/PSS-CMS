/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCheck, 
  Clock, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { FollowUpReminder, PatientRecord } from '../types/clinical';
import { generateProtocolReminders } from '../utils/security';

interface FollowUpRemindersProps {
  reminders: FollowUpReminder[];
  patients: PatientRecord[];
  onDispatchReminder: (reminderId: string) => void;
  onAddReminder: (reminder: FollowUpReminder) => void;
}

export const FollowUpReminders: React.FC<FollowUpRemindersProps> = ({
  reminders,
  patients,
  onDispatchReminder,
  onAddReminder,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeModalReminder, setActiveModalReminder] = useState<FollowUpReminder | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const filtered = reminders.filter((rem) => {
    const matchesType = filterType === 'All' || rem.reminderType.includes(filterType);
    const matchesStatus = filterStatus === 'All' || rem.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleSimulateDispatch = (reminder: FollowUpReminder) => {
    onDispatchReminder(reminder.id);
    setDispatchSuccess(`Notification dispatched to ${reminder.contactNo} via ${reminder.channel}!`);
    setTimeout(() => setDispatchSuccess(null), 4000);
  };

  const handleAutoGenerateProtocols = () => {
    let generatedCount = 0;
    patients.forEach((pat) => {
      const generated = generateProtocolReminders(pat);
      generated.forEach((genRem) => {
        const alreadyExists = reminders.some(
          (r) => r.patientId === genRem.patientId && r.reminderType === genRem.reminderType
        );
        if (!alreadyExists) {
          onAddReminder(genRem);
          generatedCount++;
        }
      });
    });
    setDispatchSuccess(`Generated ${generatedCount} protocol reminders based on Stree Clinic medical sheets!`);
    setTimeout(() => setDispatchSuccess(null), 4000);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-rose-600 font-bold">
              Automated Surveillance & Retention
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">MTP Day 3/4 Check-ins & 3-Mo Semen Tests</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Clinical Follow-Up Surveillance Engine
          </h2>
          <p className="text-xs text-slate-500">
            Mandated post-procedure checks as documented in official Stree Clinic intake sheets.
          </p>
        </div>

        <button
          onClick={handleAutoGenerateProtocols}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sync Patient Protocols</span>
        </button>
      </div>

      {dispatchSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispatchSuccess}</span>
          </div>
          <button onClick={() => setDispatchSuccess(null)} className="text-emerald-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Filter Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Filter Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="All">All Protocol Reminders</option>
            <option value="Day 3 Miso">Day 3 Misoprostol Check-in</option>
            <option value="Day 4 Post-Miso">Day 4 Post-Abortion Completion</option>
            <option value="Day 15 Compulsory">Day 15 Compulsory Visit (MTP)</option>
            <option value="3-Month Semen">3-Month Vasectomy Semen Exam</option>
            <option value="ANC">Antenatal Care Interval</option>
            <option value="Follicular">Follicular Scan Date</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Dispatch</option>
            <option value="Sent">Sent / Contacted</option>
            <option value="Completed">Completed by Patient</option>
          </select>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Total Active: {filtered.length} reminders
        </div>
      </div>

      {/* Reminders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rem) => {
          const isPending = rem.status === 'Pending';
          return (
            <div
              key={rem.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-shadow flex flex-col justify-between ${
                isPending ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{rem.patientName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {rem.intakeRegistrationNo}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rem.status === 'Sent'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {rem.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{rem.reminderType}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    Due: {rem.dueDate} ({rem.dueTime})
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                  "{rem.customMessage}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  {rem.channel === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
                  {rem.channel === 'Phone Call' && <Phone className="w-3.5 h-3.5 text-sky-600" />}
                  {rem.channel === 'SMS' && <Bell className="w-3.5 h-3.5 text-amber-600" />}
                  <span className="font-medium text-slate-700">{rem.channel}</span>
                  <span className="font-mono text-[11px]">({rem.contactNo})</span>
                </div>

                <div className="flex items-center gap-2">
                  {isPending ? (
                    <button
                      onClick={() => handleSimulateDispatch(rem)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Now</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Sent & Logged
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
