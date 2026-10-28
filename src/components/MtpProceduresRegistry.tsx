/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  ShieldCheck, 
  Clock, 
  Activity,
  FileCheck,
  Stethoscope,
  X
} from 'lucide-react';
import { 
  MtpProcedureRecord, 
  MtpGestationTier, 
  PatientRecord, 
  UserAccount 
} from '../types/clinical';

interface MtpProceduresRegistryProps {
  currentBranch: string;
  currentUser: UserAccount;
  patients: PatientRecord[];
  mtpRecords: MtpProcedureRecord[];
  onAddMtpRecord: (rec: MtpProcedureRecord) => void;
  onOpenIntakeForPatient: (patient: PatientRecord) => void;
}

export const GESTATION_TIERS: { tier: MtpGestationTier; weeksRange: string; legalReq: string; primaryMethods: string }[] = [
  {
    tier: '6-8 weeks (≤63 Days - Early Medical / MVA)',
    weeksRange: '6 - 8 Weeks',
    legalReq: '1 RMP Signature (Form 1)',
    primaryMethods: 'Tab Mifepristone 200mg + Tab Misoprostol 800mcg (Buccal/Oral) OR MVA'
  },
  {
    tier: '8-10 weeks (1st Trimester MVA / EVA)',
    weeksRange: '8 - 10 Weeks',
    legalReq: '1 RMP Signature (Form 1)',
    primaryMethods: 'MVA (Manual Vacuum Aspiration with Karman Cannula 6-8mm) / EVA'
  },
  {
    tier: '10-12 weeks (1st Trimester Suction & Curettage)',
    weeksRange: '10 - 12 Weeks',
    legalReq: '1 RMP Signature (Form 1)',
    primaryMethods: 'EVA (Electric Vacuum Aspiration) / Suction Evacuation & Curettage'
  },
  {
    tier: '12-14 weeks (Early 2nd Trimester D&E)',
    weeksRange: '12 - 14 Weeks',
    legalReq: '1 RMP Signature (MTP Act 2021)',
    primaryMethods: 'Cervical Priming (Misoprostol 400mcg 3h pre-op) + D&E'
  },
  {
    tier: '14-16 weeks (2nd Trimester Cervical Priming + D&E)',
    weeksRange: '14 - 16 Weeks',
    legalReq: '1 RMP Signature (MTP Act 2021)',
    primaryMethods: 'Dilatation & Evacuation (D&E) with Sopher Forceps + Syntocinon Infusion'
  },
  {
    tier: '16-18 weeks (2nd Trimester Medical Induction / D&E)',
    weeksRange: '16 - 18 Weeks',
    legalReq: '1 RMP Signature (MTP Act 2021)',
    primaryMethods: 'Medical Induction (Serial Misoprostol / Carboprost) or Surgical D&E'
  },
  {
    tier: '18-20 weeks (2nd Trimester Medical Induction)',
    weeksRange: '18 - 20 Weeks',
    legalReq: '1 RMP Signature (MTP Act 2021)',
    primaryMethods: 'Medical Induction + Cervical Dilatation + Evacuation'
  },
  {
    tier: '20-22 weeks (Higher Gestation 2-RMP Form E + Foley)',
    weeksRange: '20 - 22 Weeks',
    legalReq: 'MANDATORY: 2 RMP Signatures (Form E Statutory Grounds)',
    primaryMethods: 'Mifepristone + Intra-cervical Foley Catheter (30ml) + Serial Misoprostol Doses 1-6'
  },
  {
    tier: '22-24 weeks (Higher Gestation 2-RMP Form E + Serial Miso)',
    weeksRange: '22 - 24 Weeks',
    legalReq: 'MANDATORY: 2 RMP Signatures (Form E Special Vulnerable Categories)',
    primaryMethods: 'Intra-cervical Foley + Serial Misoprostol (up to 6 doses) + Inj Carboprost/Syntocinon'
  },
];

