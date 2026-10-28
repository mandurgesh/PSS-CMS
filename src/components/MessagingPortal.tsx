/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  User, 
  Stethoscope, 
  Clock, 
  Search,
  Check
} from 'lucide-react';
import { SecureMessage, PatientRecord, UserRole } from '../types/clinical';

interface MessagingPortalProps {
  messages: SecureMessage[];
  patients: PatientRecord[];
  onSendMessage: (msg: SecureMessage) => void;
  currentRole: UserRole;
  preselectedPatientId?: string;
}

export const MessagingPortal: React.FC<MessagingPortalProps> = ({
  messages,
  patients,
  onSendMessage,
  currentRole,
  preselectedPatientId,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatientId || patients[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [priority, setPriority] = useState<'Routine' | 'Priority' | 'Urgent'>('Routine');
  const [category, setCategory] = useState<SecureMessage['category']>('Prescription');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const threadMessages = messages.filter((m) => m.patientId === selectedPatient?.id);

  // Quick Clinical Templates
  const templates = [
    {
      title: 'Post-MA Bleeding Check',
      text: 'Mild cramping is normal. If you soak through more than 2 maxi pads in an hour for 2 hours in a row, call our 24/7 emergency line immediately.',
      category: 'Prescription' as const,
      priority: 'Priority' as const,
    },
    {
      title: 'Pre-Op Fasting Reminder',
      text: 'Please remain strictly fasting (no food or water) for 6 hours prior to your scheduled procedure tomorrow.',
      category: 'Pre-op Fasting' as const,
      priority: 'Routine' as const,
    },
    {
      title: 'Ultrasound Report Ready',
      text: 'Your pelvic ultrasound scan results have been verified by the radiologist and uploaded to your confidential case sheet.',
      category: 'Lab Inquiries' as const,
      priority: 'Routine' as const,
    },
    {
      title: '3-Month Vasectomy Semen Reminder',
      text: 'Friendly reminder that your 3-month post-vasectomy semen analysis is due to verify complete azoospermia.',
      category: 'Recovery Check' as const,
      priority: 'Routine' as const,
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPatient) return;

    const newMsg: SecureMessage = {
      id: `msg-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.clientName,
      intakeRegistrationNo: selectedPatient.intakeRegistrationNo,
      sender: currentRole.includes('Surgeon') || currentRole.includes('Gynecologist') ? 'Doctor' : 'Nurse/Counselor',
      senderName: `${currentRole}`,
      timestamp: new Date().toISOString(),
      content: replyText.trim(),
      priority,
      read: true,
      category,
    };

    onSendMessage(newMsg);
    setReplyText('');
  };

  const applyTemplate = (t: typeof templates[0]) => {
    setReplyText(t.text);
    setCategory(t.category);
    setPriority(t.priority);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[700px]">
      
      {/* Left Patient Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Secure Patient Inquiries
            </h3>
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              <Lock className="w-3 h-3" /> E2E Encrypted
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {patients
            .filter((p) => p.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((patient) => {
              const patientMsgs = messages.filter((m) => m.patientId === patient.id);
              const lastMsg = patientMsgs[patientMsgs.length - 1];
              const isSelected = patient.id === selectedPatient?.id;

              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-rose-50/60 border-l-4 border-rose-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{patient.clientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mb-1">
                    {patient.intakeRegistrationNo}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    {lastMsg ? lastMsg.content : 'No previous messages. Tap to start secure triage.'}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Chat Thread View */}
      {selectedPatient ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{selectedPatient.clientName}</span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedPatient.intakeRegistrationNo}
                </span>
                <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                  {selectedPatient.activeDepartments[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Contact: {selectedPatient.contactNo} · Clinician on duty: {currentRole}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">HIPAA Messaging Channel</span>
            </div>
          </div>

          {/* Quick Clinical Templates Strip */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
              Quick Clinical Presets:
            </span>
            {templates.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => applyTemplate(tpl)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
              >
                {tpl.title}
              </button>
            ))}
          </div>

          {/* Messages Bubble Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
            {threadMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <Lock className="w-8 h-8 text-slate-300 mb-2" />
                <p>No messages yet in this secure clinical thread.</p>
                <p className="text-[11px]">Send a pre-op or post-procedure consultation note below.</p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isFromPatient = msg.sender === 'Patient';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isFromPatient ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-600">{msg.senderName}</span>
                      <span>·</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.priority === 'Urgent' && (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1 rounded">
                          Urgent Triage
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isFromPatient
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                          : 'bg-slate-900 text-white rounded-tr-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Composition Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Priority:</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="border border-slate-300 rounded px-2 py-0.5 text-xs bg-white text-slate-700"
                >
                  <option value="Routine">Routine</option>
                  <option value="Priority">Priority</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Encrypted via AES-256-GCM Session Key
              </span>
            </div>

            <div className="flex gap-2">
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type confidential clinical advice or instructions for patient..."
                className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a patient to open secure messaging.
        </div>
      )}

    </div>
  );
};
