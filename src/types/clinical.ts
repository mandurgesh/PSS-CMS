/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ClinicalDepartment = 
  | 'General Gynae'
  | 'Antenatal Care (ANC)'
  | 'Postnatal Care (PNC)'
  | 'Sterilization (Minilap / Lap / NSV)'
  | 'Medical Abortion (Form C MTP)'
  | 'Medicated Abortion (20-24 Wks Form E)'
  | 'MTP Services (6-24 Weeks)'
  | 'Other Abortions (OA)'
  | 'Infertility Consultation'
  | 'Peri-Menopause & Menopause'
  | 'RTI / STI Consultation'
  | 'Surgical Procedures'
  | 'Male Consultation';

export type UserRole = 
  | 'Senior Gynecologist / Surgeon'
  | 'Medical Officer I/C'
  | 'Clinic Counselor / Nurse'
  | 'Anesthetist'
  | 'Receptionist / Billing'
  | 'Pharmacist & Stock Manager'
  | 'Clinic Administrator';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
  branch: string;
  designation: string;
  registrationNo?: string;
}

export interface ChildRecord {
  id: string;
  name: string;
  age: string;
}

export interface FollicularRecord {
  date: string;
  rightOvary: string;
  leftOvary: string;
  endometrialThickness: string;
  pouchOfDouglas: string;
}

export interface AnesthesiaDrug {
  drug: string;
  dosage: string;
  route: string;
  time: string;
}

export interface FollowUpVisitEntry {
  id: string;
  dateOfVisit: string;
  complaint: string;
  examination: string;
  treatment: string;
  dateOfNextVisit: string;
  signature: string;
}

export interface PatientRecord {
  id: string;
  intakeRegistrationNo: string; // e.g. PSS-2026-00104
  clinicLocation: string; // e.g. Delhi Central
  createdAt: string;
  updatedAt: string;
  
  // Demographics
  clientName: string;
  age: number;
  gender: 'Female' | 'Male';
  contactNo: string;
  presentAddress: string;
  paternalAddress?: string;
  spouseOrParentName: string;
  fathersName?: string;
  children: ChildRecord[];
  ageOfYoungestChild?: string;
  religion: string;
  caste: string; // SC/ST/General/OBC
  statusAPL_BPL: 'APL' | 'BPL';
  familyIncome?: string;
  educationalQualification: string;
  occupation: string;
  spouseOccupation?: string;
  maritalStatus: 'Unmarried' | 'Married' | 'Widow' | 'Divorcee';
  ageAtMarriage?: number;
  addictions?: string[];

  // Referral Sources
  primaryReferral: string;
  secondaryReferral?: string;
  referralDetails?: string;

  // Department-specific Registration Numbers
  ggNo?: string;
  gcNo?: string;
  pncNo?: string;
  steriRegisterNo?: string;
  mtpAdmissionNo?: string;
  maIntakeSheetNo?: string;
  oaRegisterNo?: string;
  infertilityNo?: string;
  menopauseNo?: string;
  rtiNo?: string;
  spNo?: string;
  mcNo?: string;
  consultationReceiptNo?: string;

  activeDepartments: ClinicalDepartment[];

  // Vitals & Physical Exam
  vitals: {
    pulse: string;
    bp: string;
    temp: string;
    weight: string;
    height?: string;
    bmi?: string;
    spo2?: string;
    pallor: boolean;
    jaundice: boolean;
    oedemaFeet: boolean;
    lungs: 'Normal' | 'Abnormal';
    heart: 'Normal' | 'Abnormal';
    abdomen: 'Normal' | 'Abnormal';
  };

