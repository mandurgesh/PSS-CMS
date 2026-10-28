/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  Save, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Check, 
  Plus, 
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { PatientRecord, ClinicalDepartment, ChildRecord, FollicularRecord, MtpGestationTier } from '../types/clinical';
import { SignatureCanvas } from './SignatureCanvas';
import { calculateEDD, calculateMRSScore, generateIntegrityHash, generateFullIntakeIdentifiers } from '../utils/security';

interface IntakeFormModalProps {
  patient: PatientRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: PatientRecord) => void;
  onPrint: (patient: PatientRecord) => void;
  clinicBranch: string;
}

export const MTP_GESTATION_TIERS: { tier: MtpGestationTier; label: string; statutoryReq: string; defaultMethod: string; isHigherGestation: boolean }[] = [
  { 
    tier: '6-8 weeks (≤63 Days - Early Medical / MVA)', 
    label: '6 to 8 Weeks (≤63 Days - Early Medical Mifepristone + Misoprostol / MVA)',
    statutoryReq: '1 RMP Approval (Form 1)',
    defaultMethod: 'Medical (Mifepristone + Misoprostol)',
    isHigherGestation: false
  },
  { 
    tier: '8-10 weeks (1st Trimester MVA / EVA)', 
    label: '8 to 10 Weeks (1st Trimester MVA / EVA)',
    statutoryReq: '1 RMP Approval (Form 1)',
    defaultMethod: 'MVA (Manual Vacuum Aspiration)',
    isHigherGestation: false
  },
  { 
    tier: '10-12 weeks (1st Trimester Suction & Curettage)', 
    label: '10 to 12 Weeks (Suction Evacuation & Curettage)',
    statutoryReq: '1 RMP Approval (Form 1)',
    defaultMethod: 'EVA (Electric Vacuum Aspiration)',
    isHigherGestation: false
  },
  { 
    tier: '12-14 weeks (Early 2nd Trimester D&E)', 
    label: '12 to 14 Weeks (Early 2nd Trimester D&E)',
    statutoryReq: '1 RMP Approval (MTP Act 2021)',
    defaultMethod: 'Cervical Priming (Misoprostol 400mcg) + D&E',
    isHigherGestation: false
  },
  { 
    tier: '14-16 weeks (2nd Trimester Cervical Priming + D&E)', 
    label: '14 to 16 Weeks (2nd Trimester Cervical Priming + D&E)',
    statutoryReq: '1 RMP Approval (MTP Act 2021)',
    defaultMethod: 'D&E (Dilatation & Evacuation)',
    isHigherGestation: false
  },
  { 
    tier: '16-18 weeks (2nd Trimester Medical Induction / D&E)', 
    label: '16 to 18 Weeks (2nd Trimester Medical Induction / D&E)',
    statutoryReq: '1 RMP Approval (MTP Act 2021)',
    defaultMethod: 'Medical Induction + D&E',
    isHigherGestation: false
  },
  { 
    tier: '18-20 weeks (2nd Trimester Medical Induction)', 
    label: '18 to 20 Weeks (2nd Trimester Medical Induction Protocol)',
    statutoryReq: '1 RMP Approval (MTP Act 2021)',
    defaultMethod: 'Serial Misoprostol Protocol',
    isHigherGestation: false
  },
  { 
    tier: '20-22 weeks (Higher Gestation 2-RMP Form E + Foley)', 
    label: '20 to 22 Weeks (Higher Gestation - 2 RMP Form E Required)',
    statutoryReq: 'Mandatory 2 RMPs (Form E Section 3(2)(b))',
    defaultMethod: 'Foley Catheter + Serial Misoprostol',
    isHigherGestation: true
  },
  { 
    tier: '22-24 weeks (Higher Gestation 2-RMP Form E + Serial Miso)', 
    label: '22 to 24 Weeks (Higher Gestation - 2 RMP Form E Required)',
    statutoryReq: 'Mandatory 2 RMPs (Form E Section 3(2)(b))',
    defaultMethod: 'Foley Catheter + Serial Misoprostol',
    isHigherGestation: true
  },
];

export const DEPARTMENT_OPTIONS: { id: ClinicalDepartment; title: string; sheetName: string; badge: string }[] = [
  { 
    id: 'MTP Services (6-24 Weeks)', 
    title: 'MTP Services (6 to 24 Weeks - Gestation Wise)', 
    sheetName: 'Intake Sheet - MTP Services & Statutory Registry (6 to 24 Weeks - Form C, Form 1 & Form E)',
    badge: 'MTP Reg No'
  },
  { 
    id: 'General Gynae', 
    title: 'General Gynaecology', 
    sheetName: 'Intake Sheet - General Gynae Consultation',
    badge: 'GG No'
  },
  { 
    id: 'Sterilization (Minilap / Lap / NSV)', 
    title: 'Sterilization Procedure', 
    sheetName: 'Intake Sheet - Application & Informed Consent for Sterilization Procedure (Free & Paid)',
    badge: 'STR No'
  },
  { 
    id: 'Medical Abortion (Form C MTP)', 
    title: 'Medical Abortion (Form C ≤63 Days)', 
    sheetName: 'Intake Sheet - Form C: Consent Form (Medical Abortion up to 63 Days)',
    badge: 'MTP / MA No'
  },
  { 
    id: 'Medicated Abortion (20-24 Wks Form E)', 
    title: 'Higher Gestation MTP (Form E 20-24 Wks)', 
    sheetName: 'Intake Sheet - Form C & Form E Consent Form (20 to 24 Weeks - 2 RMPs)',
    badge: 'MTP-HG No'
  },
  { 
    id: 'Other Abortions (OA)', 
    title: 'Other Abortions (OA)', 
    sheetName: 'Intake Sheet - Other Abortions (Interfered / Incomplete / Spontaneous)',
    badge: 'OA No'
  },
  { 
    id: 'Infertility Consultation', 
    title: 'Infertility Consultation', 
    sheetName: 'Intake Sheet - Infertility Consultation & Follicular Study',
    badge: 'INF No'
  },
  { 
    id: 'Peri-Menopause & Menopause', 
    title: 'Peri-Menopause & Menopause', 
    sheetName: 'Intake Sheet - Peri-Menopause & Menopause Consultation (MRS Score)',
    badge: 'MENO No'
  },
  { 
    id: 'Antenatal Care (ANC)', 
    title: 'Antenatal Care (ANC)', 
    sheetName: 'Intake Sheet - Antenatal Consultation (ANC)',
    badge: 'ANC No'
  },
  { 
    id: 'Postnatal Care (PNC)', 
    title: 'Postnatal Care (PNC)', 
    sheetName: 'Intake Sheet - Postnatal Consultation (PNC)',
    badge: 'PNC No'
  },
  { 
    id: 'RTI / STI Consultation', 
    title: 'RTI / STI Consultation', 
    sheetName: 'Intake Sheet - RTI / STI Consultation (Dual Female & Male)',
    badge: 'RTI No'
  },
  { 
    id: 'Surgical Procedures', 
    title: 'Surgical Procedures Record', 
    sheetName: 'Intake Sheet - Record for Surgical Procedures (Female & Male)',
    badge: 'SP No'
  },
  { 
    id: 'Male Consultation', 
    title: 'Male Consultation', 
    sheetName: 'Intake Sheet - Male Consultation',
    badge: 'MC No'
  },
];

