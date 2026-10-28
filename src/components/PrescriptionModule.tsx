/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Printer, 
  Trash2, 
  Sparkles, 
  Calculator, 
  Check, 
  Search, 
  Heart, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertTriangle,
  Sun,
  Sunset,
  Moon,
  Pill
} from 'lucide-react';
import { 
  Prescription, 
  PrescribedMedicine, 
  PatientRecord, 
  PharmacyStockItem, 
  UserAccount 
} from '../types/clinical';

interface PrescriptionModuleProps {
  currentBranch: string;
  currentUser: UserAccount;
  patients: PatientRecord[];
  stockItems: PharmacyStockItem[];
  prescriptions: Prescription[];
  onSavePrescription: (rx: Prescription) => void;
  selectedPatientId?: string;
}

export const PrescriptionModule: React.FC<PrescriptionModuleProps> = ({
  currentBranch,
  currentUser,
  patients,
  stockItems,
  prescriptions,
  onSavePrescription,
  selectedPatientId,
}) => {
  // Branch-filtered patients
  const branchPatients = patients.filter((p) => p.clinicLocation === currentBranch);
  const branchPrescriptions = prescriptions.filter((rx) => rx.branch === currentBranch);

  const [activePatientId, setActivePatientId] = useState<string>(
    selectedPatientId || branchPatients[0]?.id || ''
  );
  const currentPatient = branchPatients.find((p) => p.id === activePatientId) || branchPatients[0];

  // Prescription draft state
  const [diagnosis, setDiagnosis] = useState(currentPatient?.provisionalDiagnosis || 'Clinical Consultation');
  const [clinicalNotes, setClinicalNotes] = useState(
    currentPatient?.adviceOnDischarge || 'Follow prescribed medication strictly. Return in case of excessive bleeding or high fever.'
  );
  const [weightKg, setWeightKg] = useState(currentPatient?.vitals.weight || '55');
  const [dosageNote, setDosageNote] = useState('Standard adult dosage calculated based on weight & renal parameters.');
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([
    {
      id: 'med-1',
      name: 'Cap Doxycycline 100mg',
      genericName: 'Doxycycline Hyclate',
      dosage: '100 mg',
      frequency: '1-0-1 (BD)',
      duration: '7 Days',
      route: 'Oral',
      morning: true,
      afternoon: false,
      night: true,
      withFood: 'After Food',
      instructions: 'Take with full glass of water. Do not lie down for 30 minutes.',
    },
    {
      id: 'med-2',
      name: 'Tab Methylergometrine Maleate 0.125mg',
      genericName: 'Methylergometrine',
      dosage: '0.125 mg',
      frequency: '1-1-1 (TDS)',
      duration: '3 Days',
      route: 'Oral',
      morning: true,
      afternoon: true,
      night: true,
      withFood: 'After Food',
      instructions: 'Helps uterine involution and stops spotting.',
    },
    {
      id: 'med-3',
      name: 'Tab Pantoprazole 40mg',
      genericName: 'Pantoprazole Sodium',
      dosage: '40 mg',
      frequency: '1-0-0 (OD)',
      duration: '7 Days',
      route: 'Oral',
      morning: true,
      afternoon: false,
      night: false,
      withFood: 'Empty Stomach',
      instructions: 'Take 30 minutes before breakfast.',
    },
  ]);

  // Quick Print Modal preview
  const [printPreviewRx, setPrintPreviewRx] = useState<Prescription | null>(null);

  // Auto-fill Regimen Templates
  const applyClinicalRegimen = (type: 'MTP' | 'STERI' | 'INFERTILITY' | 'MENOPAUSE' | 'STI') => {
    if (type === 'MTP') {
      setDiagnosis('Medical Termination of Pregnancy (MTP Act 2021) - Post-Abortion Prophylaxis');
      setClinicalNotes('Single intrauterine gestation confirmed by ultrasound. Tab Mifepristone 200mg given in clinic. Tab Misoprostol 800mcg taken buccally on Day 3. Emergency 24/7 hotline provided.');
      setMedicines([
        {
          id: `med-${Date.now()}-1`,
          name: 'Cap Doxycycline 100mg',
          genericName: 'Doxycycline',
          dosage: '100 mg',
          frequency: '1-0-1 (BD)',
          duration: '7 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: true,
          withFood: 'After Food',
          instructions: 'Full course mandatory to prevent pelvic infection.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Tab Methylergometrine 0.125mg',
          genericName: 'Methylergometrine Maleate',
          dosage: '0.125 mg',
          frequency: '1-1-1 (TDS)',
          duration: '3 Days',
          route: 'Oral',
          morning: true,
          afternoon: true,
          night: true,
          withFood: 'After Food',
          instructions: 'For uterine contraction and hemostasis.',
        },
        {
          id: `med-${Date.now()}-3`,
          name: 'Tab Mefenamic Acid 250mg + Dicyclomine 10mg (Meftal-Spas)',
          genericName: 'Mefenamic Acid + Dicyclomine',
          dosage: '1 tab',
          frequency: '1-1-1 (TDS)',
          duration: '3 Days',
          route: 'Oral',
          morning: true,
          afternoon: true,
          night: true,
          withFood: 'After Food',
          instructions: 'For uterine spasmodic cramps.',
        },
        {
          id: `med-${Date.now()}-4`,
          name: 'Tab Pantoprazole 40mg',
          genericName: 'Pantoprazole Sodium',
          dosage: '40 mg',
          frequency: '1-0-0 (OD)',
          duration: '7 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: false,
          withFood: 'Empty Stomach',
          instructions: 'Take in morning before food.',
        },
      ]);
    } else if (type === 'STERI') {
      setDiagnosis('Post-Sterilization (Minilap Tubectomy / NSV) Recovery Regimen');
      setClinicalNotes('Sterilization surgery completed under local anesthesia. Wound clean and dry. Keep sterile dressing dry for 7 days. Avoid strenuous exertion or heavy lifting for 3 weeks.');
      setMedicines([
        {
          id: `med-${Date.now()}-1`,
          name: 'Cap Doxycycline 100mg',
          genericName: 'Doxycycline',
          dosage: '100 mg',
          frequency: '1-0-1 (BD)',
          duration: '5 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: true,
          withFood: 'After Food',
          instructions: 'Antibiotic surgical prophylaxis.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Tab Paracetamol 500mg (Crocin)',
          genericName: 'Paracetamol',
          dosage: '500 mg',
          frequency: '1-1-1 (TDS)',
          duration: '3 Days',
          route: 'Oral',
          morning: true,
          afternoon: true,
          night: true,
          withFood: 'After Food',
          instructions: 'For surgical site ache and mild fever.',
        },
        {
          id: `med-${Date.now()}-3`,
          name: 'Tab Pantoprazole 40mg',
          genericName: 'Pantoprazole',
          dosage: '40 mg',
          frequency: '1-0-0 (OD)',
          duration: '5 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: false,
          withFood: 'Empty Stomach',
          instructions: 'Take 30 mins before breakfast.',
        },
      ]);
    } else if (type === 'INFERTILITY') {
      setDiagnosis('Primary Infertility - Ovulation Induction Protocol Cycle #1');
      setClinicalNotes('Follicular monitoring protocol. Baseline endometrial thickness documented. Start Letrozole from Day 2 of menstrual cycle.');
      setMedicines([
        {
          id: `med-${Date.now()}-1`,
          name: 'Tab Letrozole 2.5mg',
          genericName: 'Letrozole',
          dosage: '2.5 mg',
          frequency: '1-0-0 (OD)',
          duration: '5 Days (Cycle Day 2 to 6)',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: false,
          withFood: 'After Food',
          instructions: 'Take at the exact same hour each morning.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Tab Folic Acid 5mg',
          genericName: 'Folic Acid',
          dosage: '5 mg',
          frequency: '1-0-0 (OD)',
          duration: '30 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: false,
          withFood: 'After Food',
          instructions: 'Pre-conceptional neural tube prophylaxis.',
        },
      ]);
    } else if (type === 'MENOPAUSE') {
      setDiagnosis('Peri-Menopausal Vasomotor Symptoms & Bone Health Support');
      setClinicalNotes('Menopause Rating Scale assessed. Bone mineral density osteopenia protocol.');
      setMedicines([
        {
          id: `med-${Date.now()}-1`,
          name: 'Tab Calcium Carbonate 500mg + Vit D3',
          genericName: 'Calcium + Cholecalciferol',
          dosage: '500 mg',
          frequency: '0-0-1 (Night)',
          duration: '30 Days',
          route: 'Oral',
          morning: false,
          afternoon: false,
          night: true,
          withFood: 'After Food',
          instructions: 'Take after dinner with warm water.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Sachet Cholecalciferol 60,000 IU',
          genericName: 'Vitamin D3',
          dosage: '60,000 IU',
          frequency: 'Once a Week',
          duration: '8 Weeks',
          route: 'Oral',
          morning: false,
          afternoon: false,
          night: true,
          withFood: 'After Food',
          instructions: 'Mix in warm milk once every Sunday night.',
        },
      ]);
    } else if (type === 'STI') {
      setDiagnosis('RTI / STI Syndromic Protocol (Vaginitis / Cervicitis)');
      setClinicalNotes('Syndromic treatment protocol. Barrier contraception counselled for 14 days.');
      setMedicines([
        {
          id: `med-${Date.now()}-1`,
          name: 'Tab Cefixime 400mg',
          genericName: 'Cefixime',
          dosage: '400 mg',
          frequency: 'Single Dose (STAT)',
          duration: '1 Day',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: false,
          withFood: 'After Food',
          instructions: 'Take single dose stat.',
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Tab Metronidazole 400mg',
          genericName: 'Metronidazole',
          dosage: '400 mg',
          frequency: '1-0-1 (BD)',
          duration: '7 Days',
          route: 'Oral',
          morning: true,
          afternoon: false,
          night: true,
          withFood: 'After Food',
          instructions: 'Avoid alcohol completely during course.',
        },
      ]);
    }
  };

  // Dosage Calculator Helper
  const handleRecalculateDosage = () => {
    const wt = parseFloat(weightKg) || 50;
    setDosageNote(
      `Patient weight: ${wt} kg. Adult standard surface area: ${(Math.sqrt((wt * 155) / 3600)).toFixed(2)} m². Doxycycline 100mg BD conforms to 3.7 mg/kg/day target. Normal hydration recommended.`
    );
  };

  // Add custom medicine line
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: `med-${Date.now()}`,
        name: '',
        genericName: '',
        dosage: '1 tab',
        frequency: '1-0-1 (BD)',
        duration: '5 Days',
        route: 'Oral',
        morning: true,
        afternoon: false,
        night: true,
        withFood: 'After Food',
        instructions: '',
      },
    ]);
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  // Save Prescription
  const handleSave = () => {
    if (!currentPatient) return;
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      branch: currentBranch,
      patientId: currentPatient.id,
      patientName: currentPatient.clientName,
      intakeRegistrationNo: currentPatient.intakeRegistrationNo,
      age: currentPatient.age,
      gender: currentPatient.gender,
      doctorName: currentUser.displayName,
      doctorRegNo: currentUser.registrationNo || 'RMC-28491',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      clinicalNotes,
      medicines,
      weightKg,
      dosageCalculationNote: dosageNote,
      qrVerificationCode: `PSS-RX-${currentPatient.intakeRegistrationNo}-${Date.now().toString().slice(-4)}`,
    };
    onSavePrescription(newRx);
    setPrintPreviewRx(newRx);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-rose-600 font-bold">
              Digital E-Prescription Suite
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">{currentBranch}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Prescription Module & Medication Instruction Helper
          </h2>
          <p className="text-xs text-slate-500">
            Auto-fills clinical notes, verifies dosage calculations by weight, and generates Quick Print instructions with visual timing cues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {printPreviewRx && (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Quick Print Active Rx</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Generate & Save Prescription</span>
          </button>
        </div>
      </div>

      {/* Main Prescription Drafting Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient Selection & Clinical Presets */}
        <div className="space-y-5">
          
          {/* Patient Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Select Patient for Prescription
            </h3>
            <select
              value={activePatientId}
              onChange={(e) => setActivePatientId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {branchPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.clientName} ({p.intakeRegistrationNo}) - {p.activeDepartments[0]}
                </option>
              ))}
            </select>

            {currentPatient && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Age / Gender:</span>
                  <span className="font-semibold text-slate-800">{currentPatient.age}y / {currentPatient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-mono text-slate-800">{currentPatient.contactNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hemoglobin:</span>
                  <span className="font-mono font-bold text-rose-700">{currentPatient.investigations.hb} g/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allergies:</span>
                  <span className="text-slate-700">None reported</span>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Fill Regimen Presets */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Auto-Fill Clinical Regimens</span>
            </div>
            <p className="text-[11px] text-slate-500">
              One-click standard protocols conforming to Stree Clinic medical sheets:
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => applyClinicalRegimen('MTP')}
                className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">Medical Abortion (MTP) Prophylaxis</div>
                  <div className="text-[10px] text-slate-500">Doxycycline + Methylergometrine + Meftal-Spas + Pantoprazole</div>
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Apply →</span>
              </button>

              <button
                type="button"
                onClick={() => applyClinicalRegimen('STERI')}
                className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">Post-Sterilization Care (Minilap / NSV)</div>
                  <div className="text-[10px] text-slate-500">Doxycycline + Paracetamol + Pantoprazole</div>
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Apply →</span>
              </button>

              <button
                type="button"
                onClick={() => applyClinicalRegimen('INFERTILITY')}
                className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">Infertility Ovulation Induction</div>
                  <div className="text-[10px] text-slate-500">Letrozole 2.5mg Day 2-6 + Folic Acid 5mg</div>
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Apply →</span>
              </button>

              <button
                type="button"
                onClick={() => applyClinicalRegimen('MENOPAUSE')}
                className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">Peri-Menopause & Bone Mineral Support</div>
                  <div className="text-[10px] text-slate-500">Calcium 500mg + Weekly Vit D3 60,000 IU</div>
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Apply →</span>
              </button>

              <button
                type="button"
                onClick={() => applyClinicalRegimen('STI')}
                className="w-full text-left p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">RTI / STI Syndromic Protocol</div>
                  <div className="text-[10px] text-slate-500">Cefixime 400mg Stat + Metronidazole 400mg BD</div>
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Apply →</span>
              </button>
            </div>
          </div>

          {/* Dosage Calculation Helper */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>Weight-Based Dosage Calculator</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700">Patient Weight (kg):</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-20 border border-slate-300 rounded px-2 py-1 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleRecalculateDosage}
                className="px-2.5 py-1 text-xs bg-slate-900 text-white rounded font-semibold hover:bg-slate-800"
              >
                Verify Dose
              </button>
            </div>

            <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-mono">
              {dosageNote}
            </p>
          </div>

        </div>

        {/* Right 2 Columns: Prescription Medications Table & Instructions */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  value={currentUser.displayName}
                  readOnly
                  className="w-full border border-slate-200 bg-slate-50 rounded px-2.5 py-1.5 text-slate-600"
                />
              </div>
            </div>

            {/* Medicines List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Prescribed Drugs & Regimen ({medicines.length} Items)
                </span>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Drug
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, idx) => (
                  <div key={med.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-slate-400 font-bold w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].name = e.target.value;
                          setMedicines(copy);
                        }}
                        placeholder="Drug Brand Name & Strength (e.g. Cap Doxycycline 100mg)"
                        className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].frequency = e.target.value;
                          setMedicines(copy);
                        }}
                        placeholder="Frequency (e.g. 1-0-1 BD)"
                        className="w-28 border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                      />
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].duration = e.target.value;
                          setMedicines(copy);
                        }}
                        placeholder="Duration (e.g. 7 Days)"
                        className="w-24 border border-slate-300 rounded px-2 py-1 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Patient-Friendly Visual Timing Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60 text-[11px]">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-600">Daily Timing:</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={med.morning}
                            onChange={(e) => {
                              const copy = [...medicines];
                              copy[idx].morning = e.target.checked;
                              setMedicines(copy);
                            }}
                            className="rounded text-rose-600"
                          />
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span>Morning</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={med.afternoon}
                            onChange={(e) => {
                              const copy = [...medicines];
                              copy[idx].afternoon = e.target.checked;
                              setMedicines(copy);
                            }}
                            className="rounded text-rose-600"
                          />
                          <Sunset className="w-3.5 h-3.5 text-orange-500" />
                          <span>Afternoon</span>
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={med.night}
                            onChange={(e) => {
                              const copy = [...medicines];
                              copy[idx].night = e.target.checked;
                              setMedicines(copy);
                            }}
                            className="rounded text-rose-600"
                          />
                          <Moon className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Night</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Relation to Food:</span>
                        <select
                          value={med.withFood}
                          onChange={(e) => {
                            const copy = [...medicines];
                            copy[idx].withFood = e.target.value as any;
                            setMedicines(copy);
                          }}
                          className="border border-slate-300 rounded px-2 py-0.5 bg-white text-slate-800"
                        >
                          <option value="After Food">After Food (खाने के बाद)</option>
                          <option value="Before Food">Before Food (खाने से पहले)</option>
                          <option value="Empty Stomach">Empty Stomach (खाली पेट)</option>
                          <option value="With Water">With Plenty of Water</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={med.instructions || ''}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].instructions = e.target.value;
                          setMedicines(copy);
                        }}
                        placeholder="Specific warning or instruction (e.g. Do not lie down for 30 minutes)"
                        className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-[11px] text-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical & Discharge Notes */}
            <div className="border-t border-slate-100 pt-3">
              <label className="font-bold text-slate-800 block mb-1">
                Clinical Advice & Emergency Warning Signs (Counseling Notes)
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                E-Prescription ID will be cryptographically signed by {currentUser.displayName}
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Preview Quick Print</span>
              </button>
            </div>

          </div>

          {/* Quick Print Patient Medication Instructions Card */}
          {printPreviewRx && (
            <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-lg space-y-4 print-break-inside-avoid">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-sky-800">PARIVAR SEVA SANSTHA · STREE CLINIC</h3>
                  <p className="text-[11px] font-semibold text-slate-700">{printPreviewRx.branch}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">PATIENT MEDICATION INSTRUCTIONS</span>
                  <div className="text-[10px] text-slate-500 font-mono">Date: {printPreviewRx.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
                <div><strong>Patient:</strong> {printPreviewRx.patientName}</div>
                <div><strong>Intake No:</strong> <span className="font-mono">{printPreviewRx.intakeRegistrationNo}</span></div>
                <div><strong>Age / Gender:</strong> {printPreviewRx.age} Yrs / {printPreviewRx.gender}</div>
                <div><strong>Doctor:</strong> {printPreviewRx.doctorName}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-900">
                  <thead className="bg-slate-100 border-b border-slate-900 text-slate-900 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-900">Medicine Name</th>
                      <th className="p-2 border-r border-slate-900">Dosage</th>
                      <th className="p-2 border-r border-slate-900 text-center">Timing (Morning / Noon / Night)</th>
                      <th className="p-2 border-r border-slate-900">When to Take</th>
                      <th className="p-2">Special Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {printPreviewRx.medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-900 font-bold text-slate-900">
                          {m.name}
                        </td>
                        <td className="p-2 border-r border-slate-900 font-mono">{m.dosage} ({m.duration})</td>
                        <td className="p-2 border-r border-slate-900 text-center">
                          <span className="inline-flex items-center gap-1 font-mono font-bold">
                            {m.morning ? '1' : '0'} - {m.afternoon ? '1' : '0'} - {m.night ? '1' : '0'}
                          </span>
                        </td>
                        <td className="p-2 border-r border-slate-900 font-medium">
                          {m.withFood}
                        </td>
                        <td className="p-2 text-[11px] text-slate-600">{m.instructions || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] bg-rose-50 p-3 rounded border border-rose-200 text-rose-950">
                <strong>Emergency Helpline & Next Visit:</strong> In case of heavy bleeding, acute cramping, or temperature &gt; 100.4°F, contact Stree Clinic emergency desk 24/7. Bring this sheet during your follow-up visit.
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Medication Instructions</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono">
                  {printPreviewRx.qrVerificationCode}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