export const MtpProceduresRegistry: React.FC<MtpProceduresRegistryProps> = ({
  currentBranch,
  currentUser,
  patients,
  mtpRecords,
  onAddMtpRecord,
  onOpenIntakeForPatient,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter records strictly by current clinic branch
  const branchMtpRecords = mtpRecords.filter((r) => r.branch === currentBranch);
  const branchPatients = patients.filter((p) => p.clinicLocation === currentBranch);

  const filteredRecords = branchMtpRecords.filter((rec) => {
    const matchesTier = selectedTier === 'All' || rec.gestationTier === selectedTier;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      rec.patientName.toLowerCase().includes(q) ||
      rec.intakeRegistrationNo.toLowerCase().includes(q) ||
      rec.mtpAdmissionNo.toLowerCase().includes(q) ||
      rec.rmp1Doctor.toLowerCase().includes(q);

    return matchesTier && matchesSearch;
  });

  // New MTP Form draft state
  const [formPatientId, setFormPatientId] = useState(branchPatients[0]?.id || '');
  const [formTier, setFormTier] = useState<MtpGestationTier>(GESTATION_TIERS[0].tier);
  const [formWeeks, setFormWeeks] = useState(7);
  const [formMethod, setFormMethod] = useState<MtpProcedureRecord['procedureMethod']>(
    'Medical (Mifepristone + Misoprostol)'
  );
  const [formRmp2, setFormRmp2] = useState('');
  const [formReason, setFormReason] = useState('Contraceptive failure to limit family size (Section 3(2)(b))');
  const [formPoc, setFormPoc] = useState<MtpProcedureRecord['pocExpulsionStatus']>('Complete');
  const [formObservationHours, setFormObservationHours] = useState(4);
  const [formContraception, setFormContraception] = useState('Oral Contraceptive Pills (OCP) issued');
  const [formAdvice, setFormAdvice] = useState('Cap Doxycycline 100mg BD x 7d, Tab Methylergometrine 0.125mg TDS. Day 15 USG check.');

  const isHigherGestation = formWeeks >= 20 || formTier.includes('20-22') || formTier.includes('22-24');

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = branchPatients.find((p) => p.id === formPatientId);
    if (!pat) return;

    const newRec: MtpProcedureRecord = {
      id: `mtp-rec-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.clientName,
      intakeRegistrationNo: pat.intakeRegistrationNo,
      mtpAdmissionNo: pat.mtpAdmissionNo || `MTP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      branch: currentBranch,
      date: new Date().toISOString().split('T')[0],
      gestationTier: formTier,
      gestationWeeks: Number(formWeeks),
      procedureMethod: formMethod,
      rmp1Doctor: currentUser.displayName,
      rmp2Doctor: isHigherGestation ? formRmp2 || 'Dr. Anand Verma, MS (Surgeon)' : undefined,
      statutoryReasonUnderAct: formReason,
      consentSigned: true,
      pocExpulsionStatus: formPoc,
      anesthesiaType: formMethod.includes('Medical') ? 'Oral Analgesia' : 'Paracervical Block + IV Sedation',
      complications: 'None. Smooth evacuation, vital signs stable.',
      postProcedureObservationHours: Number(formObservationHours),
      contraceptionGiven: formContraception,
      dischargeAdvice: formAdvice,
    };

    onAddMtpRecord(newRec);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-rose-600 font-bold">
              MTP Act 2021 Statutory Registry
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">{currentBranch}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Medical Termination of Pregnancy (MTP) Services & Procedures
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive gestation-wise procedural documentation from 6–8 weeks up to 22–24 weeks with Form 1 and Form E (2 RMPs) certification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record MTP Procedure</span>
        </button>
      </div>

      {/* Gestation Tiers Statutory Matrix Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Gestation-Wise Clinical & Legal Protocols (6 to 24 Weeks)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Government of India MTP Amendment Act
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GESTATION_TIERS.map((tierItem) => (
            <div
              key={tierItem.tier}
              onClick={() => setSelectedTier(tierItem.tier)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTier === tierItem.tier
                  ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900">{tierItem.weeksRange}</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  {tierItem.tier.includes('20-22') || tierItem.tier.includes('22-24') ? (
                    <span className="text-rose-700 bg-rose-100 px-1 rounded">2 RMPs Form E</span>
                  ) : (
                    <span>1 RMP Form 1</span>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {tierItem.primaryMethods}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-200/60 pt-1">
                {tierItem.legalReq}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Filter Gestation:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="All">All Gestation Windows (6 - 24 Weeks)</option>
            {GESTATION_TIERS.map((t) => (
              <option key={t.tier} value={t.tier}>
                {t.tier}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient, MTP Admission No, or Doctor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* MTP Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">MTP Register No</th>
                <th className="px-4 py-3">Patient Details</th>
                <th className="px-4 py-3">Gestation & Procedure Method</th>
                <th className="px-4 py-3">Certifying RMP Doctors</th>
                <th className="px-4 py-3">Statutory Ground</th>
                <th className="px-4 py-3">POC & Contraception</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No MTP procedure records found for this gestation filter in {currentBranch}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const pat = branchPatients.find((p) => p.id === rec.patientId);
                  const isHigh = rec.gestationWeeks >= 20;
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {rec.mtpAdmissionNo}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rec.date} · {rec.postProcedureObservationHours}h post-op
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{rec.patientName}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {rec.intakeRegistrationNo}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{rec.gestationWeeks} Weeks</span>
                          {isHigh && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-1 rounded font-mono">
                              Higher Gestation
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-rose-700">
                          {rec.procedureMethod}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-800">
                        <div>{rec.rmp1Doctor}</div>
                        {rec.rmp2Doctor && (
                          <div className="text-[10px] text-rose-700 font-semibold">
                            RMP 2: {rec.rmp2Doctor}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 text-[11px] max-w-xs truncate">
                        {rec.statutoryReasonUnderAct}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> POC {rec.pocExpulsionStatus}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Method: {rec.contraceptionGiven}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {pat && (
                          <button
                            onClick={() => onOpenIntakeForPatient(pat)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            Open Intake Sheet
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New MTP Procedure Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Record MTP Procedure Entry (Gestation-Wise)
                </h3>
                <p className="text-[11px] text-slate-500">{currentBranch}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Patient *</label>
                <select
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 bg-slate-50"
                >
                  {branchPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName} ({p.intakeRegistrationNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Gestation Tier *</label>
                  <select
                    value={formTier}
                    onChange={(e) => {
                      const t = e.target.value as MtpGestationTier;
                      setFormTier(t);
                      if (t.includes('6-8')) setFormWeeks(7);
                      else if (t.includes('8-10')) setFormWeeks(9);
                      else if (t.includes('10-12')) setFormWeeks(11);
                      else if (t.includes('12-14')) setFormWeeks(13);
                      else if (t.includes('14-16')) setFormWeeks(15);
                      else if (t.includes('16-18')) setFormWeeks(17);
                      else if (t.includes('18-20')) setFormWeeks(19);
                      else if (t.includes('20-22')) setFormWeeks(21);
                      else if (t.includes('22-24')) setFormWeeks(23);
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  >
                    {GESTATION_TIERS.map((t) => (
                      <option key={t.tier} value={t.tier}>
                        {t.tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Exact Gestation (Weeks) *</label>
                  <input
                    type="number"
                    min={6}
                    max={24}
                    value={formWeeks}
                    onChange={(e) => setFormWeeks(parseInt(e.target.value) || 7)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Procedure Method *</label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                >
                  <option value="Medical (Mifepristone + Misoprostol)">Medical Abortion (Mifepristone 200mg + Misoprostol 800mcg)</option>
                  <option value="MVA (Manual Vacuum Aspiration)">MVA (Manual Vacuum Aspiration with Karman Cannula)</option>
                  <option value="EVA (Electric Vacuum Aspiration)">EVA (Electric Vacuum Aspiration)</option>
                  <option value="D&E (Dilatation & Evacuation)">D&E (Dilatation & Evacuation)</option>
                  <option value="Foley Catheter + Serial Misoprostol">Intra-cervical Foley's Catheter + Serial Misoprostol (Higher Gestation)</option>
                  <option value="Surgical Curettage">Surgical Curettage / D&C</option>
                </select>
              </div>

              {isHigherGestation && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>FORM E Mandatory Requirement (2 RMP Signatures for &gt;20 Weeks)</span>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-rose-900">Second Registered Medical Practitioner (RMP 2) *</label>
                    <input
                      type="text"
                      required
                      value={formRmp2}
                      onChange={(e) => setFormRmp2(e.target.value)}
                      placeholder="e.g. Dr. Anand Verma, MS (Reg #RMC-31840)"
                      className="w-full border border-rose-300 bg-white rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-800 block mb-1">Statutory Grounds under MTP Act *</label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                >
                  <option value="Contraceptive failure to limit family size (Section 3(2)(b))">Contraceptive failure to limit family size (Section 3(2)(b))</option>
                  <option value="Grave injury to physical / mental health of pregnant woman">Grave injury to physical / mental health of pregnant woman</option>
                  <option value="Survivor of sexual assault or rape (Form E Ground A)">Survivor of sexual assault or rape (Form E Ground A)</option>
                  <option value="Minor under 18 years of age (Form E Ground B)">Minor under 18 years of age (Form E Ground B)</option>
                  <option value="Change of marital status during ongoing pregnancy (Form E Ground C)">Change of marital status during pregnancy (Form E Ground C)</option>
                  <option value="Foetal malformation with risk of serious handicap (Form E Ground F)">Foetal malformation with risk of serious handicap (Form E Ground F)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Products of Conception (POC)</label>
                  <select
                    value={formPoc}
                    onChange={(e) => setFormPoc(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  >
                    <option value="Complete">Complete (Verified Sac & Villi)</option>
                    <option value="Incomplete (MVA Done)">Incomplete (MVA Done)</option>
                    <option value="Pending">Pending Expulsion</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Post-Op Observation (Hours)</label>
                  <input
                    type="number"
                    value={formObservationHours}
                    onChange={(e) => setFormObservationHours(parseInt(e.target.value) || 4)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Contraception Provided</label>
                <input
                  type="text"
                  value={formContraception}
                  onChange={(e) => setFormContraception(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Advice on Discharge</label>
                <textarea
                  rows={2}
                  value={formAdvice}
                  onChange={(e) => setFormAdvice(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs"
                >
                  Save to MTP Registry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
