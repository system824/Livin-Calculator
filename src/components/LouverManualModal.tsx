import React from 'react';
import { X, Layers, Ruler, CheckCircle2, Box, Info, Sparkles } from 'lucide-react';
import { STANDARD_LOUVER_WIDTH_MM, STANDARD_LOUVER_HEIGHT_MM } from '../utils/louverCalculator';

interface LouverManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LouverManualModal: React.FC<LouverManualModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Louver Wall Panel Calculation & Nesting Manual
              </h3>
              <p className="text-xs text-slate-300">
                300 mm × 2400 mm Standard Fluted Stock Sheet (1' × 8')
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Standard Panel Specifications */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Standard Fluted Louver Panel Specifications
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Standard Panel Width
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Interlocking tongue & groove
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 font-mono">
                  {STANDARD_LOUVER_WIDTH_MM} mm (≈ 1 ft)
                </span>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Standard Panel Height
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Standard ceiling/wall height sheet
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 font-mono">
                  {STANDARD_LOUVER_HEIGHT_MM} mm (8 ft)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Cladding Diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  How Panels Are Applied to a Wall Elevation
                </h4>
              </div>
              <span className="text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Vertical Fluted Columns
              </span>
            </div>

            {/* SVG Visual Cladding Diagram */}
            <div className="bg-slate-900 rounded-xl p-5 flex items-center justify-center">
              <svg viewBox="0 0 440 220" className="w-full max-w-md h-auto" fill="none">
                {/* Wall Carcass */}
                <rect x="20" y="20" width="400" height="180" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                
                {/* 4 Vertical 300mm Columns */}
                {/* Column 1 */}
                <rect x="40" y="35" width="70" height="150" rx="3" fill="#ea580c" fillOpacity="0.25" stroke="#f97316" strokeWidth="2" />
                <line x1="57" y1="35" x2="57" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="75" y1="35" x2="75" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="92" y1="35" x2="92" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <text x="75" y="115" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="bold">Col 1 (300mm)</text>

                {/* Column 2 */}
                <rect x="115" y="35" width="70" height="150" rx="3" fill="#ea580c" fillOpacity="0.25" stroke="#f97316" strokeWidth="2" />
                <line x1="132" y1="35" x2="132" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="150" y1="35" x2="150" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="167" y1="35" x2="167" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <text x="150" y="115" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="bold">Col 2 (300mm)</text>

                {/* Column 3 */}
                <rect x="190" y="35" width="70" height="150" rx="3" fill="#ea580c" fillOpacity="0.25" stroke="#f97316" strokeWidth="2" />
                <line x1="207" y1="35" x2="207" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="225" y1="35" x2="225" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="242" y1="35" x2="242" y2="185" stroke="#fdba74" strokeWidth="1" strokeDasharray="2 2" />
                <text x="225" y="115" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="bold">Col 3 (300mm)</text>

                {/* Column 4 (Trimmed) */}
                <rect x="265" y="35" width="45" height="150" rx="3" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2" />
                <line x1="280" y1="35" x2="280" y2="185" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="295" y1="35" x2="295" y2="185" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 2" />
                <text x="287" y="115" textAnchor="middle" fill="#bfdbfe" fontSize="8" fontWeight="bold">Trimmed</text>

                {/* Dimension Arrows */}
                <text x="180" y="210" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  Total Width = Number of 300mm Columns (Ceil(W / 300))
                </text>
              </svg>
            </div>
          </div>

          {/* Section 3: Louver Type Independence & Nesting Rules */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Independent Material Calculation & Scrap Nesting
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Independent Louver Types (No Cross-Type Scrap Mixing)</span>
                </div>
                <p className="text-slate-600 pl-5">
                  Each Louver Type represents a specific profile or finish. Wastage and scrap cut pieces are <strong>strictly reused only within the sections of that same Louver Type</strong>, ensuring color and texture consistency.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Box className="w-3.5 h-3.5 text-orange-600" />
                  <span>Height Splicing & Nesting for Wall Heights &gt; 2400 mm</span>
                </div>
                <p className="text-slate-600 pl-5">
                  For tall walls (e.g. 3000 mm), each 300 mm column uses 1 full 2400 mm uncut panel plus a 600 mm top strip. All 600 mm top strips are nested together into stock panels (up to 4 strips of 600 mm from a single 2400 mm panel with 0% scrap).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            Got It, Close Manual
          </button>
        </div>

      </div>
    </div>
  );
};
