/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  Package, 
  Layers, 
  DollarSign, 
  ShieldAlert,
  Save,
  X
} from 'lucide-react';
import { PharmacyStockItem, UserAccount } from '../types/clinical';

interface PharmacyStockMasterProps {
  currentBranch: string;
  currentUser: UserAccount;
  stockItems: PharmacyStockItem[];
  onAddStockItem: (item: PharmacyStockItem) => void;
  onUpdateStockItem: (item: PharmacyStockItem) => void;
  onDeleteStockItem: (itemId: string) => void;
}

export const PharmacyStockMaster: React.FC<PharmacyStockMasterProps> = ({
  currentBranch,
  currentUser,
  stockItems,
  onAddStockItem,
  onUpdateStockItem,
  onDeleteStockItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PharmacyStockItem | null>(null);

  // Form draft state for new or edited item
  const [formData, setFormData] = useState<Partial<PharmacyStockItem>>({
    branch: currentBranch,
    category: 'Uterotonic',
    dosageForm: 'Tablet',
    currentStock: 100,
    minThreshold: 20,
    unitPrice: 50,
  });

  // Filter stock strictly by current branch database
  const branchStock = stockItems.filter((item) => item.branch === currentBranch);

  const filteredItems = branchStock.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.medicineName.toLowerCase().includes(q) ||
      item.genericName.toLowerCase().includes(q) ||
      item.batchNo.toLowerCase().includes(q);

    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = branchStock.filter((i) => i.currentStock <= i.minThreshold).length;
  const totalStockUnits = branchStock.reduce((acc, i) => acc + i.currentStock, 0);
  const totalStockValue = branchStock.reduce((acc, i) => acc + i.currentStock * i.unitPrice, 0);

  const handleOpenAdd = () => {
    setFormData({
      branch: currentBranch,
      medicineName: '',
      genericName: '',
      category: 'Uterotonic',
      dosageForm: 'Tablet',
      strength: '',
      batchNo: `BT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2028-06-30',
      currentStock: 100,
      minThreshold: 20,
      unitPrice: 25,
      manufacturer: 'Reputed Pharma / Cadila',
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: PharmacyStockItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicineName) return;

    if (editingItem) {
      onUpdateStockItem({
        ...(editingItem as PharmacyStockItem),
        ...formData,
      } as PharmacyStockItem);
    } else {
      const newItem: PharmacyStockItem = {
        id: `stk-${Date.now()}`,
        branch: currentBranch,
        medicineName: formData.medicineName || '',
        genericName: formData.genericName || formData.medicineName || '',
        category: (formData.category as any) || 'Uterotonic',
        dosageForm: (formData.dosageForm as any) || 'Tablet',
        strength: formData.strength || '',
        batchNo: formData.batchNo || `BT-${Date.now().toString().slice(-4)}`,
        expiryDate: formData.expiryDate || '2028-12-31',
        currentStock: Number(formData.currentStock) || 0,
        minThreshold: Number(formData.minThreshold) || 10,
        unitPrice: Number(formData.unitPrice) || 0,
        manufacturer: formData.manufacturer || 'Cadila / Cipla',
      };
      onAddStockItem(newItem);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // Quick adjustment (+10 / -10)
  const handleQuickAdjust = (item: PharmacyStockItem, delta: number) => {
    const updated = Math.max(0, item.currentStock + delta);
    onUpdateStockItem({ ...item, currentStock: updated });
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-rose-600 font-bold">
              Pharmacy & Medication Master
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">{currentBranch}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Stock Inventory of Drugs & Medicines
          </h2>
          <p className="text-xs text-slate-500">
            Master stock manager: add new drug items, edit quantities, monitor reorder thresholds, and track expiry dates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Active SKUs</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {branchStock.length}
          </div>
          <p className="text-[11px] text-slate-400">Items cataloged</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Units in Stock</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {totalStockUnits.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Doses & vials</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Below Reorder Level</span>
          <div className={`text-2xl font-bold tabular-nums mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {lowStockCount}
          </div>
          <p className="text-[11px] text-slate-400">Reorder needed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Inventory Valuation</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            ₹ {totalStockValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">At clinic cost price</p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by drug name, generic, or batch..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="All">All Categories</option>
            <option value="Uterotonic">Uterotonic (MTP / Bleeding)</option>
            <option value="Antibiotic">Antibiotics</option>
            <option value="Analgesic">Analgesic / Spasmolytic</option>
            <option value="Anesthesia">Anesthesia (Lignocaine)</option>
            <option value="Antacid">Antacids</option>
            <option value="Hormone">Hormones / Infertility</option>
            <option value="Contraceptive">Contraceptives</option>
          </select>
        </div>
      </div>

      {/* Inventory Master Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Medicine / Generic Name</th>
                <th className="px-4 py-3">Category & Form</th>
                <th className="px-4 py-3 font-mono">Batch / Expiry</th>
                <th className="px-4 py-3 text-center">In Stock</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3 text-center">Quick Adjust</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No matching medicine stock items found in this clinic location.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs">
                          {item.medicineName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.genericName} · {item.strength}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Mfr: {item.manufacturer || 'Cipla / Zydus'}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">{item.category}</span>
                        <span className="text-[10px] text-slate-400">{item.dosageForm}</span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                        <div>{item.batchNo}</div>
                        <div className="text-[10px] text-slate-400">Exp: {item.expiryDate}</div>
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                            isLow
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {item.currentStock}
                        </span>
                        {isLow && (
                          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                            Min: {item.minThreshold}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        ₹ {item.unitPrice}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(item, 10)}
                          title="Add 10 units"
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded border border-emerald-200 text-xs"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(item, -1)}
                          title="Dispense 1 unit"
                          className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded border border-rose-200 text-xs"
                        >
                          -1
                        </button>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors inline-flex items-center"
                          title="Edit stock master"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStockItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors inline-flex items-center"
                          title="Delete from stock"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Medicine Stock Master' : 'Add New Drug to Stock Inventory'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Medicine Brand Name & Strength *</label>
                <input
                  type="text"
                  required
                  value={formData.medicineName || ''}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  placeholder="e.g. Tab Mifepristone 200mg"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Generic Name</label>
                  <input
                    type="text"
                    value={formData.genericName || ''}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Mifepristone"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category || 'Uterotonic'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  >
                    <option value="Uterotonic">Uterotonic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Anesthesia">Anesthesia</option>
                    <option value="Antacid">Antacid</option>
                    <option value="Hormone">Hormone</option>
                    <option value="Contraceptive">Contraceptive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm || 'Tablet'}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Gel">Gel</option>
                    <option value="Syrup">Syrup</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={formData.batchNo || ''}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <label className="font-semibold block mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g. Cadila Healthcare / Cipla"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs"
                >
                  {editingItem ? 'Save Updates' : 'Add to Master Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
