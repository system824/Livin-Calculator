import React from 'react';
import { X, Frame, Scissors, Layers, CheckCircle2, Info, Sparkles, Box } from 'lucide-react';
import { STANDARD_MOLDING_SIZES } from '../utils/moldingCalculator';

interface MoldingManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoldingManualModal: React.FC<MoldingManualModalProps> = ({
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
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Frame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                PVC Moulding & Frame Design Manual
              </h3>
              <p className="text-xs text-slate-300">
                8' (2400 mm) Stock Bar • Double Box Frames & Slat Joint Rules
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
          
          {/* Section 1: Standard Profiles Catalog */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Standard Profile Widths & Catalog Codes
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {STANDARD_MOLDING_SIZES.map((sz) => (
                <div key={sz.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      {sz.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard Bar: 8' (2400 mm)
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 font-mono">
                    {sz.widthMm} mm
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Visual Frame Anatomy Diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Double Box Frame Geometry & Offset Rule
                </h4>
              </div>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Standard Offset: 75 mm
              </span>
            </div>

            {/* SVG Visual Illustration of Double Frame */}
            <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 240" className="w-full max-w-md h-auto" fill="none">
                {/* Wall Background */}
                <rect x="10" y="10" width="380" height="220" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                {/* Outer Box Frame */}
                <rect
                  x="50"
                  y="30"
                  width="300"
                  height="180"
                  rx="2"
                  fill="#78350f"
                  fillOpacity="0.2"
                  stroke="#fbbf24"
                  strokeWidth="4"
                />
                <text x="200" y="48" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">
                  OUTER FRAME (e.g. 30mm Profile W201 / W202) • Width (W) × Height (H)
                </text>

                {/* Inner Box Frame */}
                <rect
                  x="85"
                  y="60"
                  width="230"
                  height="120"
                  rx="2"
                  fill="#0369a1"
                  fillOpacity="0.25"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
                <text x="200" y="125" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">
                  INNER FRAME (e.g. 22mm Profile W101 / W102)
                </text>
                <text x="200" y="140" textAnchor="middle" fill="#7dd3fc" fontSize="9">
                  (W - 2×Offset) × (H - 2×Offset)
                </text>

                {/* 75mm Offset Indicator */}
                <line x1="50" y1="120" x2="85" y2="120" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                <text x="67" y="115" textAnchor="middle" fill="#fda4af" fontSize="8" fontWeight="bold">
                  75mm Gap
                </text>

                {/* 45 Degree Corner Mitres */}
                <line x1="50" y1="30" x2="60" y2="40" stroke="#fef08a" strokeWidth="2" />
                <line x1="350" y1="30" x2="340" y2="40" stroke="#fef08a" strokeWidth="2" />
                <line x1="50" y1="210" x2="60" y2="200" stroke="#fef08a" strokeWidth="2" />
                <line x1="350" y1="210" x2="340" y2="200" stroke="#fef08a" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Section 3: Cutting Rules & Wastage */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Cutting Logic, Joint Rules & +10% Site Wastage
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Joint Rule for Pieces ≤ 2400 mm (8 ft)</span>
                </div>
                <p className="text-slate-600 pl-5">
                  Any individual frame rail or slat under 2400 mm is strictly cut from a continuous stock bar segment with <strong>zero visible intermediate joins</strong> on the wall face.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Splicing for Oversized Slats &gt; 2400 mm (e.g. 2900 mm Wall Heights)</span>
                </div>
                <p className="text-slate-600 pl-5">
                  When a vertical or horizontal slat exceeds 2400 mm, it uses full 2400 mm bars plus a nested tail cut (e.g. a 2900 mm slat = one full 2400 mm bar + one 500 mm piece nested from available stock offcuts).
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Fixed +10% Site Wastage Buffer</span>
                </div>
                <p className="text-emerald-900 pl-5 text-[11px]">
                  All PVC moulding procurement automatically includes a fixed 10% addition over raw stock bars to safely cover 45-degree angle corner mitring, blade kerf cuts, and installation offcuts.
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