  // Lab Investigations
  investigations: {
    hb: string; // g/dL
    bloodGroup: string;
    rhFactor: 'Positive' | 'Negative';
    urineAlbumin: 'Present' | 'Absent';
    urineSugar: 'Present' | 'Absent';
    pregnancyTest: 'Positive' | 'Negative' | 'Not Done';
    usgReport?: string;
    usgDate?: string;
    hiv?: 'Non-Reactive' | 'Reactive' | 'Pending';
    vdrl?: 'Non-Reactive' | 'Reactive' | 'Pending';
    hbsag?: 'Negative' | 'Positive' | 'Pending';
  };

  // Menstrual & Obstetric
  menstrualHistory: {
    cycleDays?: string;
    length?: string;
    regularity?: 'Regular' | 'Irregular';
    flow?: 'Scanty' | 'Normal' | 'Heavy';
    lmp?: string;
    edd?: string;
    amenorrheaDays?: string;
    dysmenorrhea?: boolean;
    mastalgiaOrPcod?: string;
  };

  obstetricHistory: {
    gravida?: string;
    para?: string;
    abortions?: string;
    livingChildren?: string;
    lactating: boolean;
    amenorrheic?: boolean;
    previousLscs: 'No' | '1' | '2' | '3+';
    lastLscsDate?: string;
    spontaneousAbortions?: string;
    inducedAbortions?: string;
    lastAbortionDate?: string;
  };

  // Clinical Medical History (30+ systems)
  medicalHistory: Record<string, boolean>;
  medicalHistoryDetails?: string;

  // Infertility Details
  infertility?: {
    coupleMarriageDurationYears?: string;
    cohabitationDuration?: string;
    tryingToConceiveDuration?: string;
    contraceptiveAfterMarriage?: string;
    coitalIssues?: string;
    spouseSemenReport?: 'Normal' | 'Abnormal';
    spouseSemenDetails?: string;
    follicularMonitoring: FollicularRecord[];
    hormonalFSH?: string;
    hormonalLH?: string;
    hormonalAMH?: string;
    hormonalTSH?: string;
    hormonalProlactin?: string;
    provisionalDiagnosis?: string;
  };

  // Menopause Rating Scale (MRS) Details (11 items, 0-4 each)
  menopause?: {
    scores: {
      hotFlushes: number;
      heartDiscomfort: number;
      sleepProblems: number;
      depressiveMood: number;
      irritability: number;
      anxiety: number;
      exhaustion: number;
      sexualProblems: number;
      bladderProblems: number;
      drynessVagina: number;
      jointDiscomfort: number;
    };
    totalScore: number;
    severityLabel: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe';
    bmdScanHip?: string;
    bmdScanSpine?: string;
    mammogram?: string;
  };

  // Sterilization Details
  sterilization?: {
    isFreeScheme: boolean;
    clientConsentAgreed: boolean;
    spouseAware: boolean;
    eligibleCheckAge: boolean;
    eligibleCheckLivingChild: boolean;
    eligibleCheckHbNormal: boolean;
    surgeonOpinionEligible: boolean;
    denialReason?: string;
    procedureType: 'Minilap' | 'Laparoscopy Tubal Occlusion' | 'NSV' | 'Conventional Vasectomy';
    methodOfOcclusion?: 'Modified Pomeroy' | 'Fallope Ring' | 'Hulka Clip' | '2-0 Silk Ligature';
    localAnesthesiaUsed?: string;
    postOpPassedUrine: boolean;
    postOpAbdominalDistension: boolean;
    dischargeInstructionsGiven: boolean;
  };

  // Medical Abortion Form C / Form E Details
  medicalAbortion?: {
    isHigherGestation: boolean; // 20-24 weeks
    gestationWeeks: number;
    form1RmpCertified: boolean;
    formERmp1Name?: string;
    formERmp2Name?: string;
    formECircumstance?: string;
    mifepristoneDate?: string;
    mifepristoneGivenBy?: string;
    misoprostolRoute: 'Buccal' | 'Oral' | 'Sublingual' | 'Vaginal';
    misoprostolLocation: 'Clinic' | 'Home';
    misoprostolDate?: string;
    foleysCatheterUsed?: boolean;
    gestationTier?: MtpGestationTier;
    procedureMethod?: string;
    cervicalPrimingMethod?: string;
    postProcedureObsHours?: number;
    contraceptionGiven?: string;
    bloodLossMl?: string;
    expulsionStatus: 'Complete' | 'Spontaneous' | 'D&E Required' | 'Pending';
    pocChecked: boolean;
    day3CheckInCall: { done: boolean; notes: string; date?: string };
    day4CheckInCall: { done: boolean; notes: string; date?: string };
    day15CompulsoryVisit: { done: boolean; usgCompleted: boolean; date?: string };
  };

