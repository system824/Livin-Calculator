import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  Cloud,
  Circle,
  Move,
  CornerDownRight
} from 'lucide-react';

interface CeilingManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ManualTab = 'PRIMARY_TYPES' | 'EDGE_AND_SHAPES' | 'ELECTRICALS';

export const CeilingManualModal: React.FC<CeilingManualModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ManualTab>('PRIMARY_TYPES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ceiling & Estimation Manual
              </h2>
              <p className="text-xs text-slate-500">
                Design patterns, organic shapes (clouds/circles), edge usage & electrical rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('PRIMARY_TYPES')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'PRIMARY_TYPES'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Primary Ceiling Types</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EDGE_AND_SHAPES')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'EDGE_AND_SHAPES'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Edge, Clouds & Circles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ELECTRICALS')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'ELECTRICALS'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>3. Electricals & Adaptors</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {/* ================= TAB 1: PRIMARY CEILING TYPES ================= */}
          {activeTab === 'PRIMARY_TYPES' && (
            <div className="space-y-6">
              
              {/* Type 1: Peripheral (Only Drop) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">A</span>
                    Peripheral Ceiling (Only Peripheral Drop)
                  </span>
                  <span className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Cove Multiplier: ×2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-center">
                    <svg viewBox="0 0 160 120" className="w-full max-w-[150px] h-auto">
                      {/* Outer Room */}
                      <rect x="10" y="10" width="140" height="100" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
                      {/* Inner Recessed Slab */}
                      <rect x="30" y="30" width="100" height="60" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="80" y="63" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">RECESSED SLAB</text>
                      <text x="80" y="22" fill="#cbd5e1" fontSize="7" textAnchor="middle">Drop Band</text>
                    </svg>
                  </div>
                  <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong>How it looks:</strong> A continuous border band (e.g. 600mm / 2ft width) drops around all 4 perimeter walls. The central slab remains exposed/recessed.
                    </p>
                    <p>
                      <strong>Surface Area:</strong> Only the peripheral gypsum band is calculated (Length × Width − Inner Area).
                    </p>
                    <p>
                      <strong>Cove Calculation:</strong> Inner perimeter where strip light sits is multiplied by <strong>×2</strong> to account for the vertical fascia and the cove lip.
                    </p>
                  </div>
                </div>
              </div>

              {/* Type 2: Peripheral (With Center Covered) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">B</span>
                    Peripheral (Peripheral Drop + Center Area Covered)
                  </span>
                  <span className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Full Room Area + Cove ×2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-center">
                    <svg viewBox="0 0 160 120" className="w-full max-w-[150px] h-auto">
                      <rect x="10" y="10" width="140" height="100" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
                      <rect x="30" y="30" width="100" height="60" fill="#334155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="80" y="58" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">COVERED CENTER</text>
                      <text x="80" y="70" fill="#94a3b8" fontSize="7" textAnchor="middle">Gypsum Board Level</text>
                    </svg>
                  </div>
                  <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong>How it looks:</strong> The entire room ceiling is covered in false ceiling boards with a step drop border on the perimeter housing ambient cove lighting.
                    </p>
                    <p>
                      <strong>Surface Area:</strong> Full room area ($L \times W$).
                    </p>
                    <p>
                      <strong>Cove Calculation:</strong> Inner perimeter cove is added with <strong>×2</strong> multiplier.
                    </p>
                  </div>
                </div>
              </div>

              {/* Type 3: Island Ceiling */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">C</span>
                    Island Ceiling (Floating Centerpiece)
                  </span>
                  <span className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    With Cove (×2) / Without Cove (×1)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-center">
                    <svg viewBox="0 0 160 120" className="w-full max-w-[150px] h-auto">
                      <rect x="10" y="10" width="140" height="100" fill="#090d16" stroke="#334155" strokeWidth="1" rx="3" />
                      <rect x="35" y="30" width="90" height="60" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
                      <rect x="33" y="28" width="94" height="64" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" rx="4" />
                      <text x="80" y="63" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">FLOATING ISLAND</text>
                    </svg>
                  </div>
                  <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong>How it looks:</strong> A standalone suspended box or geometric feature hanging in the center of the ceiling.
                    </p>
                    <p>
                      <strong>With Cove:</strong> Multiplies perimeter by <strong>×2</strong> (for upward cove light washing onto the main ceiling).
                    </p>
                    <p>
                      <strong>Without Cove:</strong> Multiplies perimeter by <strong>×1</strong> (plain vertical drop fascia only).
                    </p>
                  </div>
                </div>
              </div>

              {/* Type 4: L-Shape Ceiling */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">D</span>
                    L-Shape Ceiling
                  </span>
                  <span className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    2-Wall Drop + Cove ×2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-center">
                    <svg viewBox="0 0 160 120" className="w-full max-w-[150px] h-auto">
                      <rect x="10" y="10" width="140" height="100" fill="#090d16" stroke="#334155" strokeWidth="1" rx="3" />
                      <path d="M 10 10 L 150 10 L 150 40 L 40 40 L 40 110 L 10 110 Z" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                      <path d="M 150 40 L 40 40 L 40 110" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="90" y="75" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">BASE SLAB</text>
                    </svg>
                  </div>
                  <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong>How it looks:</strong> Gypsum drop runs along 2 adjacent walls forming an 'L' contour. Ideal for dining zones or corner bed alignments.
                    </p>
                    <p>
                      <strong>Calculation:</strong> L-band surface area plus the inner L-step cove length with <strong>×2</strong> multiplier.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: EDGE, CLOUDS & CIRCLES ================= */}
          {activeTab === 'EDGE_AND_SHAPES' && (
            <div className="space-y-6">

              {/* How Edge is Used */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CornerDownRight className="w-4 h-4 text-slate-700" />
                  <span>How to Use the 'Edge' Addon</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The <strong>Edge</strong> option is designed for single linear drop runs, step profiles, and curtain pelmets.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="font-bold text-amber-800 text-xs block">
                      1. Edge (With Cove) — Multiplier ×2
                    </span>
                    <p className="text-[11px] text-slate-500">
                      • <strong>Curtain Pockets:</strong> Concealed cove running across a window wall (L = Window Wall Length) washing light down curtains.<br/>
                      • <strong>Indirect Cove Steps:</strong> A stepped recess between two ceiling heights.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="font-bold text-sky-800 text-xs block">
                      2. Edge (Without Cove) — Multiplier ×1
                    </span>
                    <p className="text-[11px] text-slate-500">
                      • <strong>Simple Pelmets:</strong> Vertical board drop to conceal curtain tracks without strip light.<br/>
                      • <strong>Bulkhead Drops:</strong> Straight vertical step downs (e.g. over AC ducts or beam wraps).
                    </p>
                  </div>
                </div>
              </div>

              {/* Organic & Geometric Shapes Guide */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-700" />
                    Estimating Organic Shapes: Clouds, Circles & Curves
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                    Bounding Box Rule
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  In interior execution, sheet materials and framing structures are budgeted using the <strong>Overall Bounding Envelope (Length × Width)</strong> because gypsum fabricators cut and frame shapes out of standard rectangular boards.
                </p>

                {/* Cloud Island Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-xs text-slate-900">
                      1. Cloud Shape Island (e.g. Kids Bedroom Feature)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-center">
                      <svg viewBox="0 0 140 90" className="w-full max-w-[130px] h-auto">
                        {/* Bounding box dashed */}
                        <rect x="10" y="10" width="120" height="70" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                        {/* Cloud Path */}
                        <path
                          d="M 35 60 A 18 18 0 0 1 50 32 A 22 22 0 0 1 85 28 A 18 18 0 0 1 110 42 A 16 16 0 0 1 112 62 A 14 14 0 0 1 35 60 Z"
                          fill="#1e293b"
                          stroke="#fbbf24"
                          strokeWidth="1.5"
                        />
                        <text x="70" y="52" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">CLOUD SHAPE</text>
                        <text x="70" y="85" fill="#94a3b8" fontSize="6" textAnchor="middle">Overall L</text>
                      </svg>
                    </div>
                    <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong>How to enter in calculator:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                        <li>Select <strong>Type: Island</strong> (with or without cove).</li>
                        <li>Measure the maximum <strong>Overall Length (L)</strong> and <strong>Overall Width (W)</strong> of the cloud envelope.</li>
                        <li>The tool calculates the surface area and perimeter based on the bounding dimension, ensuring sufficient board and framing allowance.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Circle Island Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-slate-900">
                      2. Circular / Oval Island
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-center">
                      <svg viewBox="0 0 140 90" className="w-full max-w-[130px] h-auto">
                        <rect x="25" y="10" width="90" height="70" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                        <ellipse cx="70" cy="45" rx="38" ry="28" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
                        <text x="70" y="47" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">CIRCULAR ISLAND</text>
                      </svg>
                    </div>
                    <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong>How to enter in calculator:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                        <li>Select <strong>Type: Island</strong>.</li>
                        <li>Enter Diameter as <strong>Length (L) = Diameter</strong> and <strong>Width (W) = Diameter</strong>.</li>
                        <li>If cove lighting is planned along the perimeter, select <strong>With Cove</strong>.</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB 3: ELECTRICALS MANUAL ================= */}
          {activeTab === 'ELECTRICALS' && (
            <div className="space-y-6">
              
              {/* The Rule Box */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <span>The Continuous Run Rule (1 Adaptor / 15 Feet)</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  For every continuous strip light run, exactly <strong>1 LED power adaptor/driver is required for every 15 feet</strong> of strip (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 font-semibold text-amber-900">ceil(run_length / 15)</code>).
                </p>
              </div>

              {/* Why Continuous Runs Matter */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Why Disconnected Sections Calculate Separately
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An adaptor cannot jump across open space between physically separate ceiling elements (e.g. a peripheral wall cove and a center floating island). Each independent cove run requires its own dedicated driver unit wired to the local power point.
                </p>

                {/* Step-by-step example diagram */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-xs text-slate-800 block">
                    Worked Calculation Example:
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <strong>Primary Peripheral Cove:</strong> 35 ft continuous perimeter
                      </div>
                      <div className="font-mono font-bold text-slate-800">
                        ceil(35 / 15) = <span className="text-amber-700">3 Adaptors</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <strong>Extra Island Cove:</strong> 20 ft continuous perimeter
                      </div>
                      <div className="font-mono font-bold text-slate-800">
                        ceil(20 / 15) = <span className="text-amber-700">2 Adaptors</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <strong>Curtain Pocket Edge:</strong> 8 ft continuous edge
                      </div>
                      <div className="font-mono font-bold text-slate-800">
                        ceil(8 / 15) = <span className="text-amber-700">1 Adaptor</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 font-bold text-amber-900">
                      <span>Total Adaptors Needed:</span>
                      <span className="font-mono text-sm">3 + 2 + 1 = 6 Nos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Standard Strip Length:</strong> Standard LED strip rolls are supplied in 5-meter (16.4 ft) rolls. Sizing drivers at 1 per 15 ft ensures optimal voltage drop performance with zero dimming along the tail end.
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            Got it, Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
