/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Bed, 
  DoorClosed,
  Stethoscope
} from 'lucide-react';
import { Appointment, PatientRecord, ClinicalDepartment } from '../types/clinical';

interface AppointmentsViewProps {
  appointments: Appointment[];
  patients: PatientRecord[];
  onUpdateStatus: (appointmentId: string, status: Appointment['status']) => void;
  onAddAppointment: (newApt: Appointment) => void;
  onSelectPatient: (patient: PatientRecord) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  patients,
  onUpdateStatus,
  onAddAppointment,
  onSelectPatient,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Appointment Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDepartment, setSelectedDepartment] = useState<ClinicalDepartment>('General Gynae');
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [roomNo, setRoomNo] = useState('OPD Room 1');
  const [doctorName, setDoctorName] = useState('Dr. Reena Sen (MS Gynae)');

  const filteredAppointments = appointments.filter((a) => a.date === selectedDate || selectedDate === 'All');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId);
    if (!pat) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.clientName,
      intakeRegistrationNo: pat.intakeRegistrationNo,
      contactNo: pat.contactNo,
      department: selectedDepartment,
      date: selectedDate === 'All' ? new Date().toISOString().split('T')[0] : selectedDate,
      timeSlot,
      doctorName,
      status: 'Waiting',
      roomNo,
      tokenNo: appointments.length + 1,
    };

    onAddAppointment(newApt);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Real-Time Clinical Queue & OPD Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Doctor consultation queues, ultrasound suites, minor procedure OT & recovery room tracking
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="2026-10-28">Today (28 Oct 2026)</option>
              <option value="2026-10-29">Tomorrow (29 Oct 2026)</option>
              <option value="2026-10-31">31 Oct 2026</option>
              <option value="All">All Scheduled Dates</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* OPD Rooms & Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">OPD Room 1</span>
            <DoorClosed className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs font-bold text-slate-900">Dr. Reena Sen</div>
          <p className="text-[11px] text-slate-500">General Gynae & ANC</p>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">OPD Room 2</span>
            <DoorClosed className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xs font-bold text-slate-900">Dr. R. Sen / Counselor</div>
          <p className="text-[11px] text-slate-500">MTP Intake & Form C</p>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">USG Suite 1</span>
            <Stethoscope className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xs font-bold text-slate-900">Dr. M. Roy (Radiology)</div>
          <p className="text-[11px] text-slate-500">Follicular Study & Pelvis</p>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Minor OT & Recovery</span>
            <Bed className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xs font-bold text-slate-900">Dr. Anand Verma</div>
          <p className="text-[11px] text-slate-500">Minilap & NSV Sterilizations</p>
        </div>
      </div>

      {/* Appointments Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 w-16">Token</th>
                <th className="px-4 py-3">Patient Name & Unique ID</th>
                <th className="px-4 py-3">Department & Service</th>
                <th className="px-4 py-3">Time Slot & Room</th>
                <th className="px-4 py-3">Attending Clinician</th>
                <th className="px-4 py-3">Queue Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No scheduled appointments for this date.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const pat = patients.find((p) => p.id === apt.patientId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 text-sm">
                        #{apt.tokenNo}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{apt.patientName}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {apt.intakeRegistrationNo} · Ph: {apt.contactNo}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-rose-700">
                          {apt.department}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{apt.timeSlot}</div>
                        <div className="text-[10px] text-slate-500">{apt.roomNo}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {apt.doctorName}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={apt.status}
                          onChange={(e) => onUpdateStatus(apt.id, e.target.value as any)}
                          className={`text-xs font-semibold rounded px-2 py-1 border transition-colors ${
                            apt.status === 'Waiting'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : apt.status === 'In Consultation'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : apt.status === 'In Procedure'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="In Procedure">In Procedure</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {pat && (
                          <button
                            onClick={() => onSelectPatient(pat)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            Open Intake
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

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Book Patient Appointment / Add to Queue
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Patient *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName} ({p.intakeRegistrationNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Clinical Department *</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                >
                  <option value="General Gynae">General Gynae</option>
                  <option value="Sterilization (Minilap / Lap / NSV)">Sterilization (Minilap / NSV)</option>
                  <option value="Medical Abortion (Form C MTP)">Medical Abortion (Form C MTP)</option>
                  <option value="Infertility Consultation">Infertility Consultation</option>
                  <option value="Peri-Menopause & Menopause">Peri-Menopause & Menopause</option>
                  <option value="Antenatal Care (ANC)">Antenatal Care (ANC)</option>
                  <option value="Surgical Procedures">Surgical Procedures</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Time Slot</label>
                  <input
                    type="time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Room / Suite</label>
                  <select
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  >
                    <option value="OPD Room 1">OPD Room 1</option>
                    <option value="OPD Room 2">OPD Room 2</option>
                    <option value="USG Suite 1">USG Suite 1</option>
                    <option value="Minor OT / Post-Op">Minor OT / Post-Op</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Attending Clinician</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold shadow-xs"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
