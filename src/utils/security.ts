/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClinicalDepartment, PatientRecord, FollowUpReminder } from '../types/clinical';

/**
 * Generate unique intake and register numbers matching official Stree Clinic stationery.
 */
export function generateIntakeNumber(prefix: string, seq: number): string {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
}

export interface IntakeIdentifiers {
  intakeRegistrationNo: string;
  consultationReceiptNo: string;
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
}

export function generateFullIntakeIdentifiers(seq: number, department: ClinicalDepartment): IntakeIdentifiers {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(5, '0');
  const shortPadded = String(seq).padStart(4, '0');

  const result: IntakeIdentifiers = {
    intakeRegistrationNo: `PSS-${year}-${padded}`,
    consultationReceiptNo: `CR-${year}-${shortPadded}`,
  };

  switch (department) {
    case 'General Gynae':
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'Antenatal Care (ANC)':
      result.gcNo = `ANC-${year}-${shortPadded}`;
      break;
    case 'Postnatal Care (PNC)':
      result.pncNo = `PNC-${year}-${shortPadded}`;
      break;
    case 'Sterilization (Minilap / Lap / NSV)':
      result.steriRegisterNo = `STR-${year}-${shortPadded}`;
      break;
    case 'Medical Abortion (Form C MTP)':
      result.mtpAdmissionNo = `MTP-${year}-${shortPadded}`;
      result.maIntakeSheetNo = `MA-${shortPadded}`;
      break;
    case 'Medicated Abortion (20-24 Wks Form E)':
      result.mtpAdmissionNo = `MTP-HG-${year}-${shortPadded}`;
      result.maIntakeSheetNo = `MA-HG-${shortPadded}`;
      break;
    case 'MTP Services (6-24 Weeks)':
      result.mtpAdmissionNo = `MTP-${year}-${shortPadded}`;
      result.maIntakeSheetNo = `MTP-MED-${shortPadded}`;
      break;
    case 'Other Abortions (OA)':
      result.oaRegisterNo = `OA-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'Infertility Consultation':
      result.infertilityNo = `INF-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'Peri-Menopause & Menopause':
      result.menopauseNo = `MENO-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'RTI / STI Consultation':
      result.rtiNo = `RTI-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'Surgical Procedures':
      result.spNo = `SP-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
    case 'Male Consultation':
      result.mcNo = `MC-${year}-${shortPadded}`;
      result.ggNo = `GG-${year}-${shortPadded}`;
      break;
  }

  return result;
}

/**
 * Generate simulated cryptographic hash for HIPAA integrity verification
 */
export function generateIntegrityHash(recordId: string, timestamp: string): string {
  let hash = 0;
  const str = `${recordId}-${timestamp}-PARIVAR-SEVA-SECURE-KEY`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:7f8a9c${hex}e34d1b84920fcb3`;
}

/**
 * Calculate Estimated Date of Delivery (EDD) from LMP
 * Naegele's rule: LMP + 280 days (or + 1 year, - 3 months, + 7 days)
 */
export function calculateEDD(lmpDateStr: string): { edd: string; gestationWeeks: number } {
  if (!lmpDateStr) return { edd: '', gestationWeeks: 0 };
  const lmp = new Date(lmpDateStr);
  if (isNaN(lmp.getTime())) return { edd: '', gestationWeeks: 0 };

  const eddDate = new Date(lmp);
  eddDate.setDate(eddDate.getDate() + 280);

  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lmp.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const gestationWeeks = Math.floor(diffDays / 7);

  return {
    edd: eddDate.toISOString().split('T')[0],
    gestationWeeks,
  };
}

/**
 * Calculate Menopause Rating Scale (MRS) total and severity label
 */
export function calculateMRSScore(scores: Record<string, number>): {
  total: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe';
} {
  const total = Object.values(scores).reduce((acc, val) => acc + (val || 0), 0);
  let severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' = 'None';

  if (total <= 4) severity = 'None';
  else if (total <= 8) severity = 'Mild';
  else if (total <= 16) severity = 'Moderate';
  else if (total <= 24) severity = 'Severe';
  else severity = 'Very Severe';

  return { total, severity };
}

/**
 * Automatically create follow-up reminders based on intake protocols
 */
export function generateProtocolReminders(patient: PatientRecord): FollowUpReminder[] {
  const reminders: FollowUpReminder[] = [];
  const today = new Date();

  // If Medical Abortion Form C
  if (patient.activeDepartments.includes('Medical Abortion (Form C MTP)') || patient.activeDepartments.includes('Medicated Abortion (20-24 Wks Form E)')) {
    const day3 = new Date(today);
    day3.setDate(day3.getDate() + 2);
    reminders.push({
      id: `REM-${patient.id}-D3`,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      contactNo: patient.contactNo,
      reminderType: 'Day 3 Miso Call',
      dueDate: day3.toISOString().split('T')[0],
      dueTime: '16:00',
      channel: 'Phone Call',
      status: 'Pending',
      customMessage: `Dear ${patient.clientName}, this is Stree Clinic check-in. Please confirm if you have taken Tab Misoprostol today on empty stomach as instructed. Contact us if bleeding/pain is excessive.`,
    });

    const day4 = new Date(today);
    day4.setDate(day4.getDate() + 3);
    reminders.push({
      id: `REM-${patient.id}-D4`,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      contactNo: patient.contactNo,
      reminderType: 'Day 4 Post-Miso',
      dueDate: day4.toISOString().split('T')[0],
      dueTime: '14:00',
      channel: 'WhatsApp',
      status: 'Pending',
      customMessage: `Hello ${patient.clientName}, checking from Stree Clinic. Has the abortion completed with bleeding reducing? If minimal bleeding or POC not passed, visit clinic immediately.`,
    });

    const day15 = new Date(today);
    day15.setDate(day15.getDate() + 14);
    reminders.push({
      id: `REM-${patient.id}-D15`,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      contactNo: patient.contactNo,
      reminderType: 'Day 15 Compulsory MTP',
      dueDate: day15.toISOString().split('T')[0],
      dueTime: '10:00',
      channel: 'WhatsApp',
      status: 'Pending',
      customMessage: `Dear ${patient.clientName}, your compulsory Day 15 follow-up and confirmation ultrasound at Stree Clinic is scheduled. Please bring your intake card.`,
    });
  }

  // If Sterilization Procedure
  if (patient.activeDepartments.includes('Sterilization (Minilap / Lap / NSV)')) {
    if (patient.gender === 'Male') {
      const threeMonths = new Date(today);
      threeMonths.setMonth(threeMonths.getMonth() + 3);
      reminders.push({
        id: `REM-${patient.id}-VAS`,
        patientId: patient.id,
        patientName: patient.clientName,
        intakeRegistrationNo: patient.intakeRegistrationNo,
        contactNo: patient.contactNo,
        reminderType: '3-Month Semen Exam',
        dueDate: threeMonths.toISOString().split('T')[0],
        dueTime: '09:30',
        channel: 'SMS',
        status: 'Pending',
        customMessage: `Reminder from Stree Clinic: It has been 3 months since your NSV surgery. Please provide a semen sample to certify Azoospermia and surgical success. Use barrier contraception until certified.`,
      });
    } else {
      const day7 = new Date(today);
      day7.setDate(day7.getDate() + 7);
      reminders.push({
        id: `REM-${patient.id}-SUT`,
        patientId: patient.id,
        patientName: patient.clientName,
        intakeRegistrationNo: patient.intakeRegistrationNo,
        contactNo: patient.contactNo,
        reminderType: 'Post-op Suture Removal',
        dueDate: day7.toISOString().split('T')[0],
        dueTime: '11:00',
        channel: 'SMS',
        status: 'Pending',
        customMessage: `Dear ${patient.clientName}, your 7-day post-sterilization follow-up and wound check is due. Please visit Stree Clinic at 11:00 AM.`,
      });
    }
  }

  // If ANC
  if (patient.activeDepartments.includes('Antenatal Care (ANC)')) {
    const next4Weeks = new Date(today);
    next4Weeks.setDate(next4Weeks.getDate() + 28);
    reminders.push({
      id: `REM-${patient.id}-ANC`,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      contactNo: patient.contactNo,
      reminderType: 'ANC Interval',
      dueDate: next4Weeks.toISOString().split('T')[0],
      dueTime: '10:30',
      channel: 'WhatsApp',
      status: 'Pending',
      customMessage: `Dear ${patient.clientName}, your regular Antenatal Care checkup and routine blood tests at Stree Clinic are due on ${next4Weeks.toLocaleDateString()}. Take your iron & calcium supplements daily.`,
    });
  }

  // If Infertility
  if (patient.activeDepartments.includes('Infertility Consultation')) {
    const cycleDay = new Date(today);
    cycleDay.setDate(cycleDay.getDate() + 10);
    reminders.push({
      id: `REM-${patient.id}-FOLL`,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      contactNo: patient.contactNo,
      reminderType: 'Follicular Scan',
      dueDate: cycleDay.toISOString().split('T')[0],
      dueTime: '09:00',
      channel: 'WhatsApp',
      status: 'Pending',
      customMessage: `Dear ${patient.clientName}, your Day 10 Follicular Monitoring Ultrasound with Dr. Sen is scheduled. Please arrive on empty bladder.`,
    });
  }

  return reminders;
}
