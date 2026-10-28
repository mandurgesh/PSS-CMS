/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { AppointmentsView } from './components/AppointmentsView';
import { FollowUpReminders } from './components/FollowUpReminders';
import { MessagingPortal } from './components/MessagingPortal';
import { IntakeFormModal } from './components/IntakeFormModal';
import { PrintableCaseSheet } from './components/PrintableCaseSheet';
import { BillingModal } from './components/BillingModal';
import { HipaaAuditModal } from './components/HipaaAuditModal';
import { LoginPage } from './components/LoginPage';
import { PrescriptionModule } from './components/PrescriptionModule';
import { PharmacyStockMaster } from './components/PharmacyStockMaster';
import { MtpProceduresRegistry } from './components/MtpProceduresRegistry';
import { ClinicalAiModal } from './components/ClinicalAiModal';
import { OfficialServicesModal } from './components/OfficialServicesModal';
import { OfficialRateListModal } from './components/OfficialRateListModal';

import { 
  PatientRecord, 
  Appointment, 
  FollowUpReminder, 
  SecureMessage, 
  BillReceipt, 
  HipaaAuditLog, 
  UserRole,
  UserAccount,
  PharmacyStockItem,
  Prescription,
  MtpProcedureRecord
} from './types/clinical';

import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REMINDERS, 
  INITIAL_MESSAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_BILLS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_PHARMACY_STOCK,
  INITIAL_MTP_REGISTRY,
  INITIAL_PRESCRIPTIONS
} from './data/mockData';

const AVAILABLE_BRANCHES = [
  'All Locations (Pan-India HQ Consolidated)',
  'Stree Clinic - Jaipur MI Road',
  'Stree Clinic - Karol Bagh, Delhi',
  'Stree Clinic - Kolkata Central',
  'Stree Clinic - Lucknow Hazratganj',
  'Stree Clinic - Patna Kankarbagh',
  'Stree Clinic - Chennai Mylapore',
];