  // Surgical Procedures Record
  surgical?: {
    femaleSurgeryType?: string;
    maleSurgeryType?: string;
    anesthesiaType: 'Local' | 'Sedation' | 'General' | 'Spinal';
    anesthesiaDrugs: AnesthesiaDrug[];
    recoveryLevel: 'Fully Conscious' | 'Drowsy' | 'Unresponsive';
    complications?: string;
    lamaSigned?: boolean; // Left Against Medical Advice
  };

  // Follow-up visits history
  followUpVisits: FollowUpVisitEntry[];

  // Clinical Decisions & Advice
  provisionalDiagnosis: string;
  investigationsAdvised: string;
  treatmentAdvised: string;
  adviceOnDischarge: string;

  // Signatures & Legal Consents
  signatures: {
    clientSignatureUrl?: string;
    clientSignDate?: string;
    doctorSignatureUrl?: string;
    doctorSignDate?: string;
    doctorName?: string;
    witnessName?: string;
    witnessSignatureUrl?: string;
  };

  // Compliance & Encryption Metadata
  security: {
    encryptedAtRest: boolean;
    encryptionAlgorithm: string; // 'AES-256-GCM'
    integrityHash: string; // Simulated SHA-256
    lastAuditClinician: string;
    lastAuditTimestamp: string;
  };

  // Billing & Reminders summary
  billingStatus: 'Paid' | 'Pending' | 'Free Subsidy (FPIS)';
  totalAmount: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  contactNo: string;
  department: ClinicalDepartment;
  date: string;
  timeSlot: string;
  doctorName: string;
  status: 'Waiting' | 'In Consultation' | 'In Procedure' | 'Completed' | 'Cancelled';
  roomNo: string;
  tokenNo: number;
  clinicBranch?: string;
}

export interface FollowUpReminder {
  id: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  contactNo: string;
  reminderType: 'Day 3 Miso Call' | 'Day 4 Post-Miso' | 'Day 15 Compulsory MTP' | '3-Month Semen Exam' | 'ANC Interval' | 'Follicular Scan' | 'Post-op Suture Removal';
  dueDate: string;
  dueTime: string;
  channel: 'WhatsApp' | 'SMS' | 'Phone Call';
  status: 'Pending' | 'Sent' | 'Completed' | 'Missed';
  customMessage: string;
  sentTimestamp?: string;
  branch?: string;
}

export interface SecureMessage {
  id: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  sender: 'Doctor' | 'Nurse/Counselor' | 'Patient';
  senderName: string;
  timestamp: string;
  content: string;
  priority: 'Routine' | 'Priority' | 'Urgent';
  read: boolean;
  category: 'Recovery Check' | 'Lab Inquiries' | 'Prescription' | 'Pre-op Fasting' | 'Emergency';
}

export interface BillReceipt {
  id: string;
  receiptNo: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  date: string;
  items: {
    description: string;
    amount: number;
  }[];
  subtotal: number;
  discountOrSubsidy: number;
  total: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Govt FPIS Scheme Waiver';
  status: 'Paid' | 'Pending';
  cashierName: string;
}

