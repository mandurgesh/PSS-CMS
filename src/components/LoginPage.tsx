/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2,
  Stethoscope,
  Pill,
  Users
} from 'lucide-react';
import { UserAccount } from '../types/clinical';
import { INITIAL_USER_ACCOUNTS } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount, branch: string) => void;
  availableBranches: string[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  availableBranches,
}) => {
  const [username, setUsername] = useState('dr.jaipur');
  const [password, setPassword] = useState('Jaipur@1978');
  const [selectedBranch, setSelectedBranch] = useState('Stree Clinic - Jaipur MI Road');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const found = INITIAL_USER_ACCOUNTS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('Invalid User ID. Please check the credential guide below.');
      return;
    }

    if (found.password !== password) {
      setErrorMsg('Incorrect password. Please verify the credentials list.');
      return;
    }

    onLoginSuccess(found, selectedBranch);
  };

  const handleQuickFill = (acc: UserAccount) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setSelectedBranch(acc.branch);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header with Extra Large Official Logo & Ambient Glow */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative inline-block mb-4">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 rounded-3xl blur-md opacity-70 animate-pulse" />
          <div className="relative w-24 h-24 mx-auto rounded-2xl bg-white p-2.5 shadow-2xl border-2 border-rose-300 flex items-center justify-center overflow-hidden">
            <img 
              src="/assets/stree_clinic_logo.png" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://cdn.prod.website-files.com/67fe07903b9b738d99659890/69527593a6f9f41f59e4721a_Stree%20clinic%20logo%20SMALL%20SIZE.png';
              }}
              alt="Parivar Seva Sanstha Stree Clinic Official Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Stree Clinic
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mt-1">
          Parivar Seva Sanstha · Estd. 1978 · Health for Bharat
        </p>
        <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
          Hospital Information & Clinical Management System · streeclinic.com
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-200 sm:px-10">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Authorized Clinical Sign-In
              </h2>
              <p className="text-xs text-slate-500">
                Location-segregated clinical database access
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HIPAA Encrypted</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="font-bold text-rose-600">✕</button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            
            {/* Location Selector: Segregates database per location */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Select Clinic Location (Separate Local Database) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-rose-600" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {availableBranches.map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                When opened for Jaipur, only Jaipur records, prescriptions, and inventory will be active.
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">User ID / Username *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User ID (e.g. dr.jaipur)"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Password *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>Access Clinic Database</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Pre-Provided Credentials Master Directory */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Authorized User IDs & Passwords
              </span>
              <span className="text-[10px] text-slate-500">Click to autofill</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {INITIAL_USER_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => handleQuickFill(acc)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50/60 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      {acc.displayName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {acc.role} · <span className="font-semibold text-rose-700">{acc.branch.split(' - ')[1]}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-700 space-x-2">
                      <span>ID: <strong className="text-slate-900">{acc.username}</strong></span>
                      <span>·</span>
                      <span>Pass: <strong className="text-slate-900">{acc.password}</strong></span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 hover:underline">
                    Use →
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Legal notice */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          Strictly for authorized healthcare providers under Parivar Seva Sanstha · All access is monitored via HIPAA Audit Trail
        </p>
      </div>

    </div>
  );
};
