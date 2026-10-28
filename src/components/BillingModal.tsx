/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Receipt, Printer, Check, Plus, Trash2, HeartHandshake, Tag, DollarSign } from 'lucide-react';
import { BillReceipt, PatientRecord } from '../types/clinical';
import { OFFICIAL_STREE_CLINIC_RATE_LIST, RateItem } from '../data/officialRateList';

interface BillingModalProps {
  patient: PatientRecord;
  bill?: BillReceipt;
  isOpen: boolean;
  onClose: () => void;
  onSaveBill: (bill: BillReceipt) => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  patient,
  bill,
  isOpen,
  onClose,
  onSaveBill,
}) => {
  if (!isOpen) return null;

  const isBplPatient = patient.statusAPL_BPL === 'BPL';
  const isFreeScheme = patient.sterilization?.isFreeScheme || isBplPatient;

  const defaultItems = [
    { description: 'Clinical Consultation & File Registration', amount: 350 },
    { description: 'Lab Investigations (Hb, Blood Group, Urine)', amount: 450 },
  ];

  if (patient.activeDepartments.includes('Medical Abortion (Form C MTP)')) {
    defaultItems.push({ description: 'Medical Abortion Kit & Follow-up Care (≤9 Weeks)', amount: 2600 });
  } else if (patient.activeDepartments.includes('Sterilization (Minilap / Lap / NSV)')) {
    defaultItems.push({ description: 'Sterilization Surgery & Day-Care OT', amount: 2500 });
  } else if (patient.activeDepartments.includes('Infertility Consultation')) {
    defaultItems.push({ description: 'Follicular Monitoring Ultrasound (TVS)', amount: 950 });
  }

  const [items, setItems] = useState<{ description: string; amount: number }[]>(
    bill?.items || defaultItems
  );
  const [paymentMode, setPaymentMode] = useState<BillReceipt['paymentMode']>(
    bill?.paymentMode || (isFreeScheme ? 'Govt FPIS Scheme Waiver' : 'UPI')
  );
  const [isSubsidyApplied, setIsSubsidyApplied] = useState(
    bill ? bill.discountOrSubsidy > 0 : isFreeScheme
  );
  const [selectedRateId, setSelectedRateId] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const discountOrSubsidy = isSubsidyApplied ? subtotal : 0;
  const total = subtotal - discountOrSubsidy;

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleAddFromRateList = () => {
    if (!selectedRateId) return;
    const found = OFFICIAL_STREE_CLINIC_RATE_LIST.find((r) => r.id === selectedRateId);
    if (!found) return;

    const amount = isBplPatient ? found.bplSubsidizedFeeINR : found.standardFeeINR;
    setItems([...items, { description: `${found.serviceName} (${found.code})`, amount }]);
    setSelectedRateId('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const receiptNo = bill?.receiptNo || patient.consultationReceiptNo || `CR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBill: BillReceipt = {
      id: bill?.id || `bill-${Date.now()}`,
      receiptNo,
      patientId: patient.id,
      patientName: patient.clientName,
      intakeRegistrationNo: patient.intakeRegistrationNo,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discountOrSubsidy,
      total,
      paymentMode,
      status: 'Paid',
      cashierName: 'Ramesh Chander (Accounts Desk)',
    };
    onSaveBill(newBill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Official Logo */}
        <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden border border-rose-300">
              <img 
                src="/assets/stree_clinic_logo.png" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
                }}
                alt="Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Stree Clinic Official Billing</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Receipt
                </span>
              </h3>
              <p className="text-[11px] text-rose-200">
                {patient.clientName} ({patient.intakeRegistrationNo})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Patient Status Banner */}
          {isFreeScheme && (
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2 text-emerald-800">
              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">
                BPL Beneficiary / Free Family Planning Scheme eligible (100% Fee Waiver Supported).
              </span>
            </div>
          )}

          {/* Quick Add From Official Rate List Dropdown */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              <span>Add From Official Stree Clinic Rate List:</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedRateId}
                onChange={(e) => setSelectedRateId(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="">-- Select Service / Package from Rate Card --</option>
                {OFFICIAL_STREE_CLINIC_RATE_LIST.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code}: {r.serviceName} — ₹{isBplPatient ? r.bplSubsidizedFeeINR : r.standardFeeINR}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddFromRateList}
                disabled={!selectedRateId}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-lg font-bold transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">Fee Breakdown & Line Items</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Custom Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[idx].description = e.target.value;
                      setItems(updated);
                    }}
                    placeholder="Service / Medicine description"
                    className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <span className="text-slate-400">₹</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[idx].amount = parseFloat(e.target.value) || 0;
                        setItems(updated);
                      }}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono text-right"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subsidies & Calculations */}
          <div className="border-t border-slate-200 pt-3 space-y-2 bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-slate-600">
              <span>Gross Tariff:</span>
              <span className="font-mono tabular-nums font-semibold">₹ {subtotal.toFixed(2)}</span>
            </div>

            <label className="flex items-center justify-between text-emerald-800 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={isSubsidyApplied}
                  onChange={(e) => setIsSubsidyApplied(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                Apply Parivar Seva Subsidy / FPIS 100% Waiver:
              </span>
              <span className="font-mono tabular-nums font-semibold">
                - ₹ {discountOrSubsidy.toFixed(2)}
              </span>
            </label>

            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Net Amount Due:</span>
              <span className="font-mono tabular-nums text-base text-rose-700">
                ₹ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Payment Method:
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs bg-white"
            >
              <option value="UPI">UPI / QR Code (PhonePe, GPay, Paytm)</option>
              <option value="Cash">Cash at Counter</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Govt FPIS Scheme Waiver">Govt FPIS Scheme (100% Free BPL)</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Issue Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