export default function App() {
  // Authentication State: defaults to Dr. Sunita Sharma (Jaipur Branch) for immediate access,
  // with one-click logout to access the login directory with user IDs and passwords
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USER_ACCOUNTS[0]);
  const [clinicBranch, setClinicBranch] = useState<string>('Stree Clinic - Jaipur MI Road');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Clinical State
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [reminders, setReminders] = useState<FollowUpReminder[]>(INITIAL_REMINDERS);
  const [messages, setMessages] = useState<SecureMessage[]>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<HipaaAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [bills, setBills] = useState<BillReceipt[]>(INITIAL_BILLS);
  const [stockItems, setStockItems] = useState<PharmacyStockItem[]>(INITIAL_PHARMACY_STOCK);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [mtpRecords, setMtpRecords] = useState<MtpProcedureRecord[]>(INITIAL_MTP_REGISTRY);

  // Modal Controls
  const [selectedPatientForIntake, setSelectedPatientForIntake] = useState<PatientRecord | null>(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  const [selectedPatientForPrint, setSelectedPatientForPrint] = useState<PatientRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [selectedPatientForBilling, setSelectedPatientForBilling] = useState<PatientRecord | null>(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isClinicalAiOpen, setIsClinicalAiOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);
  const [targetPatientForMessaging, setTargetPatientForMessaging] = useState<string | undefined>(undefined);
  const [selectedPatientIdForRx, setSelectedPatientIdForRx] = useState<string | undefined>(undefined);

  // Current Role derived from active user
  const currentRole: UserRole = currentUser ? currentUser.role : 'Senior Gynecologist / Surgeon';

  // LOCATION-SEGREGATED vs ALL LOCATIONS CONSOLIDATED DATABASE:
  // When 'All Locations' is selected, clinicians can avail data of all locations at once.
  // When specific branch is selected (e.g., Jaipur), only that branch's data is displayed.
  const isAllLocations = clinicBranch === 'All Locations (Pan-India HQ Consolidated)';

  const visiblePatients = isAllLocations ? patients : patients.filter((p) => p.clinicLocation === clinicBranch);
  const visibleAppointments = isAllLocations ? appointments : appointments.filter((a) => a.clinicBranch === clinicBranch);
  const visibleReminders = isAllLocations ? reminders : reminders.filter((r) => r.branch === clinicBranch);
  const visibleStock = isAllLocations ? stockItems : stockItems.filter((s) => s.branch === clinicBranch);
  const visibleMtp = isAllLocations ? mtpRecords : mtpRecords.filter((m) => m.branch === clinicBranch);
  const visiblePrescriptions = isAllLocations ? prescriptions : prescriptions.filter((rx) => rx.branch === clinicBranch);
  const visibleMessages = isAllLocations ? messages : messages.filter((m) => {
    const pt = patients.find((p) => p.id === m.patientId);
    return pt ? pt.clinicLocation === clinicBranch : true;
  });

  // Helper to add audit log
  const logAuditAction = (
    action: HipaaAuditLog['action'],
    patientId: string,
    patientName: string,
    intakeNo: string
  ) => {
    const newLog: HipaaAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      clinicianName: currentUser ? currentUser.displayName : 'Authorized Staff',
      role: currentRole,
      action,
      recordId: patientId,
      patientName,
      intakeNo,
      hash: `sha256:${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Login handler
  const handleLoginSuccess = (user: UserAccount, branch: string) => {
    setCurrentUser(user);
    setClinicBranch(branch);
    logAuditAction('System Login', `usr-${user.id}`, user.displayName, `USR-${user.username}`);
  };

  // Logout handler
  const handleLogout = () => {
    if (currentUser) {
      logAuditAction('System Logout', `usr-${currentUser.id}`, currentUser.displayName, `USR-${currentUser.username}`);
    }
    setCurrentUser(null);
  };

  // Open New Intake
  const handleOpenNewIntake = () => {
    setSelectedPatientForIntake(null);
    setIsIntakeModalOpen(true);
  };

  // Open Edit Intake
  const handleSelectPatientForIntake = (patient: PatientRecord) => {
    setSelectedPatientForIntake(patient);
    setIsIntakeModalOpen(true);
    logAuditAction('Viewed Medical File', patient.id, patient.clientName, patient.intakeRegistrationNo);
  };

  // Save / Update Patient Record
  const handleSavePatientRecord = (record: PatientRecord) => {
    // Ensure clinic location aligns with active branch
    const stampedRecord = {
      ...record,
      clinicLocation: record.clinicLocation || clinicBranch
    };

    setPatients((prev) => {
      const idx = prev.findIndex((p) => p.id === stampedRecord.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = stampedRecord;
        logAuditAction('Updated Intake Sheet', stampedRecord.id, stampedRecord.clientName, stampedRecord.intakeRegistrationNo);
        return copy;
      } else {
        logAuditAction('Created Record', stampedRecord.id, stampedRecord.clientName, stampedRecord.intakeRegistrationNo);
        return [stampedRecord, ...prev];
      }
    });
  };

  // Open Print Sheet
  const handlePrintPatient = (patient: PatientRecord) => {
    setSelectedPatientForPrint(patient);
    setIsPrintModalOpen(true);
    logAuditAction('Exported PDF', patient.id, patient.clientName, patient.intakeRegistrationNo);
  };

  // Open Billing
  const handleOpenBilling = (patient: PatientRecord) => {
    setSelectedPatientForBilling(patient);
    setIsBillingModalOpen(true);
  };

  // Save Bill
  const handleSaveBill = (bill: BillReceipt) => {
    setBills((prev) => [bill, ...prev]);
    // update patient total amount
    setPatients((prev) =>
      prev.map((p) =>
        p.id === bill.patientId
          ? {
              ...p,
              billingStatus: bill.discountOrSubsidy === bill.subtotal ? 'Free Subsidy (FPIS)' : 'Paid',
              totalAmount: bill.total,
            }
          : p
      )
    );
  };

  // Message patient
  const handleMessagePatient = (patient: PatientRecord) => {
    setTargetPatientForMessaging(patient.id);
    setActiveTab('messages');
  };

  // Quick prescribe from patient list
  const handlePrescribePatient = (patient: PatientRecord) => {
    setSelectedPatientIdForRx(patient.id);
    setActiveTab('prescriptions');
  };

  // Dispatch reminder
  const handleDispatchReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? { ...r, status: 'Sent', sentTimestamp: new Date().toISOString() }
          : r
      )
    );
    const rem = reminders.find((r) => r.id === reminderId);
    if (rem) {
      logAuditAction('Dispatched Notification', rem.patientId, rem.patientName, rem.intakeRegistrationNo);
    }
  };

  // Add Reminder
  const handleAddReminder = (reminder: FollowUpReminder) => {
    const stamped = { ...reminder, branch: clinicBranch };
    setReminders((prev) => [stamped, ...prev]);
  };

  // Send Message
  const handleSendMessage = (msg: SecureMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Update Appointment Queue Status
  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Add Appointment
  const handleAddAppointment = (newApt: Appointment) => {
    const stamped = { ...newApt, clinicBranch };
    setAppointments((prev) => [...prev, stamped]);
  };

  // Save Prescription
  const handleSavePrescription = (newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);
    logAuditAction('Generated Prescription', newRx.patientId, newRx.patientName, newRx.intakeRegistrationNo);
  };

  // Stock Master Handlers
  const handleAddStockItem = (item: PharmacyStockItem) => {
    setStockItems((prev) => [item, ...prev]);
    logAuditAction('Stock Inventory Add', item.id, item.medicineName, `BATCH-${item.batchNo}`);
  };

  const handleUpdateStockItem = (updated: PharmacyStockItem) => {
    setStockItems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    logAuditAction('Stock Inventory Update', updated.id, updated.medicineName, `BATCH-${updated.batchNo}`);
  };

  const handleDeleteStockItem = (itemId: string) => {
    const item = stockItems.find((s) => s.id === itemId);
    setStockItems((prev) => prev.filter((s) => s.id !== itemId));
    if (item) {
      logAuditAction('Stock Inventory Delete', item.id, item.medicineName, `BATCH-${item.batchNo}`);
    }
  };

  // Add MTP Record
  const handleAddMtpRecord = (rec: MtpProcedureRecord) => {
    setMtpRecords((prev) => [rec, ...prev]);
    logAuditAction('MTP Registry Entry', rec.patientId, rec.patientName, rec.intakeRegistrationNo);
  };

  // If user is logged out, render the Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        availableBranches={AVAILABLE_BRANCHES}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Bar with 3-Zone contract & Branch Database Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        clinicBranch={clinicBranch}
        setClinicBranch={setClinicBranch}
        onOpenNewIntake={handleOpenNewIntake}
        onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        onOpenClinicalAi={() => setIsClinicalAiOpen(true)}
        onOpenServicesModal={() => setIsServicesModalOpen(true)}
        onOpenRateList={() => setIsRateListModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dashboard Tab with Recharts Visualizations */}
        {activeTab === 'dashboard' && (
          <Dashboard
            patients={visiblePatients}
            appointments={visibleAppointments}
            reminders={visibleReminders}
            bills={bills}
            clinicBranch={clinicBranch}
            onSelectPatient={handleSelectPatientForIntake}
            onOpenNewIntake={handleOpenNewIntake}
            onNavigateToTab={setActiveTab}
            onOpenServicesModal={() => setIsServicesModalOpen(true)}
            onOpenRateList={() => setIsRateListModalOpen(true)}
            onSetBranch={(b) => setClinicBranch(b)}
          />
        )}

        {/* Patient Case Sheets Tab */}
        {activeTab === 'patients' && (
          <PatientList
            patients={visiblePatients}
            onSelectPatient={handleSelectPatientForIntake}
            onPrintPatient={handlePrintPatient}
            onOpenBilling={handleOpenBilling}
            onMessagePatient={handleMessagePatient}
            onOpenNewIntake={handleOpenNewIntake}
            onPrescribePatient={handlePrescribePatient}
          />
        )}

        {/* Prescription Module with Auto-Notes & Quick Print */}
        {activeTab === 'prescriptions' && (
          <PrescriptionModule
            currentBranch={clinicBranch}
            currentUser={currentUser}
            patients={visiblePatients}
            stockItems={visibleStock}
            prescriptions={visiblePrescriptions}
            onSavePrescription={handleSavePrescription}
            selectedPatientId={selectedPatientIdForRx}
          />
        )}

        {/* Drug & Medicine Master Stock Inventory */}
        {activeTab === 'stock-master' && (
          <PharmacyStockMaster
            currentBranch={clinicBranch}
            currentUser={currentUser}
            stockItems={stockItems}
            onAddStockItem={handleAddStockItem}
            onUpdateStockItem={handleUpdateStockItem}
            onDeleteStockItem={handleDeleteStockItem}
          />
        )}

        {/* Real-time Appointments & OPD Queue */}
        {activeTab === 'appointments' && (
          <AppointmentsView
            appointments={visibleAppointments}
            patients={visiblePatients}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onAddAppointment={handleAddAppointment}
            onSelectPatient={handleSelectPatientForIntake}
          />
        )}

        {/* Automated Follow-Up Reminders */}
        {activeTab === 'followups' && (
          <FollowUpReminders
            reminders={visibleReminders}
            patients={visiblePatients}
            onDispatchReminder={handleDispatchReminder}
            onAddReminder={handleAddReminder}
          />
        )}

        {/* Secure Doctor-Patient Messaging Portal */}
        {activeTab === 'messages' && (
          <MessagingPortal
            messages={visibleMessages}
            patients={visiblePatients}
            onSendMessage={handleSendMessage}
            currentRole={currentRole}
            preselectedPatientId={targetPatientForMessaging}
          />
        )}

      </main>

      {/* Footer with Compliance & Certification */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Parivar Seva Sanstha · Stree Clinic</span>
            <span>·</span>
            <span>Estd. 1978 · Health for Bharat</span>
            <span>·</span>
            <span className="text-rose-600 font-medium">Active Branch: {clinicBranch}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>MTP Act 2021 Compliant (6 - 24 Wks)</span>
            <span>·</span>
            <span>HIPAA AES-256 At-Rest Encryption</span>
            <span>·</span>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold underline"
            >
              Audit Trail ({auditLogs.length} events)
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Intake Sheet Modal with Single Department Selection & 5-Step Guided Flow */}
      {isIntakeModalOpen && (
        <IntakeFormModal
          patient={selectedPatientForIntake}
          isOpen={isIntakeModalOpen}
          onClose={() => setIsIntakeModalOpen(false)}
          onSave={handleSavePatientRecord}
          onPrint={handlePrintPatient}
          clinicBranch={clinicBranch}
        />
      )}

      {/* Official Printable Sheet Modal */}
      {selectedPatientForPrint && isPrintModalOpen && (
        <PrintableCaseSheet
          patient={selectedPatientForPrint}
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Billing Modal */}
      {selectedPatientForBilling && isBillingModalOpen && (
        <BillingModal
          patient={selectedPatientForBilling}
          bill={bills.find((b) => b.patientId === selectedPatientForBilling.id)}
          isOpen={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
          onSaveBill={handleSaveBill}
        />
      )}

      {/* HIPAA Audit Logs Modal */}
      {isAuditModalOpen && (
        <HipaaAuditModal
          logs={auditLogs}
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {/* Clinical AI Assistant Modal (Google Search Grounded) */}
      <ClinicalAiModal
        isOpen={isClinicalAiOpen}
        onClose={() => setIsClinicalAiOpen(false)}
        clinicBranch={clinicBranch}
      />

      {/* Official Services & Stree Clinic Portfolio Modal (streeclinic.com) */}
      {isServicesModalOpen && (
        <OfficialServicesModal
          isOpen={isServicesModalOpen}
          onClose={() => setIsServicesModalOpen(false)}
          onOpenRateList={() => {
            setIsServicesModalOpen(false);
            setIsRateListModalOpen(true);
          }}
        />
      )}

      {/* Official Rate List & Tariff Master Modal */}
      {isRateListModalOpen && (
        <OfficialRateListModal
          isOpen={isRateListModalOpen}
          onClose={() => setIsRateListModalOpen(false)}
          clinicBranch={clinicBranch}
          onSelectForBilling={(item) => {
            setIsRateListModalOpen(false);
            if (visiblePatients.length > 0) {
              handleOpenBilling(visiblePatients[0]);
            }
          }}
        />
      )}

    </div>
  );
}