export interface HipaaAuditLog {
  id: string;
  timestamp: string;
  clinicianName: string;
  role: string;
  action: 
    | 'Created Record' 
    | 'Viewed Medical File' 
    | 'Updated Intake Sheet' 
    | 'Exported PDF' 
    | 'Signed Consent' 
    | 'Dispatched Notification'
    | 'System Login'
    | 'System Logout'
    | 'Generated Prescription'
    | 'Stock Inventory Add'
    | 'Stock Inventory Update'
    | 'Stock Inventory Delete'
    | 'MTP Registry Entry';
  recordId: string;
  patientName: string;
  intakeNo: string;
  hash: string;
}

export interface PharmacyStockItem {
  id: string;
  branch: string;
  medicineName: string;
  genericName: string;
  category: 'Antibiotic' | 'Uterotonic' | 'Analgesic' | 'Antacid' | 'Hormone' | 'Anesthesia' | 'Contraceptive' | 'Surgical Consumable' | 'IV Fluid';
  dosageForm: 'Tablet' | 'Capsule' | 'Injection' | 'Gel' | 'Syrup' | 'Device';
  strength: string; // e.g. "200 mg", "800 mcg", "0.125 mg"
  batchNo: string;
  expiryDate: string; // YYYY-MM-DD
  currentStock: number;
  minThreshold: number;
  unitPrice: number;
  manufacturer?: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  medicineName: string;
  branch: string;
  type: 'IN' | 'DISPENSED' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  reason: string;
  recordedBy: string;
  timestamp: string;
}

export interface PrescribedMedicine {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string; // '1-0-1', 'TDS', 'BD', 'OD', 'SOS'
  duration: string; // '5 Days', '7 Days', '14 Days'
  route: 'Oral' | 'Buccal' | 'Sublingual' | 'Vaginal' | 'IM' | 'IV' | 'Local';
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  withFood: 'After Food' | 'Before Food' | 'Empty Stomach' | 'With Water';
  instructions?: string;
}

export interface Prescription {
  id: string;
  branch: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  age: number;
  gender: string;
  doctorName: string;
  doctorRegNo?: string;
  date: string;
  diagnosis: string;
  clinicalNotes?: string;
  medicines: PrescribedMedicine[];
  weightKg?: string;
  dosageCalculationNote?: string;
  qrVerificationCode?: string;
}

export type MtpGestationTier = 
  | '6-8 weeks (≤63 Days - Early Medical / MVA)'
  | '8-10 weeks (1st Trimester MVA / EVA)'
  | '10-12 weeks (1st Trimester Suction & Curettage)'
  | '12-14 weeks (Early 2nd Trimester D&E)'
  | '14-16 weeks (2nd Trimester Cervical Priming + D&E)'
  | '16-18 weeks (2nd Trimester Medical Induction / D&E)'
  | '18-20 weeks (2nd Trimester Medical Induction)'
  | '20-22 weeks (Higher Gestation 2-RMP Form E + Foley)'
  | '22-24 weeks (Higher Gestation 2-RMP Form E + Serial Miso)';

export interface MtpProcedureRecord {
  id: string;
  patientId: string;
  patientName: string;
  intakeRegistrationNo: string;
  mtpAdmissionNo: string;
  branch: string;
  date: string;
  gestationTier: MtpGestationTier;
  gestationWeeks: number;
  procedureMethod: 'Medical (Mifepristone + Misoprostol)' | 'MVA (Manual Vacuum Aspiration)' | 'EVA (Electric Vacuum Aspiration)' | 'D&E (Dilatation & Evacuation)' | 'Foley Catheter + Serial Misoprostol' | 'Surgical Curettage';
  rmp1Doctor: string;
  rmp2Doctor?: string; // Required for >20 weeks
  statutoryReasonUnderAct: string;
  consentSigned: boolean;
  pocExpulsionStatus: 'Complete' | 'Incomplete (MVA Done)' | 'Pending';
  anesthesiaType: string;
  complications: string;
  postProcedureObservationHours: number;
  contraceptionGiven: string;
  dischargeAdvice: string;
}