export const IntakeFormModal: React.FC<IntakeFormModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSave,
  onPrint,
  clinicBranch,
}) => {
  if (!isOpen) return null;

  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize draft patient state
  const [draft, setDraft] = useState<PatientRecord>(() => {
    if (patient) return JSON.parse(JSON.stringify(patient));

    const defaultDept: ClinicalDepartment = 'General Gynae';
    const seq = Math.floor(100 + Math.random() * 900);
    const identifiers = generateFullIntakeIdentifiers(seq, defaultDept);

    return {
      id: `p-${Date.now()}`,
      intakeRegistrationNo: identifiers.intakeRegistrationNo,
      clinicLocation: clinicBranch,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      clientName: '',
      age: 26,
      gender: 'Female',
      contactNo: '',
      presentAddress: '',
      paternalAddress: '',
      spouseOrParentName: '',
      fathersName: '',
      children: [],
      ageOfYoungestChild: '',
      religion: 'Hindu',
      caste: 'General',
      statusAPL_BPL: 'APL',
      familyIncome: '₹ 25,000 / month',
      educationalQualification: 'Senior Secondary',
      occupation: 'Homemaker',
      spouseOccupation: 'Private Job',
      maritalStatus: 'Married',
      ageAtMarriage: 22,
      addictions: [],

      primaryReferral: 'ASHA Worker',
      secondaryReferral: 'Word of Mouth / Relative',
      referralDetails: 'Community outreach program',

      ggNo: identifiers.ggNo,
      consultationReceiptNo: identifiers.consultationReceiptNo,
      activeDepartments: [defaultDept],

      vitals: {
        pulse: '76',
        bp: '120/80',
        temp: '98.4 F',
        weight: '55',
        height: '158',
        bmi: '22.0',
        spo2: '99',
        pallor: false,
        jaundice: false,
        oedemaFeet: false,
        lungs: 'Normal',
        heart: 'Normal',
        abdomen: 'Normal',
      },

      investigations: {
        hb: '12.0',
        bloodGroup: 'B',
        rhFactor: 'Positive',
        urineAlbumin: 'Absent',
        urineSugar: 'Absent',
        pregnancyTest: 'Not Done',
        hiv: 'Non-Reactive',
        vdrl: 'Non-Reactive',
        hbsag: 'Negative',
      },

      menstrualHistory: {
        cycleDays: '28-30',
        length: '4-5 Days',
        regularity: 'Regular',
        flow: 'Normal',
        lmp: new Date().toISOString().split('T')[0],
        amenorrheaDays: 'Nil',
        dysmenorrhea: false,
      },

      obstetricHistory: {
        gravida: '1',
        para: '1',
        abortions: '0',
        livingChildren: '1',
        lactating: false,
        amenorrheic: false,
        previousLscs: 'No',
        spontaneousAbortions: '0',
        inducedAbortions: '0',
      },

      medicalHistory: {
        'Recent Medical Illness': false,
        'Previous Surgery': false,
        'Allergies to Medication': false,
        'Bleeding Disorder': false,
        'Anemia': false,
        'Diabetes': false,
        'Hypertension': false,
        'Heart Disease': false,
        'RTI/STI/PID': false,
        'Convulsive Disorder': false,
        'Tuberculosis': false,
        'Malaria': false,
        'Asthma': false,
        'Renal Disease/ on Dialysis': false,
        'Mental Illness': false,
        'H/o Blood Transfusion': false,
      },

      sterilization: {
        isFreeScheme: false,
        clientConsentAgreed: true,
        spouseAware: true,
        eligibleCheckAge: true,
        eligibleCheckLivingChild: true,
        eligibleCheckHbNormal: true,
        surgeonOpinionEligible: true,
        procedureType: 'Minilap',
        methodOfOcclusion: 'Modified Pomeroy',
        localAnesthesiaUsed: 'Lignocaine 2% 10ml',
        postOpPassedUrine: true,
        postOpAbdominalDistension: false,
        dischargeInstructionsGiven: true,
      },

      medicalAbortion: {
        isHigherGestation: false,
        gestationWeeks: 6,
        form1RmpCertified: true,
        misoprostolRoute: 'Buccal',
        misoprostolLocation: 'Clinic',
        expulsionStatus: 'Pending',
        pocChecked: false,
        day3CheckInCall: { done: false, notes: '' },
        day4CheckInCall: { done: false, notes: '' },
        day15CompulsoryVisit: { done: false, usgCompleted: false },
      },

      infertility: {
        coupleMarriageDurationYears: '2 Years',
        cohabitationDuration: '2 Years',
        tryingToConceiveDuration: '1.5 Years',
        follicularMonitoring: [],
      },

      menopause: {
        scores: {
          hotFlushes: 0,
          heartDiscomfort: 0,
          sleepProblems: 0,
          depressiveMood: 0,
          irritability: 0,
          anxiety: 0,
          exhaustion: 0,
          sexualProblems: 0,
          bladderProblems: 0,
          drynessVagina: 0,
          jointDiscomfort: 0,
        },
        totalScore: 0,
        severityLabel: 'None',
      },

      surgical: {
        anesthesiaType: 'Local',
        anesthesiaDrugs: [],
        recoveryLevel: 'Fully Conscious',
        lamaSigned: false,
      },

      followUpVisits: [],

      provisionalDiagnosis: 'Clinical Examination & Consultation',
      investigationsAdvised: 'Routine Hemoglobin, Urine Albumin & Sugar',
      treatmentAdvised: 'Clinical assessment and symptomatic advice',
      adviceOnDischarge: 'Follow prescribed regimen. Return in 15 days or SOS.',

      signatures: {
        doctorName: 'Dr. Reena Sen, MS (Obst & Gynae)',
      },

      security: {
        encryptedAtRest: true,
        encryptionAlgorithm: 'AES-256-GCM',
        integrityHash: generateIntegrityHash('new', new Date().toISOString()),
        lastAuditClinician: 'Dr. Reena Sen',
        lastAuditTimestamp: new Date().toISOString(),
      },

      billingStatus: 'Paid',
      totalAmount: 500,
    };
  });

  // Current primary department for this intake sheet
  const selectedDepartment: ClinicalDepartment = draft.activeDepartments[0] || 'General Gynae';

  // Define the 5 sequential steps for the workflow
  const steps = [
    { id: 'profile', stepNum: 1, label: 'Demographics & Referral' },
    { id: 'history', stepNum: 2, label: 'Medical & Menstrual History' },
    { id: 'exam', stepNum: 3, label: 'Examination & Investigations' },
    { id: 'protocol', stepNum: 4, label: `${selectedDepartment.split('(')[0].trim()} Protocol` },
    { id: 'signatures', stepNum: 5, label: 'Consents, Signatures & Discharge' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = steps[currentStepIndex];

  // Change single primary department and re-generate department identifiers
  const handleSelectDepartment = (dept: ClinicalDepartment) => {
    const seq = Math.floor(100 + Math.random() * 900);
    const ids = generateFullIntakeIdentifiers(seq, dept);

    // Auto-adjust gender if male consultation
    const gender = dept === 'Male Consultation' ? 'Male' : (draft.gender === 'Male' && dept !== 'Sterilization (Minilap / Lap / NSV)' ? 'Female' : draft.gender);

    setDraft((prev) => ({
      ...prev,
      activeDepartments: [dept], // Only this single department intake sheet!
      gender,
      ggNo: ids.ggNo || prev.ggNo,
      gcNo: ids.gcNo,
      pncNo: ids.pncNo,
      steriRegisterNo: ids.steriRegisterNo,
      mtpAdmissionNo: ids.mtpAdmissionNo,
      maIntakeSheetNo: ids.maIntakeSheetNo,
      oaRegisterNo: ids.oaRegisterNo,
      infertilityNo: ids.infertilityNo,
      menopauseNo: ids.menopauseNo,
      rtiNo: ids.rtiNo,
      spNo: ids.spNo,
      mcNo: ids.mcNo,
      medicalAbortion: {
        ...prev.medicalAbortion,
        isHigherGestation: dept === 'Medicated Abortion (20-24 Wks Form E)',
        gestationWeeks: dept === 'Medicated Abortion (20-24 Wks Form E)' ? 21 : (prev.medicalAbortion?.gestationWeeks || 7),
        gestationTier: prev.medicalAbortion?.gestationTier || '6-8 weeks (≤63 Days - Early Medical / MVA)',
        procedureMethod: prev.medicalAbortion?.procedureMethod || 'Medical (Mifepristone + Misoprostol)',
        form1RmpCertified: true,
      } as any,
    }));
  };

  // Step Navigation Handlers with smooth scroll to top
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const jumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add / remove child
  const handleAddChild = () => {
    const newChild: ChildRecord = {
      id: `c-${Date.now()}`,
      name: '',
      age: '',
    };
    setDraft((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
    }));
  };

  const handleRemoveChild = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  // Follicular record add
  const handleAddFollicular = () => {
    const newEntry: FollicularRecord = {
      date: new Date().toISOString().split('T')[0],
      rightOvary: 'Dominant Follicle mm',
      leftOvary: '',
      endometrialThickness: 'mm',
      pouchOfDouglas: 'No fluid',
    };
    setDraft((prev) => ({
      ...prev,
      infertility: {
        ...prev.infertility,
        follicularMonitoring: [...(prev.infertility?.follicularMonitoring || []), newEntry],
      },
    }));
  };

  // Update Menopause MRS Score
  const handleScoreChange = (key: string, val: number) => {
    setDraft((prev) => {
      const currentScores = prev.menopause?.scores || {
        hotFlushes: 0,
        heartDiscomfort: 0,
        sleepProblems: 0,
        depressiveMood: 0,
        irritability: 0,
        anxiety: 0,
        exhaustion: 0,
        sexualProblems: 0,
        bladderProblems: 0,
        drynessVagina: 0,
        jointDiscomfort: 0,
      };
      const updatedScores = { ...currentScores, [key]: val };
      const { total, severity } = calculateMRSScore(updatedScores);
      return {
        ...prev,
        menopause: {
          ...prev.menopause,
          scores: updatedScores as any,
          totalScore: total,
          severityLabel: severity,
        },
      };
    });
  };

  // Auto-calculate EDD when LMP changes
  const handleLmpChange = (lmpVal: string) => {
    const { edd, gestationWeeks } = calculateEDD(lmpVal);
    setDraft((prev) => ({
      ...prev,
      menstrualHistory: {
        ...prev.menstrualHistory,
        lmp: lmpVal,
        edd: edd,
      },
      medicalAbortion: {
        ...prev.medicalAbortion,
        gestationWeeks: gestationWeeks > 0 ? gestationWeeks : prev.medicalAbortion?.gestationWeeks || 6,
        isHigherGestation: gestationWeeks >= 20,
      } as any,
    }));
  };

  // Save handler
  const handleSaveDraft = () => {
    const now = new Date().toISOString();
    const finalized: PatientRecord = {
      ...draft,
      updatedAt: now,
      security: {
        ...draft.security,
        lastAuditTimestamp: now,
        integrityHash: generateIntegrityHash(draft.id, now),
      },
    };
    onSave(finalized);
    onClose();
  };

  const currentDeptMeta = DEPARTMENT_OPTIONS.find((d) => d.id === selectedDepartment) || DEPARTMENT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Top Bar - Official Stree Clinic Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">Stree Clinic</span>
                <span className="text-[11px] text-rose-400 font-semibold">Parivar Seva Sanstha (Estd. 1978)</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {draft.intakeRegistrationNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {currentDeptMeta.sheetName} · Location: {draft.clinicLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(draft)}
              title="Print official case sheet"
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Department Selector Strip: Ensures ONLY ONE intake sheet is selected per intake! */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">
              Select Intake Sheet:
            </span>
            <select
              value={selectedDepartment}
              onChange={(e) => handleSelectDepartment(e.target.value as ClinicalDepartment)}
              className="bg-white border border-slate-300 text-slate-900 rounded-md px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-xs"
            >
              {DEPARTMENT_OPTIONS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.sheetName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-rose-700">
              {currentDeptMeta.badge}: {
                draft.steriRegisterNo || 
                draft.mtpAdmissionNo || 
                draft.infertilityNo || 
                draft.menopauseNo || 
                draft.gcNo || 
                draft.pncNo || 
                draft.spNo || 
                draft.mcNo || 
                draft.ggNo || 
                'AUTO-GENERATED'
              }
            </span>
          </div>
        </div>

        {/* Guided Step Progress Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            {steps.map((st, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => jumpToStep(idx)}
                  className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isPassed
                      ? 'text-emerald-700 hover:text-emerald-800'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold font-mono ${
                      isCurrent
                        ? 'bg-rose-600 text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? '✓' : st.stepNum}
                  </span>
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden md:block">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Scrollable Form Content Body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 bg-slate-50/40">
          
          {/* STEP 1: Demographics & Referral */}
          {currentStep.id === 'profile' && (
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              
              {/* SELECT INTAKE SHEET DETAILS (Requested by user) */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                      §
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Select Intake Sheet Details
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Select the primary clinical intake sheet for this patient registration
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded border border-rose-200">
                    Active: {currentDeptMeta.title}
                  </span>
                </div>

                {/* Intake Sheet Selection Pills / Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {DEPARTMENT_OPTIONS.map((dept) => {
                    const isSelected = selectedDepartment === dept.id;
                    const isMtp = dept.id === 'MTP Services (6-24 Weeks)';
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleSelectDepartment(dept.id)}
                        className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-rose-50 border-rose-600 text-rose-950 ring-1 ring-rose-500/30 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`font-semibold ${isSelected ? 'text-rose-700' : 'text-slate-800'}`}>
                            {dept.title}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </div>
                        {isMtp && (
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-600 text-white uppercase tracking-tight">
                            6 to 24 Wks Gestation
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {dept.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* If MTP Services is selected: Render the Gestation-Wise Service Tier Selector */}
                {(selectedDepartment === 'MTP Services (6-24 Weeks)' || 
                  selectedDepartment === 'Medical Abortion (Form C MTP)' || 
                  selectedDepartment === 'Medicated Abortion (20-24 Wks Form E)') && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-3.5 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-600" />
                        <h5 className="font-bold text-slate-800 text-xs">
                          MTP Services: Select Gestation-Wise Tier (6 to 24 Weeks)
                        </h5>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        MTP Act 2021 Statutory Flow
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {MTP_GESTATION_TIERS.map((tier) => {
                        const isCurrentTier = draft.medicalAbortion?.gestationTier === tier.tier;
                        return (
                          <button
                            key={tier.tier}
                            type="button"
                            onClick={() => {
                              const weeks = parseInt(tier.label.split('to')[0].trim()) || 7;
                              setDraft({
                                ...draft,
                                medicalAbortion: {
                                  ...draft.medicalAbortion!,
                                  gestationTier: tier.tier,
                                  gestationWeeks: weeks,
                                  isHigherGestation: tier.isHigherGestation,
                                  procedureMethod: tier.defaultMethod as any,
                                },
                              });
                            }}
                            className={`p-2.5 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                              isCurrentTier
                                ? 'bg-rose-50 border-rose-600 text-rose-950 font-semibold ring-1 ring-rose-500/30 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-slate-900">{tier.label}</span>
                              {isCurrentTier && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                              <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                tier.isHigherGestation
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {tier.statutoryReq}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 truncate">
                              Protocol: {tier.defaultMethod}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Statutory Notice */}
                    {draft.medicalAbortion?.isHigherGestation ? (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>20 to 24 Weeks Statutory Rule:</strong> Requires opinions of <strong>two Registered Medical Practitioners (RMPs)</strong> recorded under <strong>Form E</strong> for qualifying categories (survivors of sexual assault/rape, minors, change of marital status, disability, mental illness, or severe fetal malformation).
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Up to 20 Weeks Statutory Rule:</strong> Requires opinion of <strong>one Registered Medical Practitioner (RMP)</strong> recorded under <strong>Form 1</strong> (MTP Act 2021). Medical abortion protocol or MVA/EVA as per clinical assessment.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2 pt-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Step 1: Socio-Demographics & Referral Source (Page 1 of {currentDeptMeta.title})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Auto-generated unique intake number: <span className="font-mono font-bold text-slate-800">{draft.intakeRegistrationNo}</span>
                  </p>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                  {currentDeptMeta.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Name of the Client / Patient *</label>
                  <input
                    type="text"
                    value={draft.clientName}
                    onChange={(e) => setDraft({ ...draft, clientName: e.target.value })}
                    placeholder="e.g. Sunita Devi"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Age *</label>
                  <input
                    type="number"
                    value={draft.age}
                    onChange={(e) => setDraft({ ...draft, age: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Gender *</label>
                  <select
                    value={draft.gender}
                    onChange={(e) => setDraft({ ...draft, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Name of Husband / Wife / Guardian</label>
                  <input
                    type="text"
                    value={draft.spouseOrParentName}
                    onChange={(e) => setDraft({ ...draft, spouseOrParentName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Father's Name of Beneficiary</label>
                  <input
                    type="text"
                    value={draft.fathersName || ''}
                    onChange={(e) => setDraft({ ...draft, fathersName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Contact Mobile Number *</label>
                  <input
                    type="text"
                    value={draft.contactNo}
                    onChange={(e) => setDraft({ ...draft, contactNo: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Present Residential Address *</label>
                  <input
                    type="text"
                    value={draft.presentAddress}
                    onChange={(e) => setDraft({ ...draft, presentAddress: e.target.value })}
                    placeholder="Full residential address"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Paternal Home Address</label>
                  <input
                    type="text"
                    value={draft.paternalAddress || ''}
                    onChange={(e) => setDraft({ ...draft, paternalAddress: e.target.value })}
                    placeholder="Village / Town / District"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Religion / Nationality</label>
                  <input
                    type="text"
                    value={draft.religion}
                    onChange={(e) => setDraft({ ...draft, religion: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Caste Classification</label>
                  <select
                    value={draft.caste}
                    onChange={(e) => setDraft({ ...draft, caste: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Economic Status (APL / BPL) *</label>
                  <div className="flex gap-4 items-center mt-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={draft.statusAPL_BPL === 'APL'}
                        onChange={() => setDraft({ ...draft, statusAPL_BPL: 'APL' })}
                        name="apl_bpl_step"
                      />
                      <span>APL</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={draft.statusAPL_BPL === 'BPL'}
                        onChange={() => setDraft({ ...draft, statusAPL_BPL: 'BPL' })}
                        name="apl_bpl_step"
                      />
                      <span className="text-rose-700 font-bold">BPL (Eligible for Free Care Scheme)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Family Monthly Income</label>
                  <input
                    type="text"
                    value={draft.familyIncome || ''}
                    onChange={(e) => setDraft({ ...draft, familyIncome: e.target.value })}
                    placeholder="e.g. ₹ 15,000"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Educational Qualification</label>
                  <input
                    type="text"
                    value={draft.educationalQualification}
                    onChange={(e) => setDraft({ ...draft, educationalQualification: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Business / Occupation</label>
                  <input
                    type="text"
                    value={draft.occupation}
                    onChange={(e) => setDraft({ ...draft, occupation: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Children Table */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">
                    Living Unmarried Dependent Children (with Age)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Child
                  </button>
                </div>

                {draft.children.length === 0 ? (
                  <p className="text-slate-400 italic">No dependent children added. Click 'Add Child' to record.</p>
                ) : (
                  <div className="space-y-2">
                    {draft.children.map((child, idx) => (
                      <div key={child.id} className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 text-[11px] w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => {
                            const updated = [...draft.children];
                            updated[idx].name = e.target.value;
                            setDraft({ ...draft, children: updated });
                          }}
                          placeholder="Child Name"
                          className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={child.age}
                          onChange={(e) => {
                            const updated = [...draft.children];
                            updated[idx].age = e.target.value;
                            setDraft({ ...draft, children: updated });
                          }}
                          placeholder="Age (e.g. 3 Yrs)"
                          className="w-28 border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Source of Referral */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-2">
                  Source of Referral (Stree Clinic Official Tracking)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Primary Referral *</label>
                    <select
                      value={draft.primaryReferral}
                      onChange={(e) => setDraft({ ...draft, primaryReferral: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    >
                      <option value="ASHA Worker">ASHA Worker</option>
                      <option value="ANM">ANM</option>
                      <option value="Anganwadi">Anganwadi Worker</option>
                      <option value="Chemist / Pharmacist">Chemist / Pharmacist</option>
                      <option value="Doctor Referral">Doctor / Hospital Referral</option>
                      <option value="PSS Staff / Community Mobilizer">PSS Staff / SMR / CSMP</option>
                      <option value="Website / Social Media">Website / Digital / WhatsApp</option>
                      <option value="Word of Mouth (Friends/Neighbour)">Word of Mouth / Revisit</option>
                      <option value="Outdoor (Banners / Glow Sign)">Outdoor (Banners / Glow Sign)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Secondary Referral (if any)</label>
                    <input
                      type="text"
                      value={draft.secondaryReferral || ''}
                      onChange={(e) => setDraft({ ...draft, secondaryReferral: e.target.value })}
                      placeholder="e.g. Revisit / Clinic Camp"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Referral Worker Details</label>
                    <input
                      type="text"
                      value={draft.referralDetails || ''}
                      onChange={(e) => setDraft({ ...draft, referralDetails: e.target.value })}
                      placeholder="Name, Center or Mobile"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Medical & Menstrual History */}
          {currentStep.id === 'history' && (
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 2: Clinical Medical History, Menstrual & Obstetric Records
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Patient: {draft.clientName || 'Beneficiary'}
                </span>
              </div>

              {/* Menstrual History Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="font-semibold block mb-1">LMP (Last Menstrual Period) *</label>
                  <input
                    type="date"
                    value={draft.menstrualHistory.lmp || ''}
                    onChange={(e) => handleLmpChange(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Calculated EDD (if pregnant)</label>
                  <input
                    type="text"
                    readOnly
                    value={draft.menstrualHistory.edd || 'N/A'}
                    className="w-full border border-slate-200 rounded px-2 py-1.5 text-xs bg-slate-100 font-mono text-slate-600"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Cycle Regularity</label>
                  <select
                    value={draft.menstrualHistory.regularity || 'Regular'}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        menstrualHistory: { ...draft.menstrualHistory, regularity: e.target.value as any },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Bleeding Flow</label>
                  <select
                    value={draft.menstrualHistory.flow || 'Normal'}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        menstrualHistory: { ...draft.menstrualHistory, flow: e.target.value as any },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white"
                  >
                    <option value="Scanty">Scanty</option>
                    <option value="Normal">Normal</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>

              {/* Obstetric History Grid */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Obstetric History (G / P / A / L)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Gravida (G)</label>
                    <input
                      type="text"
                      value={draft.obstetricHistory.gravida || ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          obstetricHistory: { ...draft.obstetricHistory, gravida: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Para (P)</label>
                    <input
                      type="text"
                      value={draft.obstetricHistory.para || ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          obstetricHistory: { ...draft.obstetricHistory, para: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Abortions (A)</label>
                    <input
                      type="text"
                      value={draft.obstetricHistory.abortions || ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          obstetricHistory: { ...draft.obstetricHistory, abortions: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Living Children</label>
                    <input
                      type="text"
                      value={draft.obstetricHistory.livingChildren || ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          obstetricHistory: { ...draft.obstetricHistory, livingChildren: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Previous LSCS</label>
                    <select
                      value={draft.obstetricHistory.previousLscs}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          obstetricHistory: { ...draft.obstetricHistory, previousLscs: e.target.value as any },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="No">No</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 30+ Medical History Checklist */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-2">
                  Systemic Medical History Checklist (Yes / No)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.keys(draft.medicalHistory).map((disease) => (
                    <label
                      key={disease}
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                        draft.medicalHistory[disease]
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{disease}</span>
                      <input
                        type="checkbox"
                        checked={draft.medicalHistory[disease]}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            medicalHistory: {
                              ...draft.medicalHistory,
                              [disease]: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="font-semibold block mb-1">Specific Clinical Details / Notes</label>
                  <textarea
                    rows={2}
                    value={draft.medicalHistoryDetails || ''}
                    onChange={(e) => setDraft({ ...draft, medicalHistoryDetails: e.target.value })}
                    placeholder="Enter details if any condition was marked Yes above..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Examination & Vitals */}
          {currentStep.id === 'exam' && (
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 3: Physical Examination, Vitals & Lab Investigations
                </h3>
                <span className="text-xs text-slate-500">
                  Standardized Clinical Triage
                </span>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Pulse (/min)</label>
                  <input
                    type="text"
                    value={draft.vitals.pulse}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, pulse: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">BP (mm of Hg)</label>
                  <input
                    type="text"
                    value={draft.vitals.bp}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, bp: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Body Temp</label>
                  <input
                    type="text"
                    value={draft.vitals.temp}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, temp: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Weight (kg)</label>
                  <input
                    type="text"
                    value={draft.vitals.weight}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, weight: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Height (cm)</label>
                  <input
                    type="text"
                    value={draft.vitals.height || ''}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, height: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">SPO2 (%)</label>
                  <input
                    type="text"
                    value={draft.vitals.spo2 || ''}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, spo2: e.target.value } })}
                    className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                  />
                </div>
              </div>

              {/* Physical Examination Signs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2 border border-slate-200 rounded">
                  <input
                    type="checkbox"
                    checked={draft.vitals.pallor}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, pallor: e.target.checked } })}
                  />
                  <span>Pallor (Anemia)</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-slate-200 rounded">
                  <input
                    type="checkbox"
                    checked={draft.vitals.jaundice}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, jaundice: e.target.checked } })}
                  />
                  <span>Jaundice</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-slate-200 rounded">
                  <input
                    type="checkbox"
                    checked={draft.vitals.oedemaFeet}
                    onChange={(e) => setDraft({ ...draft, vitals: { ...draft.vitals, oedemaFeet: e.target.checked } })}
                  />
                  <span>Oedema Feet</span>
                </label>
              </div>

              {/* Lab Investigations Grid */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-2">Mandatory Laboratory Investigations</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Hemoglobin (g/dL) *</label>
                    <input
                      type="text"
                      value={draft.investigations.hb}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          investigations: { ...draft.investigations, hb: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Blood Group & Rh *</label>
                    <div className="flex gap-1">
                      <select
                        value={draft.investigations.bloodGroup}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            investigations: { ...draft.investigations, bloodGroup: e.target.value },
                          })
                        }
                        className="w-20 border border-slate-300 rounded px-2 py-1"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                      <select
                        value={draft.investigations.rhFactor}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            investigations: { ...draft.investigations, rhFactor: e.target.value as any },
                          })
                        }
                        className="flex-1 border border-slate-300 rounded px-2 py-1"
                      >
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Urine Albumin</label>
                    <select
                      value={draft.investigations.urineAlbumin}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          investigations: { ...draft.investigations, urineAlbumin: e.target.value as any },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="Absent">Absent</option>
                      <option value="Present">Present</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Urine Pregnancy Test (UPT)</label>
                    <select
                      value={draft.investigations.pregnancyTest}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          investigations: { ...draft.investigations, pregnancyTest: e.target.value as any },
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="Negative">Negative</option>
                      <option value="Positive">Positive</option>
                      <option value="Not Done">Not Done</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="font-semibold block mb-1">Ultrasound (USG / TVS) Findings</label>
                  <textarea
                    rows={2}
                    value={draft.investigations.usgReport || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        investigations: { ...draft.investigations, usgReport: e.target.value },
                      })
                    }
                    placeholder="Gestational sac, CRL, ectopic ruled out, ovarian morphology..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Department-Specific Sheet (Tailored specifically for the selected sheet!) */}
          {currentStep.id === 'protocol' && (
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Step 4: {currentDeptMeta.sheetName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Department-specific intake criteria, surgical approach & statutory clinical protocols
                  </p>
                </div>
                <div className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded">
                  {currentDeptMeta.badge}: {
                    draft.steriRegisterNo || 
                    draft.mtpAdmissionNo || 
                    draft.infertilityNo || 
                    draft.menopauseNo || 
                    draft.gcNo || 
                    draft.pncNo || 
                    draft.spNo || 
                    draft.mcNo || 
                    draft.ggNo || 
                    'AUTO'
                  }
                </div>
              </div>

              {/* Protocol 1: Sterilization Procedure */}
              {selectedDepartment === 'Sterilization (Minilap / Lap / NSV)' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                      Sterilization Eligibility Checklist (Filled by Operating Surgeon)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Client is within eligible age (Female 22-49 Yrs / Male 22-60 Yrs)</span>
                        <input
                          type="checkbox"
                          checked={draft.sterilization?.eligibleCheckAge ?? true}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              sterilization: { ...draft.sterilization!, eligibleCheckAge: e.target.checked },
                            })
                          }
                          className="rounded text-rose-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Client has at least 1 living child over 1 year of age</span>
                        <input
                          type="checkbox"
                          checked={draft.sterilization?.eligibleCheckLivingChild ?? true}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              sterilization: { ...draft.sterilization!, eligibleCheckLivingChild: e.target.checked },
                            })
                          }
                          className="rounded text-rose-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Lab Investigations (Hb ≥ 7.0 g/dL, Urine) normal</span>
                        <input
                          type="checkbox"
                          checked={draft.sterilization?.eligibleCheckHbNormal ?? true}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              sterilization: { ...draft.sterilization!, eligibleCheckHbNormal: e.target.checked },
                            })
                          }
                          className="rounded text-rose-600"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Free FPIS Scheme Beneficiary (Family Planning Indemnity)</span>
                        <input
                          type="checkbox"
                          checked={draft.sterilization?.isFreeScheme ?? false}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              sterilization: { ...draft.sterilization!, isFreeScheme: e.target.checked },
                            })
                          }
                          className="rounded text-rose-600"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Technique *</label>
                      <select
                        value={draft.sterilization?.procedureType || 'Minilap'}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            sterilization: { ...draft.sterilization!, procedureType: e.target.value as any },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      >
                        <option value="Minilap">Minilap Tubectomy (Female)</option>
                        <option value="Laparoscopy Tubal Occlusion">Laparoscopy Tubal Occlusion (Female)</option>
                        <option value="NSV">No-Scalpel Vasectomy - NSV (Male)</option>
                        <option value="Conventional Vasectomy">Conventional Vasectomy (Male)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Method of Occlusion</label>
                      <select
                        value={draft.sterilization?.methodOfOcclusion || 'Modified Pomeroy'}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            sterilization: { ...draft.sterilization!, methodOfOcclusion: e.target.value as any },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      >
                        <option value="Modified Pomeroy">Modified Pomeroy (Minilap)</option>
                        <option value="Fallope Ring">Fallope Ring (Laparoscopy)</option>
                        <option value="Hulka Clip">Hulka Clip (Laparoscopy)</option>
                        <option value="2-0 Silk Ligature">2-0 Silk Ligature (Vasectomy)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Local Anesthesia</label>
                      <input
                        type="text"
                        value={draft.sterilization?.localAnesthesiaUsed || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            sterilization: { ...draft.sterilization!, localAnesthesiaUsed: e.target.value },
                          })
                        }
                        placeholder="e.g. Lignocaine 2% 10ml"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol: MTP Services (6 to 24 Weeks - Gestation-Wise Form C, Form 1 & Form E) */}
              {(selectedDepartment === 'MTP Services (6-24 Weeks)' || 
                selectedDepartment === 'Medical Abortion (Form C MTP)' || 
                selectedDepartment === 'Medicated Abortion (20-24 Wks Form E)') && (
                <div className="space-y-4">
                  {/* Gestation Tier & Statutory Requirement Header */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {draft.medicalAbortion?.gestationTier || '6-8 weeks (≤63 Days - Early Medical / MVA)'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            draft.medicalAbortion?.isHigherGestation 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {draft.medicalAbortion?.isHigherGestation ? '2-RMP Form E Mandate' : '1-RMP Form 1'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          MTP Act 2021 Compliant Protocol · Parivar Seva Sanstha Standards
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-slate-700">Gestation (Weeks):</label>
                        <input
                          type="number"
                          min="4"
                          max="24"
                          value={draft.medicalAbortion?.gestationWeeks || 7}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 7;
                            setDraft({
                              ...draft,
                              medicalAbortion: {
                                ...draft.medicalAbortion!,
                                gestationWeeks: val,
                                isHigherGestation: val > 20,
                              },
                            });
                          }}
                          className="w-16 border border-slate-300 rounded px-2 py-1 bg-white font-mono text-center font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Method of Procedure */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">Clinical Procedure Method</label>
                        <select
                          value={draft.medicalAbortion?.procedureMethod || 'Medical (Mifepristone + Misoprostol)'}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              medicalAbortion: { ...draft.medicalAbortion!, procedureMethod: e.target.value },
                            })
                          }
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                        >
                          <option value="Medical (Mifepristone + Misoprostol)">Medical Abortion (Mifepristone 200mg + Misoprostol 800mcg)</option>
                          <option value="MVA (Manual Vacuum Aspiration)">MVA (Manual Vacuum Aspiration with Karman Cannula 6-8mm)</option>
                          <option value="EVA (Electric Vacuum Aspiration)">EVA (Electric Vacuum Aspiration)</option>
                          <option value="D&E (Dilatation & Evacuation)">D&E (Dilatation & Evacuation)</option>
                          <option value="Foley Catheter + Serial Misoprostol">Foley Catheter Cervical Priming + Serial Misoprostol</option>
                          <option value="Surgical Curettage">Surgical Evacuation & Curettage</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">Cervical Priming (If applicable)</label>
                        <input
                          type="text"
                          value={draft.medicalAbortion?.cervicalPrimingMethod || ''}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              medicalAbortion: { ...draft.medicalAbortion!, cervicalPrimingMethod: e.target.value },
                            })
                          }
                          placeholder="e.g. Tab Misoprostol 400mcg 3h pre-op OR Foley bulb #16"
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statutory Form E for 20-24 Weeks (2 RMPs) */}
                  {draft.medicalAbortion?.isHigherGestation ? (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-rose-200/80 pb-2">
                        <h4 className="font-bold text-rose-900 text-xs">
                          FORM E: Statutory Opinion of Two Registered Medical Practitioners (20 to 24 Weeks)
                        </h4>
                        <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                          Section 3(2)(b) MTP Act 2021
                        </span>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-rose-950">
                          Statutory Qualifying Circumstance (Mandated by MTP Rules 2021) *
                        </label>
                        <select
                          value={draft.medicalAbortion?.formECircumstance || 'a) Survivor of sexual assault or rape or incest'}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              medicalAbortion: { ...draft.medicalAbortion!, formECircumstance: e.target.value },
                            })
                          }
                          className="w-full border border-rose-300 bg-white rounded px-2.5 py-1.5 text-xs text-rose-950 font-medium"
                        >
                          <option value="a) Survivor of sexual assault or rape or incest">a) Survivor of sexual assault or rape or incest</option>
                          <option value="b) Minor (Under 18 Years)">b) Minor (Under 18 Years of Age)</option>
                          <option value="c) Change of marital status during ongoing pregnancy (widowhood/divorce)">c) Change of marital status during pregnancy (widowhood / divorce)</option>
                          <option value="d) Woman with physical disabilities (Rights of Persons with Disabilities Act)">d) Woman with major physical disabilities</option>
                          <option value="e) Mentally ill woman including mental retardation">e) Mentally ill woman including mental retardation</option>
                          <option value="f) Foetal malformation with substantial risk of serious handicap">f) Foetal malformation with substantial risk of serious handicap</option>
                          <option value="g) Woman in humanitarian settings or disaster situation declared by Govt">g) Humanitarian settings or disaster situation</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1 text-slate-800">RMP 1 (Operating Gynecologist Name & Reg #)</label>
                          <input
                            type="text"
                            value={draft.signatures.doctorName || ''}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                signatures: { ...draft.signatures, doctorName: e.target.value },
                              })
                            }
                            className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-slate-800">RMP 2 (Second Medical Practitioner Name & Reg #)</label>
                          <input
                            type="text"
                            value={draft.medicalAbortion?.formERmp2Name || ''}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                medicalAbortion: { ...draft.medicalAbortion!, formERmp2Name: e.target.value },
                              })
                            }
                            placeholder="e.g. Dr. K. Mathur, MD (Reg #DMC-39120)"
                            className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Form 1 Certification for <=20 Weeks */
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-emerald-950 text-xs">
                            FORM 1: Statutory Certification of One RMP (≤20 Weeks)
                          </div>
                          <div className="text-[11px] text-emerald-800">
                            RMP Certified: {draft.signatures.doctorName || 'Authorized Medical Officer'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded">
                        Form 1 Approved
                      </span>
                    </div>
                  )}

                  {/* Stage 1 & Stage 2 Execution Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-200 p-3.5 rounded-lg bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Stage 1: Tab Mifepristone 200mg</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-slate-600 block mb-1">Date & Time Administered</label>
                          <input
                            type="date"
                            value={draft.medicalAbortion?.mifepristoneDate || ''}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                medicalAbortion: { ...draft.medicalAbortion!, mifepristoneDate: e.target.value },
                              })
                            }
                            className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 block mb-1">Administered By (Doctor / Nurse)</label>
                          <input
                            type="text"
                            value={draft.medicalAbortion?.mifepristoneGivenBy || ''}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                medicalAbortion: { ...draft.medicalAbortion!, mifepristoneGivenBy: e.target.value },
                              })
                            }
                            placeholder="e.g. Dr. Reena Sen (Clinic)"
                            className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 p-3.5 rounded-lg bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Stage 2: Tab Misoprostol 800mcg (4 tabs)</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-slate-600 block mb-1">Route & Location</label>
                          <div className="flex gap-2">
                            <select
                              value={draft.medicalAbortion?.misoprostolRoute || 'Buccal'}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  medicalAbortion: { ...draft.medicalAbortion!, misoprostolRoute: e.target.value as any },
                                })
                              }
                              className="w-1/2 border border-slate-300 rounded px-2 py-1 bg-white"
                            >
                              <option value="Buccal">Buccal</option>
                              <option value="Oral">Oral</option>
                              <option value="Sublingual">Sublingual</option>
                              <option value="Vaginal">Vaginal</option>
                            </select>
                            <select
                              value={draft.medicalAbortion?.misoprostolLocation || 'Clinic'}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  medicalAbortion: { ...draft.medicalAbortion!, misoprostolLocation: e.target.value as any },
                                })
                              }
                              className="w-1/2 border border-slate-300 rounded px-2 py-1 bg-white"
                            >
                              <option value="Clinic">Clinic Intake</option>
                              <option value="Home">Home Intake</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-600 block mb-1">Date for Misoprostol</label>
                          <input
                            type="date"
                            value={draft.medicalAbortion?.misoprostolDate || ''}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                medicalAbortion: { ...draft.medicalAbortion!, misoprostolDate: e.target.value },
                              })
                            }
                            className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expulsion Verification & Post-Op Recovery */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-slate-200 p-3.5 rounded-lg bg-slate-50">
                    <div>
                      <label className="font-semibold block mb-1 text-slate-800">POC Expulsion Status</label>
                      <select
                        value={draft.medicalAbortion?.expulsionStatus || 'Complete'}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            medicalAbortion: { ...draft.medicalAbortion!, expulsionStatus: e.target.value as any },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                      >
                        <option value="Complete">Complete (Gestational Sac Expelled)</option>
                        <option value="Spontaneous">Spontaneous Expulsion</option>
                        <option value="D&E Required">Incomplete (D&E / MVA Required)</option>
                        <option value="Pending">Pending Expulsion</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-slate-800">Post-Op Observation (Hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={draft.medicalAbortion?.postProcedureObsHours || 4}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            medicalAbortion: { ...draft.medicalAbortion!, postProcedureObsHours: parseInt(e.target.value) || 4 },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-slate-800">Post-Abortion Contraception Given</label>
                      <select
                        value={draft.medicalAbortion?.contraceptionGiven || 'PPIUCD (Cu-T 380A)'}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            medicalAbortion: { ...draft.medicalAbortion!, contraceptionGiven: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                      >
                        <option value="PPIUCD (Cu-T 380A)">PPIUCD (Cu-T 380A Inserted)</option>
                        <option value="Oral Contraceptive Pills (Mala-N / Saheli)">Oral Contraceptive Pills (Mala-N / Saheli)</option>
                        <option value="Injectable DMPA (Antara)">Injectable DMPA (Antara 150mg)</option>
                        <option value="Male Condoms (Nirodh)">Condoms (Nirodh)</option>
                        <option value="Female Sterilization (Minilap)">Concurrent Sterilization (Minilap)</option>
                        <option value="Refused / Declined">Refused Contraception</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                    <strong>Mandated Follow-Up Surveillance:</strong> Clinic team will call client on Day 3 (at 4:00 PM) for Misoprostol intake verification and Day 4 (at 2:00 PM) for POC expulsion check. Compulsory Day 15 clinic visit with pelvic ultrasound scheduled.
                  </div>
                </div>
              )}

              {/* Protocol 4: Infertility Consultation */}
              {selectedDepartment === 'Infertility Consultation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Duration of Marriage</label>
                      <input
                        type="text"
                        value={draft.infertility?.coupleMarriageDurationYears || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            infertility: { ...draft.infertility!, coupleMarriageDurationYears: e.target.value },
                          })
                        }
                        placeholder="e.g. 3 Years"
                        className="w-full border border-slate-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Duration of Cohabitation</label>
                      <input
                        type="text"
                        value={draft.infertility?.cohabitationDuration || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            infertility: { ...draft.infertility!, cohabitationDuration: e.target.value },
                          })
                        }
                        placeholder="e.g. 3 Years"
                        className="w-full border border-slate-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Trying to Conceive</label>
                      <input
                        type="text"
                        value={draft.infertility?.tryingToConceiveDuration || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            infertility: { ...draft.infertility!, tryingToConceiveDuration: e.target.value },
                          })
                        }
                        placeholder="e.g. 2 Years"
                        className="w-full border border-slate-300 rounded px-2 py-1.5"
                      />
                    </div>
                  </div>

                  {/* Follicular Monitoring Chart Table */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-800">Follicular Monitoring Chart</h4>
                      <button
                        type="button"
                        onClick={handleAddFollicular}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Scan Date
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded">
                        <thead className="bg-slate-100 text-slate-700 font-semibold">
                          <tr>
                            <th className="p-2 border">Date / Cycle Day</th>
                            <th className="p-2 border">Right Ovary</th>
                            <th className="p-2 border">Left Ovary</th>
                            <th className="p-2 border">Endometrial Thickness</th>
                            <th className="p-2 border">Pouch of Douglas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(draft.infertility?.follicularMonitoring || []).map((foll, idx) => (
                            <tr key={idx}>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={foll.date}
                                  onChange={(e) => {
                                    const list = [...(draft.infertility?.follicularMonitoring || [])];
                                    list[idx].date = e.target.value;
                                    setDraft({
                                      ...draft,
                                      infertility: { ...draft.infertility!, follicularMonitoring: list },
                                    });
                                  }}
                                  className="w-full px-1 py-0.5 border-0 focus:ring-1 focus:ring-rose-500 rounded"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={foll.rightOvary}
                                  onChange={(e) => {
                                    const list = [...(draft.infertility?.follicularMonitoring || [])];
                                    list[idx].rightOvary = e.target.value;
                                    setDraft({
                                      ...draft,
                                      infertility: { ...draft.infertility!, follicularMonitoring: list },
                                    });
                                  }}
                                  className="w-full px-1 py-0.5 border-0"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={foll.leftOvary}
                                  onChange={(e) => {
                                    const list = [...(draft.infertility?.follicularMonitoring || [])];
                                    list[idx].leftOvary = e.target.value;
                                    setDraft({
                                      ...draft,
                                      infertility: { ...draft.infertility!, follicularMonitoring: list },
                                    });
                                  }}
                                  className="w-full px-1 py-0.5 border-0"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={foll.endometrialThickness}
                                  onChange={(e) => {
                                    const list = [...(draft.infertility?.follicularMonitoring || [])];
                                    list[idx].endometrialThickness = e.target.value;
                                    setDraft({
                                      ...draft,
                                      infertility: { ...draft.infertility!, follicularMonitoring: list },
                                    });
                                  }}
                                  className="w-full px-1 py-0.5 border-0"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={foll.pouchOfDouglas}
                                  onChange={(e) => {
                                    const list = [...(draft.infertility?.follicularMonitoring || [])];
                                    list[idx].pouchOfDouglas = e.target.value;
                                    setDraft({
                                      ...draft,
                                      infertility: { ...draft.infertility!, follicularMonitoring: list },
                                    });
                                  }}
                                  className="w-full px-1 py-0.5 border-0"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 5: Menopause MRS Score */}
              {selectedDepartment === 'Peri-Menopause & Menopause' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">Menopause Rating Scale (MRS) Total Score:</span>
                      <p className="text-[11px] text-slate-500">Sum of 11 somatic, psychological & urogenital items (0 to 4)</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-rose-700 font-mono">
                        {draft.menopause?.totalScore || 0} / 44
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                        {draft.menopause?.severityLabel || 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-2 flex items-center justify-between font-semibold text-slate-700">
                      <span>MRS Symptoms</span>
                      <div className="flex gap-4 font-mono text-[10px]">
                        <span className="w-8 text-center">None(0)</span>
                        <span className="w-8 text-center">Mild(1)</span>
                        <span className="w-8 text-center">Mod(2)</span>
                        <span className="w-8 text-center">Sev(3)</span>
                        <span className="w-8 text-center">V.Sev(4)</span>
                      </div>
                    </div>

                    {[
                      { key: 'hotFlushes', label: '1. Hot flushes & episodes of sweating' },
                      { key: 'heartDiscomfort', label: '2. Heart discomfort (rapid pulse, racing)' },
                      { key: 'sleepProblems', label: '3. Sleep problems (difficulty falling asleep)' },
                      { key: 'depressiveMood', label: '4. Depressive mood (feeling down, sad)' },
                      { key: 'irritability', label: '5. Irritability & inner tension' },
                      { key: 'anxiety', label: '6. Anxiety (inner restlessness, feeling panicky)' },
                      { key: 'exhaustion', label: '7. Physical & mental exhaustion' },
                      { key: 'sexualProblems', label: '8. Sexual problems & altered desire' },
                      { key: 'bladderProblems', label: '9. Bladder urgency & difficulty urinating' },
                      { key: 'drynessVagina', label: '10. Vaginal dryness & burning' },
                      { key: 'jointDiscomfort', label: '11. Joint & muscular discomfort' },
                    ].map((symptom) => {
                      const currentVal = (draft.menopause?.scores as any)?.[symptom.key] || 0;
                      return (
                        <div key={symptom.key} className="px-3 py-2 flex items-center justify-between hover:bg-slate-50">
                          <span className="text-slate-800">{symptom.label}</span>
                          <div className="flex gap-4">
                            {[0, 1, 2, 3, 4].map((score) => (
                              <label key={score} className="w-8 flex items-center justify-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`mrs-step-${symptom.key}`}
                                  checked={currentVal === score}
                                  onChange={() => handleScoreChange(symptom.key, score)}
                                  className="text-rose-600 focus:ring-rose-500"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Protocol 6: Surgical Procedures */}
              {selectedDepartment === 'Surgical Procedures' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Female Surgical Procedure (if applicable)</label>
                      <select
                        value={draft.surgical?.femaleSurgeryType || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            surgical: { ...draft.surgical!, femaleSurgeryType: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      >
                        <option value="">None</option>
                        <option value="Cryocautery">Cryocautery</option>
                        <option value="Vaginal Pessary in Uterine Prolapse">Vaginal Pessary in Uterine Prolapse</option>
                        <option value="Hydrotubation">Hydrotubation</option>
                        <option value="Diagnostic Lapro & Chromotubation">Diagnostic Lapro & Chromotubation</option>
                        <option value="Excision of Fibroadenoma Breast">Excision of Fibroadenoma Breast</option>
                        <option value="Repair of Vaginal Introitus under LA">Repair of Vaginal Introitus under LA</option>
                        <option value="D&C for Gynae Problems">D&C for Gynae Problems</option>
                        <option value="Perineorrhaphy & Perineoplasty">Perineorrhaphy & Perineoplasty</option>
                        <option value="Excision of Cervical Polyp / Cyst">Excision of Cervical Polyp / Cyst / Warts</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Male Surgical Procedure (if applicable)</label>
                      <select
                        value={draft.surgical?.maleSurgeryType || ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            surgical: { ...draft.surgical!, maleSurgeryType: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      >
                        <option value="">None</option>
                        <option value="No-Scalpel Vasectomy (NSV)">No-Scalpel Vasectomy (NSV)</option>
                        <option value="Circumcision">Circumcision</option>
                        <option value="Hernia Repair">Hernia Repair</option>
                        <option value="Hydrocele Repair">Hydrocele Repair</option>
                        <option value="Testicular Biopsy">Testicular Biopsy</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 7: Antenatal Care (ANC) */}
              {selectedDepartment === 'Antenatal Care (ANC)' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Period of Gestation (Weeks)</label>
                      <input
                        type="text"
                        value={draft.menstrualHistory.edd ? `${draft.medicalAbortion?.gestationWeeks || 18} Weeks` : '18 Weeks'}
                        readOnly
                        className="w-full border border-slate-200 bg-slate-100 rounded px-2 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Expected Delivery Date (EDD)</label>
                      <input
                        type="text"
                        value={draft.menstrualHistory.edd || 'Calculated from LMP'}
                        readOnly
                        className="w-full border border-slate-200 bg-slate-100 rounded px-2 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Tetanus Toxoid (TT) 1st Dose</label>
                      <input
                        type="date"
                        defaultValue="2026-09-10"
                        className="w-full border border-slate-300 rounded px-2 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 8: RTI/STI Dual Checklist */}
              {selectedDepartment === 'RTI / STI Consultation' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500">
                    Dual-column screening checklist matching Stree Clinic RTI/STI consultation form:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded p-3 bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Female Presentation</h4>
                      <div className="space-y-1 text-[11px]">
                        {['Vaginal discharge', 'Genital ulceration', 'Lower abdominal pain', 'Vulva itching', 'Dyspareunia'].map((sym) => (
                          <label key={sym} className="flex items-center justify-between p-1 bg-white rounded border">
                            <span>{sym}</span>
                            <input type="checkbox" className="rounded text-rose-600" />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded p-3 bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Male Presentation</h4>
                      <div className="space-y-1 text-[11px]">
                        {['Urethral discharge', 'Genital ulceration', 'Acute scrotal pain', 'Balanitis', 'Pharyngitis'].map((sym) => (
                          <label key={sym} className="flex items-center justify-between p-1 bg-white rounded border">
                            <span>{sym}</span>
                            <input type="checkbox" className="rounded text-rose-600" />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 9: General Gynaecology Consultation */}
              {selectedDepartment === 'General Gynae' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-200 p-3 rounded bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Gynecological Infections</h4>
                      <div className="space-y-1">
                        {['Itching Problems', 'Leucorrhea / White Discharge', 'Ulcers / Lesions', 'UTI - Burning Micturition', 'Genital Warts'].map((item) => (
                          <label key={item} className="flex items-center justify-between p-1 bg-white rounded border">
                            <span>{item}</span>
                            <input type="checkbox" className="rounded text-rose-600" />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border border-slate-200 p-3 rounded bg-slate-50">
                      <h4 className="font-bold text-slate-800 mb-2">Menstrual Issues</h4>
                      <div className="space-y-1">
                        {['Menorrhagia (AUB / DUB)', 'Primary Amenorrhea', 'Secondary Amenorrhea', 'Dysmenorrhea (Endometriosis)', 'PCOD / PCOS'].map((item) => (
                          <label key={item} className="flex items-center justify-between p-1 bg-white rounded border">
                            <span>{item}</span>
                            <input type="checkbox" className="rounded text-rose-600" />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 10: Male Consultation */}
              {selectedDepartment === 'Male Consultation' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-3">
                    <h4 className="font-bold text-slate-800">Local Genital Examination</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Penis & Prepuce</label>
                        <select className="w-full border border-slate-300 rounded px-2 py-1 bg-white">
                          <option>Normal (No phimosis, No ulcer)</option>
                          <option>Phimosis Present</option>
                          <option>Ulcer / Balanitis</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Testes & Epididymis</label>
                        <select className="w-full border border-slate-300 rounded px-2 py-1 bg-white">
                          <option>Normal Bilateral (Normal Firm Consistency)</option>
                          <option>Hydrocele</option>
                          <option>Varicocele</option>
                          <option>Epididymoorchitis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 11: Postnatal Care (PNC) */}
              {selectedDepartment === 'Postnatal Care (PNC)' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-3">
                    <h4 className="font-bold text-slate-800">BUBBLE Postnatal Examination</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Breast (Lactation)</label>
                        <input type="text" defaultValue="Soft, Lactating well" className="w-full border border-slate-300 rounded px-2 py-1 bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Uterus (Involution)</label>
                        <input type="text" defaultValue="Well contracted" className="w-full border border-slate-300 rounded px-2 py-1 bg-white" />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Lochia</label>
                        <input type="text" defaultValue="Lochia Serosa, normal" className="w-full border border-slate-300 rounded px-2 py-1 bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocol 12: Other Abortions (OA) */}
              {selectedDepartment === 'Other Abortions (OA)' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-900 leading-relaxed">
                    <strong>Interfered / Incomplete Abortion Record:</strong> Client counselled regarding complete evacuation of retained products of conception (RPOC). Manual Vacuum Aspiration (MVA) / Electrical Vacuum Aspiration (EVA) or medical management.
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 5: Consents, Signatures & Discharge */}
          {currentStep.id === 'signatures' && (
            <div className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Step 5: Informed Consents, Digital Signatures & Discharge Advice
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Legally binding medical authorization with AES-256-GCM encryption seal
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HIPAA Tamper-Evident</span>
                </div>
              </div>

              {/* Legal Informed Consent Text Box */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[11px] text-slate-600 leading-relaxed space-y-1">
                <p className="font-bold text-slate-800">
                  Informed Consent & Undertaking (As per Stree Clinic Form):
                </p>
                <p>
                  "I hereby confirm that the information on general issues and clinical history are correct. I have made an informed choice of procedure and understand all inherent elements of risk. I agree to come for follow-up visits to the Clinic as instructed."
                </p>
                <p className="text-slate-700 font-hindi">
                  "मैंने ऊपर दी गई जानकारी पढ़ ली है या मुझे मेरी अपनी भाषा में समझा दी गई है और मैं समझती हूँ कि यह फॉर्म एक कानूनी दस्तावेज़ का अधिकार रखता है।"
                </p>
              </div>

              {/* Dual Digital Signature Canvases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <SignatureCanvas
                    label="Signature / Thumb Impression of Client / Acceptor *"
                    sublabel="Voluntary signed consent of client or guardian"
                    signerName={draft.clientName}
                    existingSignature={draft.signatures.clientSignatureUrl}
                    onSave={(dataUrl) =>
                      setDraft({
                        ...draft,
                        signatures: {
                          ...draft.signatures,
                          clientSignatureUrl: dataUrl,
                          clientSignDate: new Date().toISOString(),
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <SignatureCanvas
                    label="Signature & Name of Operating Doctor / Surgeon *"
                    sublabel="Certifies medical fitness and explanation of all clauses"
                    signerName={draft.signatures.doctorName}
                    existingSignature={draft.signatures.doctorSignatureUrl}
                    onSave={(dataUrl) =>
                      setDraft({
                        ...draft,
                        signatures: {
                          ...draft.signatures,
                          doctorSignatureUrl: dataUrl,
                          doctorSignDate: new Date().toISOString(),
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Doctor / Witness Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="font-semibold block mb-1">Doctor Name & Qualifications</label>
                  <input
                    type="text"
                    value={draft.signatures.doctorName || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        signatures: { ...draft.signatures, doctorName: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Witness / ASHA Worker Name</label>
                  <input
                    type="text"
                    value={draft.signatures.witnessName || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        signatures: { ...draft.signatures, witnessName: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Provisional Diagnosis & Discharge Advice */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="font-bold text-slate-800">Clinical Decisions & Prescriptions on Discharge</h4>
                
                <div>
                  <label className="font-semibold block mb-1">Provisional Diagnosis</label>
                  <input
                    type="text"
                    value={draft.provisionalDiagnosis}
                    onChange={(e) => setDraft({ ...draft, provisionalDiagnosis: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Treatment / Procedure Advised</label>
                    <textarea
                      rows={2}
                      value={draft.treatmentAdvised}
                      onChange={(e) => setDraft({ ...draft, treatmentAdvised: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Advice on Discharge & Post-op Drugs</label>
                    <textarea
                      rows={2}
                      value={draft.adviceOnDischarge}
                      onChange={(e) => setDraft({ ...draft, adviceOnDischarge: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Guided Navigation Controls: "Continue →" & "← Back" */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          
          <div>
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={goToPrevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {steps[currentStepIndex - 1].label}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Continue to {steps[currentStepIndex + 1].label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onPrint(draft)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Save Clinical Record</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
