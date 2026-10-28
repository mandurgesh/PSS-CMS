/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { PatientRecord } from '../types/clinical';

interface PrintableCaseSheetProps {
  patient: PatientRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableCaseSheet: React.FC<PrintableCaseSheetProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSterilization = patient.activeDepartments.includes('Sterilization (Minilap / Lap / NSV)');
  const isMtp = patient.activeDepartments.includes('Medical Abortion (Form C MTP)') || patient.activeDepartments.includes('Medicated Abortion (20-24 Wks Form E)');
  const isMenopause = patient.activeDepartments.includes('Peri-Menopause & Menopause');
  const isInfertility = patient.activeDepartments.includes('Infertility Consultation');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Print Bar Header (Excluded from print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Official Medical Document Preview
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300">
              {patient.clientName} ({patient.intakeRegistrationNo})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Sheet (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-slate-900 bg-white font-sans text-xs space-y-6">
          
          {/* Official Letterhead matching PDF Screenshot Page 1 */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-between">
              
              {/* Left Logo: Parivar Seva Sanstha */}
              <div className="text-left w-1/4">
                <div className="text-rose-600 font-bold text-sm tracking-wide">
                  PARIVAR SEVA
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Health for Bharat
                </div>
                <div className="text-[9px] text-slate-500">
                  Established 1978
                </div>
              </div>

              {/* Center: Stree Clinic Title */}
              <div className="text-center flex-1">
                <h1 className="text-2xl font-black text-sky-800 tracking-tight">
                  Stree Clinic
                </h1>
                <p className="text-[11px] font-semibold text-slate-700">
                  A Clinic of Parivar Seva Sanstha, Estd. 1978
                </p>
                <p className="text-[11px] font-bold text-slate-900 mt-1">
                  Location: <span className="underline">{patient.clinicLocation}</span>
                </p>
              </div>

              {/* Right Logo: Stree Clinic Official Brand Logo */}
              <div className="text-right w-1/4 flex flex-col items-end">
                <div className="h-12 w-12 rounded-lg border border-slate-300 p-1 bg-white mb-1 shadow-2xs">
                  <img 
                    src="/assets/stree_clinic_logo.png" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
                    }}
                    alt="Official Stree Clinic Logo" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[8px] text-slate-600 uppercase font-bold tracking-tight">
                  Health Care · Birth Control
                </div>
                <div className="text-[8px] text-rose-700 font-bold">for WOMEN of all AGES</div>
              </div>

            </div>

            {/* Official Intake Form Banner */}
            <div className="mt-4 border-2 border-slate-900 text-center py-1.5 font-bold uppercase tracking-wide text-xs bg-slate-50">
              {patient.activeDepartments.includes('MTP Services (6-24 Weeks)') && 'INTAKE SHEET - MTP SERVICES & STATUTORY REGISTRY (6 TO 24 WEEKS - FORM C, FORM 1 & FORM E)'}
              {patient.activeDepartments.includes('Sterilization (Minilap / Lap / NSV)') && 'INTAKE SHEET - APPLICATION AND INFORMED CONSENT FOR STERILIZATION PROCEDURE'}
              {patient.activeDepartments.includes('Medical Abortion (Form C MTP)') && 'INTAKE SHEET - FORM C: CONSENT FORM (MEDICAL ABORTION UP TO 63 DAYS)'}
              {patient.activeDepartments.includes('Medicated Abortion (20-24 Wks Form E)') && 'INTAKE SHEET - FORM C & FORM E: MEDICATED ABORTION (HIGHER GESTATION 20-24 WEEKS)'}
              {patient.activeDepartments.includes('Other Abortions (OA)') && 'INTAKE SHEET - OTHER ABORTIONS (INTERFERED / INCOMPLETE / SPONTANEOUS)'}
              {patient.activeDepartments.includes('Infertility Consultation') && 'INTAKE SHEET - INFERTILITY CONSULTATION & FOLLICULAR STUDY'}
              {patient.activeDepartments.includes('Peri-Menopause & Menopause') && 'INTAKE SHEET - PERI-MENOPAUSE & MENOPAUSE CONSULTATION (MRS)'}
              {patient.activeDepartments.includes('Antenatal Care (ANC)') && 'INTAKE SHEET - ANTENATAL CONSULTATION (ANC)'}
              {patient.activeDepartments.includes('Postnatal Care (PNC)') && 'INTAKE SHEET - POSTNATAL CONSULTATION (PNC)'}
              {patient.activeDepartments.includes('RTI / STI Consultation') && 'INTAKE SHEET - RTI / STI CONSULTATION'}
              {patient.activeDepartments.includes('Surgical Procedures') && 'INTAKE SHEET - RECORD FOR SURGICAL PROCEDURES'}
              {patient.activeDepartments.includes('Male Consultation') && 'INTAKE SHEET - MALE CONSULTATION'}
              {patient.activeDepartments.includes('General Gynae') && !patient.activeDepartments.some(d => d !== 'General Gynae') && 'INTAKE SHEET - GENERAL GYNAECOLOGY CONSULTATION'}
            </div>

            {/* Top Registration Identifiers Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-[11px] font-medium border-t border-slate-200 pt-2">
              <div>
                <strong>Date:</strong> {new Date(patient.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Intake Sheet No:</strong> {patient.maIntakeSheetNo || patient.ggNo || 'PS-01'}
              </div>
              <div>
                <strong>Intake Registration No:</strong>{' '}
                <span className="font-mono font-bold">{patient.intakeRegistrationNo}</span>
              </div>
              <div>
                <strong>Special Register No:</strong>{' '}
                <span className="font-mono font-bold">
                  {patient.steriRegisterNo || patient.mtpAdmissionNo || patient.infertilityNo || patient.menopauseNo || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Client Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>1. Name of the Client:</strong> {patient.clientName}
              </div>
              <div>
                <strong>2. Name of Husband / Wife / Guardian:</strong> {patient.spouseOrParentName}
              </div>
              <div>
                <strong>3. Present Address:</strong> {patient.presentAddress}
              </div>
              <div>
                <strong>4. Contact No:</strong> {patient.contactNo}
              </div>
            </div>

            {/* Children Table */}
            <div className="mt-2">
              <strong className="block mb-1">
                5. Name of all living, unmarried dependent Children with age:
              </strong>
              <table className="w-full border border-slate-900 text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-900">
                  <tr>
                    <th className="p-1.5 border-r border-slate-900 w-12 text-center">S.No</th>
                    <th className="p-1.5 border-r border-slate-900">Name</th>
                    <th className="p-1.5">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.children.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-2 text-center text-slate-500 italic">
                        No dependent children recorded.
                      </td>
                    </tr>
                  ) : (
                    patient.children.map((child, idx) => (
                      <tr key={child.id} className="border-b border-slate-300">
                        <td className="p-1.5 border-r border-slate-900 text-center">{idx + 1}</td>
                        <td className="p-1.5 border-r border-slate-900">{child.name}</td>
                        <td className="p-1.5">{child.age}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Socio-Demographic details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px]">
              <div>
                <strong>Religion / Nationality:</strong> {patient.religion}
              </div>
              <div>
                <strong>Caste:</strong> {patient.caste}
              </div>
              <div>
                <strong>Status:</strong> {patient.statusAPL_BPL} ({patient.familyIncome || 'N/A'})
              </div>
              <div>
                <strong>Education:</strong> {patient.educationalQualification}
              </div>
              <div>
                <strong>Occupation:</strong> {patient.occupation}
              </div>
              <div>
                <strong>Spouse Occupation:</strong> {patient.spouseOccupation || 'N/A'}
              </div>
              <div>
                <strong>Marital Status:</strong> {patient.maritalStatus}
              </div>
              <div>
                <strong>Age at Marriage:</strong> {patient.ageAtMarriage ? `${patient.ageAtMarriage} Yrs` : 'N/A'}
              </div>
            </div>

            <div className="border border-slate-300 p-2 bg-slate-50 rounded text-[11px]">
              <strong>11. Source of Referral:</strong> Primary: {patient.primaryReferral} · Secondary: {patient.secondaryReferral || 'None'} ({patient.referralDetails || 'Direct walk-in'})
            </div>
          </div>

          {/* Section 2: Medical & Menstrual Record */}
          <div className="border-t border-slate-400 pt-3 space-y-3">
            <h3 className="font-bold uppercase text-[11px] tracking-wide bg-slate-100 p-1">
              Medical & Menstrual History
            </h3>

            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <div>
                <strong>LMP:</strong> {patient.menstrualHistory.lmp || 'N/A'}
              </div>
              <div>
                <strong>Cycle Regularity:</strong> {patient.menstrualHistory.regularity || 'Regular'}
              </div>
              <div>
                <strong>Bleeding Flow:</strong> {patient.menstrualHistory.flow || 'Normal'}
              </div>
              <div>
                <strong>Obstetric Formula:</strong> G{patient.obstetricHistory.gravida || '0'} P{patient.obstetricHistory.para || '0'} A{patient.obstetricHistory.abortions || '0'} L{patient.obstetricHistory.livingChildren || '0'}
              </div>
              <div>
                <strong>Previous LSCS:</strong> {patient.obstetricHistory.previousLscs}
              </div>
              <div>
                <strong>Lactating:</strong> {patient.obstetricHistory.lactating ? 'Yes' : 'No'}
              </div>
            </div>

            {/* Vitals & Investigations Table */}
            <table className="w-full border border-slate-900 text-left text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-900">
                <tr>
                  <th className="p-1.5 border-r border-slate-900">Pulse</th>
                  <th className="p-1.5 border-r border-slate-900">Blood Pressure</th>
                  <th className="p-1.5 border-r border-slate-900">Temperature</th>
                  <th className="p-1.5 border-r border-slate-900">Weight</th>
                  <th className="p-1.5 border-r border-slate-900">Hemoglobin</th>
                  <th className="p-1.5 border-r border-slate-900">Blood Group</th>
                  <th className="p-1.5 border-r border-slate-900">Urine Alb/Sugar</th>
                  <th className="p-1.5">Pregnancy Test</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1.5 border-r border-slate-900">{patient.vitals.pulse} /min</td>
                  <td className="p-1.5 border-r border-slate-900">{patient.vitals.bp} mm Hg</td>
                  <td className="p-1.5 border-r border-slate-900">{patient.vitals.temp}</td>
                  <td className="p-1.5 border-r border-slate-900">{patient.vitals.weight} kg</td>
                  <td className="p-1.5 border-r border-slate-900 font-bold">{patient.investigations.hb} g/dL</td>
                  <td className="p-1.5 border-r border-slate-900">{patient.investigations.bloodGroup} {patient.investigations.rhFactor}</td>
                  <td className="p-1.5 border-r border-slate-900">{patient.investigations.urineAlbumin} / {patient.investigations.urineSugar}</td>
                  <td className="p-1.5 font-bold">{patient.investigations.pregnancyTest}</td>
                </tr>
              </tbody>
            </table>

            {patient.investigations.usgReport && (
              <div className="text-[11px] bg-slate-50 border border-slate-200 p-2">
                <strong>Ultrasound (USG) Report:</strong> {patient.investigations.usgReport}
              </div>
            )}
          </div>

          {/* Section 3: Department Specifics */}
          {isSterilization && (
            <div className="border-t border-slate-400 pt-3 space-y-2">
              <h3 className="font-bold uppercase text-[11px] tracking-wide bg-slate-100 p-1">
                Sterilization Procedure Details & Surgeon Certification
              </h3>
              <p className="text-[10px] leading-tight">
                Technique: <strong>{patient.sterilization?.procedureType}</strong> · Method of Occlusion: <strong>{patient.sterilization?.methodOfOcclusion}</strong> · Local Anesthesia: <strong>{patient.sterilization?.localAnesthesiaUsed}</strong>
              </p>
              <p className="text-[10px] italic">
                Surgeon Opinion: I certify that I have satisfied myself that the client is within eligible age-group and medically fit for sterilization procedure as per Government of India guidelines.
              </p>
            </div>
          )}

          {isMtp && (
            <div className="border-t border-slate-400 pt-3 space-y-2">
              <h3 className="font-bold uppercase text-[11px] tracking-wide bg-slate-100 p-1">
                MTP Form 1 / Form C Certification & Drug Schedule
              </h3>
              <p className="text-[10px]">
                Gestation Age: <strong>{patient.medicalAbortion?.gestationWeeks || 6} Weeks</strong> · Tab Mifepristone 200mg administered · Tab Misoprostol 800mcg ({patient.medicalAbortion?.misoprostolRoute} at {patient.medicalAbortion?.misoprostolLocation}).
              </p>
              <p className="text-[10px] italic">
                Form 1 Declaration: I hereby certify that I am of opinion, formed in good faith, that it is necessary to terminate the pregnancy of the woman referred to above under the MTP Act.
              </p>
            </div>
          )}

          {isMenopause && (
            <div className="border-t border-slate-400 pt-3 space-y-2">
              <h3 className="font-bold uppercase text-[11px] tracking-wide bg-slate-100 p-1">
                Menopause Rating Scale (MRS) Assessment
              </h3>
              <p className="text-[11px]">
                Total MRS Score: <strong>{patient.menopause?.totalScore || 0} / 44</strong> (Severity Classification: <strong>{patient.menopause?.severityLabel}</strong>)
              </p>
              <p className="text-[10px]">
                Hip BMD: {patient.menopause?.bmdScanHip || 'N/A'} · Spine BMD: {patient.menopause?.bmdScanSpine || 'N/A'} · Mammogram: {patient.menopause?.mammogram || 'N/A'}
              </p>
            </div>
          )}

          {/* Section 4: Clinical Decisions & Discharge */}
          <div className="border-t border-slate-400 pt-3 space-y-2">
            <h3 className="font-bold uppercase text-[11px] tracking-wide bg-slate-100 p-1">
              Clinical Assessment & Discharge Advice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <strong>Provisional Diagnosis:</strong> {patient.provisionalDiagnosis}
              </div>
              <div>
                <strong>Treatment / Procedure:</strong> {patient.treatmentAdvised}
              </div>
              <div className="sm:col-span-2">
                <strong>Advice on Discharge & Prescriptions:</strong> {patient.adviceOnDischarge}
              </div>
            </div>
          </div>

          {/* Section 5: Legal Consents & Verified Digital Signatures */}
          <div className="border-t-2 border-slate-900 pt-4 print-break-inside-avoid">
            <div className="grid grid-cols-2 gap-6">
              
              {/* Client Signature */}
              <div className="border border-slate-400 p-3 rounded text-center">
                <div className="h-16 flex items-center justify-center">
                  {patient.signatures.clientSignatureUrl ? (
                    <img
                      src={patient.signatures.clientSignatureUrl}
                      alt="Client Signature"
                      className="max-h-14 object-contain mx-auto"
                    />
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Signature Verified on File</span>
                  )}
                </div>
                <div className="border-t border-slate-300 pt-1 mt-1 font-bold text-[11px]">
                  Sign / Thumb Impression of Client / Acceptor
                </div>
                <div className="text-[10px] text-slate-500">
                  Name: {patient.clientName}
                </div>
              </div>

              {/* Doctor / Surgeon Signature */}
              <div className="border border-slate-400 p-3 rounded text-center">
                <div className="h-16 flex items-center justify-center">
                  {patient.signatures.doctorSignatureUrl ? (
                    <img
                      src={patient.signatures.doctorSignatureUrl}
                      alt="Doctor Signature"
                      className="max-h-14 object-contain mx-auto"
                    />
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Signature Verified on File</span>
                  )}
                </div>
                <div className="border-t border-slate-300 pt-1 mt-1 font-bold text-[11px]">
                  Signature & Seal of Operating Doctor / Surgeon
                </div>
                <div className="text-[10px] text-slate-500">
                  {patient.signatures.doctorName || 'Senior Medical Officer, Stree Clinic'}
                </div>
              </div>

            </div>

            {/* Document Verification Footer */}
            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>Electronic Record Verified · Encrypted At Rest (AES-256-GCM)</span>
              <span>Integrity Hash: {patient.security.integrityHash}</span>
              <span>Parivar Seva Sanstha · Stree Clinic Document ID: {patient.intakeRegistrationNo}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
