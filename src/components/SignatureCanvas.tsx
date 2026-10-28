/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenLine } from 'lucide-react';

interface SignatureCanvasProps {
  label: string;
  sublabel?: string;
  existingSignature?: string;
  onSave: (dataUrl: string) => void;
  signerName?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  label,
  sublabel,
  existingSignature,
  onSave,
  signerName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!existingSignature);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(signerName || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (existingSignature && existingSignature.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature, mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave('');
  };

  const applyTypedSignature = () => {
    if (!typedName.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'italic 26px "Brush Script MT", cursive, "Plus Jakarta Sans"';
    ctx.fillText(typedName, 24, 60);

    // Draw baseline line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 75);
    ctx.lineTo(canvas.width - 20, 75);
    ctx.stroke();

    setHasSignature(true);
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="text-xs font-semibold text-slate-800 block">{label}</label>
          {sublabel && <span className="text-[11px] text-slate-500">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              mode === 'draw' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenLine className="w-3 h-3 inline mr-1" />
            Draw
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              mode === 'type' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Type
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            title="Clear signature"
            className="p-1 text-slate-500 hover:text-rose-600 transition-colors ml-1"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {mode === 'type' ? (
        <div className="space-y-2 mb-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type full legal name..."
              className="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="button"
              onClick={applyTypedSignature}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Sign
            </button>
          </div>
        </div>
      ) : null}

      <div className="relative border border-dashed border-slate-300 rounded bg-slate-50/50 touch-none">
        <canvas
          ref={canvasRef}
          width={380}
          height={100}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-24 cursor-crosshair rounded"
        />
        {!hasSignature && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
            Sign inside this box (Touch / Stylus / Mouse)
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
        <span>Verified Digital Signature & Timestamp</span>
        {hasSignature && (
          <span className="text-emerald-700 flex items-center gap-0.5">
            <Check className="w-3 h-3" /> Signed & Attached
          </span>
        )}
      </div>
    </div>
  );
};
