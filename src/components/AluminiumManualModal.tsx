import React from 'react';
import { X, Ruler, CheckCircle2, ArrowRight, Sparkles, Layers, Box, Info } from 'lucide-react';
import { AluminiumStripItem } from '../types';

interface AluminiumManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample?: (items: AluminiumStripItem[]) => void;
}

export const AluminiumManualModal: React.FC<AluminiumManualModalProps> = ({
  isOpen,
  onClose,
  onLoadExample,
}) => {
  if (!isOpen) return null;

  const handleApplyWardrobeExample = () => {
    if (onLoadExample) {
      onLoadExample([
        {
          id: `al_${Date.now()}_1`,
          label: 'Door 1 & 2 Horizontal Strips (Module 1)',
          lengthMm: 500,
          quantity: 4,
        },
        {
          id: `al_${Date.now()}_2`,
          label: 'Door 3 Vertical Strips (Module 2)',
          lengthMm: 2000,
          quantity: 2,
        },
      ]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Aluminium Strip Calculation & Placement Manual
              </h3>
              <p className="text-xs text-slate-300">
                10' (3000 mm) Stock Bar • Zero Joint Optimization Method
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Visual Wardrobe Diagram */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Visual Case Study: 3-Door Wardrobe Placement
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start">
                Door W: 500mm • Door H: 2000mm
              </span>
            </div>

            {/* Visual SVG Drawing of 3-Door Wardrobe */}
            <div className="bg-slate-900 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-inner">
              <div className="w-full max-w-lg">
                <svg
                  viewBox="0 0 540 320"
                  className="w-full h-auto drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Wardrobe Carcass */}
                  <rect
                    x="20"
                    y="20"
                    width="500"
                    height="280"
                    rx="8"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="3"
                  />

                  {/* Wardrobe Top Header Bar */}
                  <rect x="20" y="20" width="500" height="16" fill="#334155" />
                  <text x="270" y="32" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                    3-DOOR MASTER WARDROBE (TOTAL WIDTH 1500 mm × HEIGHT 2000 mm)
                  </text>

                  {/* DOOR 1 (Left): 2 Horizontal Strips */}
                  <rect
                    x="35"
                    y="45"
                    width="145"
                    height="240"
                    rx="4"
                    fill="#0f172a"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <text x="107" y="65" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    Door 1
                  </text>
                  <text x="107" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    (Width: 500 mm)
                  </text>

                  {/* Door 1 Strip 1 (Horizontal) */}
                  <rect
                    x="35"
                    y="110"
                    width="145"
                    height="8"
                    rx="2"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <text x="107" y="105" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Strip #1: 500 mm
                  </text>

                  {/* Door 1 Strip 2 (Horizontal) */}
                  <rect
                    x="35"
                    y="170"
                    width="145"
                    height="8"
                    rx="2"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <text x="107" y="165" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Strip #2: 500 mm
                  </text>

                  {/* Door 1 Handle */}
                  <rect x="168" y="135" width="4" height="40" rx="2" fill="#cbd5e1" />

                  {/* DOOR 2 (Center): 2 Horizontal Strips */}
                  <rect
                    x="195"
                    y="45"
                    width="145"
                    height="240"
                    rx="4"
                    fill="#0f172a"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <text x="267" y="65" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    Door 2
                  </text>
                  <text x="267" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    (Width: 500 mm)
                  </text>

                  {/* Door 2 Strip 1 (Horizontal) */}
                  <rect
                    x="195"
                    y="110"
                    width="145"
                    height="8"
                    rx="2"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <text x="267" y="105" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Strip #3: 500 mm
                  </text>

                  {/* Door 2 Strip 2 (Horizontal) */}
                  <rect
                    x="195"
                    y="170"
                    width="145"
                    height="8"
                    rx="2"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <text x="267" y="165" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Strip #4: 500 mm
                  </text>

                  {/* Door 2 Handle */}
                  <rect x="203" y="135" width="4" height="40" rx="2" fill="#cbd5e1" />

                  {/* DOOR 3 (Right): 2 Vertical Strips */}
                  <rect
                    x="355"
                    y="45"
                    width="145"
                    height="240"
                    rx="4"
                    fill="#0f172a"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <text x="427" y="65" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    Door 3
                  </text>
                  <text x="427" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9">
                    (Height: 2000 mm)
                  </text>

                  {/* Door 3 Strip 1 (Vertical) */}
                  <rect
                    x="385"
                    y="55"
                    width="8"
                    height="220"
                    rx="2"
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                  <text x="380" y="165" textAnchor="end" fill="#10b981" fontSize="9" fontWeight="bold">
                    Strip #5: 2000 mm
                  </text>

                  {/* Door 3 Strip 2 (Vertical) */}
                  <rect
                    x="435"
                    y="55"
                    width="8"
                    height="220"
                    rx="2"
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                  <text x="450" y="165" textAnchor="start" fill="#10b981" fontSize="9" fontWeight="bold">
                    Strip #6: 2000 mm
                  </text>

                  {/* Door 3 Handle */}
                  <rect x="363" y="135" width="4" height="40" rx="2" fill="#cbd5e1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Section 2: Input Method Steps */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                How to Add This in the Calculator
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Module 1 Box */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900">
                    Module 1: Horizontal Inlays
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-800 text-[10px] font-bold">
                    Door 1 & 2
                  </span>
                </div>
                <ul className="text-xs text-sky-950 space-y-1">
                  <li>• <strong>Length:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200">500 mm</span> (Door width)</li>
                  <li>• <strong>Quantity:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200">4 pieces</span> (2 strips × 2 doors)</li>
                  <li>• <strong>Linear Total:</strong> 2000 mm (6.67 ft)</li>
                </ul>
              </div>

              {/* Module 2 Box */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Module 2: Vertical Inlays
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    Door 3
                  </span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1">
                  <li>• <strong>Length:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">2000 mm</span> (Door height)</li>
                  <li>• <strong>Quantity:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">2 pieces</span> (2 vertical strips)</li>
                  <li>• <strong>Linear Total:</strong> 4000 mm (13.33 ft)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Stock Cutting Allocation Result */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-white">
                  Stock Bar Optimization Breakdown (Zero Scrap!)
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                100% Efficiency • 0% Wastage
              </span>
            </div>

            <div className="space-y-3">
              {/* Bar 1 */}
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Stock Bar #1 (10' / 3000 mm)
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    Used: 3000 mm • Left: 0 mm (Exact Fit)
                  </span>
                </div>
                <div className="h-6 w-full rounded bg-slate-900 border border-slate-700 flex overflow-hidden text-[10px] font-bold">
                  <div className="h-full bg-emerald-600 flex items-center justify-center text-white" style={{ width: '66.67%' }}>
                    2000 mm (Mod 2)
                  </div>
                  <div className="h-full bg-sky-500 border-l border-white/20 flex items-center justify-center text-white" style={{ width: '16.66%' }}>
                    500 mm
                  </div>
                  <div className="h-full bg-sky-600 border-l border-white/20 flex items-center justify-center text-white" style={{ width: '16.67%' }}>
                    500 mm
                  </div>
                </div>
              </div>

              {/* Bar 2 */}
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Stock Bar #2 (10' / 3000 mm)
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    Used: 3000 mm • Left: 0 mm (Exact Fit)
                  </span>
                </div>
                <div className="h-6 w-full rounded bg-slate-900 border border-slate-700 flex overflow-hidden text-[10px] font-bold">
                  <div className="h-full bg-emerald-600 flex items-center justify-center text-white" style={{ width: '66.67%' }}>
                    2000 mm (Mod 2)
                  </div>
                  <div className="h-full bg-sky-500 border-l border-white/20 flex items-center justify-center text-white" style={{ width: '16.66%' }}>
                    500 mm
                  </div>
                  <div className="h-full bg-sky-600 border-l border-white/20 flex items-center justify-center text-white" style={{ width: '16.67%' }}>
                    500 mm
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-lg text-xs text-slate-300 flex items-center justify-between">
              <span><strong>Final Procurement:</strong> Exactly <strong>2 Bars</strong> of 10' (3000 mm) standard T/U profile.</span>
              <span className="text-emerald-400 font-bold">0 Joints Required</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Clicking below will load this exact wardrobe layout directly into the calculator.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleApplyWardrobeExample}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load This Wardrobe Example</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
