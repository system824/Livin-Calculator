import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  CornerDownRight,
  MinusCircle,
  Compass,
  Maximize2,
  Minimize2,
  Square,
  Sliders,
  Eye,
  Info
} from 'lucide-react';

interface CeilingManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ManualTab = 'CEILING_DESIGNS' | 'EDGE_AND_SHAPES' | 'REDUCTIONS' | 'ELECTRICALS';
type CeilingDesignType = 'ONLY_PERIPHERAL' | 'FULL_WITH_PERIPHERAL' | 'ISLAND_COVE' | 'ISLAND_NO_COVE' | 'L_SHAPE';

export const CeilingManualModal: React.FC<CeilingManualModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ManualTab>('CEILING_DESIGNS');
  const [activeDesign, setActiveDesign] = useState<CeilingDesignType>('ONLY_PERIPHERAL');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  False Ceiling Manual & Design Visualizer
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  LIVIN INTERIORS SPEC
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visual demonstration with plan views & cross-sections for all standard false ceiling types
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-6 pt-2 gap-1.5 text-xs font-semibold overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab('CEILING_DESIGNS')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'CEILING_DESIGNS'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>1. Ceiling Types & Cross-Sections</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EDGE_AND_SHAPES')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'EDGE_AND_SHAPES'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>2. Edge & Pelmet Addons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REDUCTIONS')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'REDUCTIONS'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MinusCircle className="w-4 h-4 text-rose-600" />
            <span>3. Reductions & Deductions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ELECTRICALS')}
            className={`pb-2.5 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'ELECTRICALS'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>4. Electricals (15m Driver Rule)</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {/* ================= TAB 1: CEILING TYPES & CROSS SECTIONS ================= */}
          {activeTab === 'CEILING_DESIGNS' && (
            <div className="space-y-6">
              
              {/* Type Switcher Buttons */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setActiveDesign('ONLY_PERIPHERAL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDesign === 'ONLY_PERIPHERAL'
                      ? 'bg-white text-teal-800 shadow-xs border border-teal-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Only Peripheral Ceiling
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDesign('FULL_WITH_PERIPHERAL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDesign === 'FULL_WITH_PERIPHERAL'
                      ? 'bg-white text-indigo-800 shadow-xs border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Full Ceiling with Peripheral
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDesign('ISLAND_COVE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDesign === 'ISLAND_COVE'
                      ? 'bg-white text-amber-800 shadow-xs border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Island Ceiling (With Cove)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDesign('ISLAND_NO_COVE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDesign === 'ISLAND_NO_COVE'
                      ? 'bg-white text-sky-800 shadow-xs border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4. Island Ceiling (Without Cove)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDesign('L_SHAPE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeDesign === 'L_SHAPE'
                      ? 'bg-white text-purple-800 shadow-xs border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5. L-Shape Ceiling
                </button>
              </div>

              {/* Shared SVG Defs container */}
              <svg className="hidden">
                <defs>
                  <linearGradient id="warmLightCove" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="warmLightLeft" x1="1" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                  <pattern id="concreteHatchGlobal" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M0,8 l8,-8 M-2,2 l4,-4 M6,10 l4,-4" stroke="#475569" strokeWidth="0.75" />
                  </pattern>
                </defs>
              </svg>

              {/* ---------------- 1. ONLY PERIPHERAL CEILING ---------------- */}
              {activeDesign === 'ONLY_PERIPHERAL' && (
                <div className="p-5 rounded-2xl border border-teal-200 bg-white shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-teal-700 text-white font-bold text-[10px]">
                          TYPE 1
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Only Peripheral False Ceiling (Perimeter Drop with Exposed RCC Slab)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Gypsum false ceiling is installed <strong>only along the room borders</strong>. The center ceiling remains the original bare RCC roof slab.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto shrink-0">
                      Standard Cost-Effective Choice
                    </span>
                  </div>

                  {/* Dual Demonstration: Plan View & Cross Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Plan View (Top View) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-teal-400" /> Plan View (Top Looking Up)
                      </span>
                      <svg viewBox="0 0 240 160" className="w-full max-w-[220px] h-auto">
                        {/* Outer Room Walls */}
                        <rect x="10" y="10" width="220" height="140" fill="#0f172a" stroke="#475569" strokeWidth="2" rx="4" />
                        
                        {/* Peripheral Drop Band (Teal/Dark Blue) */}
                        <rect x="10" y="10" width="220" height="140" fill="#1e293b" />
                        
                        {/* Recessed Center Original RCC Slab */}
                        <rect x="50" y="40" width="140" height="80" fill="#020617" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" rx="2" />
                        
                        {/* Ambient Cove Glow inside recess */}
                        <rect x="52" y="42" width="136" height="76" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.4" />

                        {/* Spotlights in the dropped band */}
                        <circle cx="30" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="120" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="210" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="30" cy="135" r="3" fill="#38bdf8" />
                        <circle cx="120" cy="135" r="3" fill="#38bdf8" />
                        <circle cx="210" cy="135" r="3" fill="#38bdf8" />
                        <circle cx="30" cy="80" r="3" fill="#38bdf8" />
                        <circle cx="210" cy="80" r="3" fill="#38bdf8" />

                        {/* Labels */}
                        <text x="120" y="76" fill="#f8fafc" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          ORIGINAL RCC SLAB
                        </text>
                        <text x="120" y="88" fill="#94a3b8" fontSize="7" textAnchor="middle">
                          (No Gypsum Board in Center)
                        </text>
                        <text x="120" y="100" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">
                          ✨ 4-Sided Cove Light
                        </text>
                        <text x="120" y="28" fill="#38bdf8" fontSize="6.5" textAnchor="middle">
                          Dropped Border Band (e.g. 450 - 600 mm)
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Center is bare slab • Border houses spotlights & cove</span>
                    </div>

                    {/* Architectural Cross Section (Side Elevation) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-teal-400" /> Architectural Cross-Section
                      </span>
                      <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-auto">
                        {/* RCC Roof Slab at Top */}
                        <rect x="5" y="10" width="250" height="20" fill="#334155" />
                        <rect x="5" y="10" width="250" height="20" fill="url(#concreteHatchGlobal)" />
                        <text x="130" y="24" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">
                          ORIGINAL RCC ROOF SLAB (TOP)
                        </text>

                        {/* Left Wall & Right Wall */}
                        <rect x="5" y="30" width="16" height="120" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                        <rect x="239" y="30" width="16" height="120" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                        {/* Left Dropped Gypsum Board Soffit */}
                        <rect x="21" y="110" width="55" height="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="1" />
                        {/* Left Fascia Drop */}
                        <rect x="71" y="65" width="6" height="45" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        {/* Left Cove Lip */}
                        <rect x="63" y="60" width="8" height="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx="67" cy="65" r="2.5" fill="#f59e0b" />
                        {/* Left Light Wash Beam */}
                        <polygon points="67,62 125,30 115,50" fill="url(#warmLightCove)" />

                        {/* Right Dropped Gypsum Board Soffit */}
                        <rect x="184" y="110" width="55" height="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="1" />
                        {/* Right Fascia Drop */}
                        <rect x="183" y="65" width="6" height="45" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        {/* Right Cove Lip */}
                        <rect x="189" y="60" width="8" height="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx="193" cy="65" r="2.5" fill="#f59e0b" />
                        {/* Right Light Wash Beam */}
                        <polygon points="193,62 135,30 145,50" fill="url(#warmLightLeft)" />

                        {/* Center Exposed Slab Label */}
                        <text x="130" y="65" fill="#f8fafc" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          OPEN / RECESSED RCC SLAB
                        </text>
                        <text x="130" y="78" fill="#fbbf24" fontSize="6.5" textAnchor="middle">
                          ✨ Ambient Cove Wash onto Slab
                        </text>
                        <text x="130" y="130" fill="#94a3b8" fontSize="7" textAnchor="middle">
                          Room Center (Clear Height Preserved)
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Center ceiling slab is exposed • Light casts inward onto ceiling</span>
                    </div>

                  </div>

                  {/* Calculation Rules Summary */}
                  <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 text-xs space-y-1.5">
                    <strong className="text-teal-950 font-bold block">Calculation Formula:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-teal-900 font-mono text-[11px]">
                      <div>• Surface Area = <strong>Gross Room Area - Central Void Area</strong></div>
                      <div>• Inner Step Run = <strong>Inner Recess Perimeter</strong></div>
                      <div>• Cove Multiplier = <strong>×2 (with cove)</strong> or <strong>×1 (without cove)</strong></div>
                      <div>• Advantage: <strong>Maximum room height preserved in center</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 2. FULL CEILING WITH PERIPHERAL ---------------- */}
              {activeDesign === 'FULL_WITH_PERIPHERAL' && (
                <div className="p-5 rounded-2xl border border-indigo-200 bg-white shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-700 text-white font-bold text-[10px]">
                          TYPE 2
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Full False Ceiling with Peripheral Step (2-Level Stepped Ceiling)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        The entire room ceiling is covered with a base false ceiling (Level 1), plus an additional dropped peripheral border (Level 2) with cove lighting.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto shrink-0">
                      Premium 2-Level Finish
                    </span>
                  </div>

                  {/* Dual Demonstration: Plan View & Cross Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Plan View (Top View) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" /> Plan View (Top Looking Up)
                      </span>
                      <svg viewBox="0 0 240 160" className="w-full max-w-[220px] h-auto">
                        <rect x="10" y="10" width="220" height="140" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="4" />
                        
                        {/* Base False Ceiling (Level 1 in Center) */}
                        <rect x="50" y="40" width="140" height="80" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" rx="2" />
                        
                        {/* Center Fan / Magnetic Track */}
                        <circle cx="120" cy="80" r="10" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="80" y1="80" x2="160" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />

                        {/* Spotlights in Dropped Peripheral Level 2 */}
                        <circle cx="30" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="120" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="210" cy="25" r="3" fill="#38bdf8" />
                        <circle cx="30" cy="135" r="3" fill="#38bdf8" />
                        <circle cx="120" cy="135" r="3" fill="#38bdf8" />
                        <circle cx="210" cy="135" r="3" fill="#38bdf8" />

                        <text x="120" y="65" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          LEVEL 1: BASE FALSE CEILING
                        </text>
                        <text x="120" y="105" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">
                          ✨ Cove onto Level 1 Board
                        </text>
                        <text x="120" y="27" fill="#818cf8" fontSize="6.5" textAnchor="middle">
                          Level 2: Extra Dropped Border
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">100% board coverage + stepped border drop</span>
                    </div>

                    {/* Architectural Cross Section (Side Elevation) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-indigo-400" /> Architectural Cross-Section
                      </span>
                      <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-auto">
                        {/* RCC Roof Slab at Top */}
                        <rect x="5" y="10" width="250" height="16" fill="#334155" />
                        <rect x="5" y="10" width="250" height="16" fill="url(#concreteHatchGlobal)" />

                        {/* Perimeter Walls */}
                        <rect x="5" y="26" width="16" height="124" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                        <rect x="239" y="26" width="16" height="124" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                        {/* LEVEL 1: Continuous Base False Ceiling spanning full room */}
                        <rect x="21" y="55" width="218" height="7" fill="#475569" stroke="#94a3b8" strokeWidth="1" rx="1" />
                        <text x="130" y="50" fill="#cbd5e1" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          LEVEL 1: BASE FALSE CEILING (Full Coverage)
                        </text>

                        {/* LEVEL 2: Dropped Peripheral Soffit Left */}
                        <rect x="21" y="115" width="55" height="8" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" rx="1" />
                        <rect x="71" y="80" width="6" height="38" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" />
                        <rect x="63" y="75" width="8" height="10" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" />
                        <circle cx="67" cy="79" r="2.5" fill="#f59e0b" />
                        <polygon points="67,76 125,58 115,70" fill="url(#warmLightCove)" />

                        {/* LEVEL 2: Dropped Peripheral Soffit Right */}
                        <rect x="184" y="115" width="55" height="8" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" rx="1" />
                        <rect x="183" y="80" width="6" height="38" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" />
                        <rect x="189" y="75" width="8" height="10" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1" />
                        <circle cx="193" cy="79" r="2.5" fill="#f59e0b" />
                        <polygon points="193,76 135,58 145,70" fill="url(#warmLightLeft)" />

                        <text x="130" y="85" fill="#f8fafc" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          Concealed Wiring & AC Duct Space
                        </text>
                        <text x="130" y="135" fill="#a5b4fc" fontSize="7" textAnchor="middle">
                          Level 2: Extra Dropped Perimeter Fascia
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Entire ceiling is flat board + an extra step dropped on edges</span>
                    </div>

                  </div>

                  {/* Calculation Rules Summary */}
                  <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 text-xs space-y-1.5">
                    <strong className="text-indigo-950 font-bold block">Calculation Formula:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-indigo-900 font-mono text-[11px]">
                      <div>• Base Area = <strong>Full Room Gross Area (L × W)</strong></div>
                      <div>• Level 2 Drop = <strong>Peripheral Band Area + Edge Multiplier</strong></div>
                      <div>• Total Gypsum = <strong>Base Area + Peripheral Addon Area</strong></div>
                      <div>• Advantage: <strong>Seamlessly hides all overhead beams & pipes</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 3. ISLAND CEILING (WITH COVE) ---------------- */}
              {activeDesign === 'ISLAND_COVE' && (
                <div className="p-5 rounded-2xl border border-amber-200 bg-white shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-700 text-white font-bold text-[10px]">
                          TYPE 3
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Floating Island Ceiling — With Cove (Indirect Ambient Halo)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        A suspended central geometric island with an upward cove light trough casting a glowing halo outward onto the ceiling.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto shrink-0">
                      Multiplier: ×2 (With Cove)
                    </span>
                  </div>

                  {/* Dual Demonstration: Plan View & Cross Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Plan View */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-400" /> Plan View (Top Looking Up)
                      </span>
                      <svg viewBox="0 0 240 160" className="w-full max-w-[220px] h-auto">
                        <rect x="10" y="10" width="220" height="140" fill="#020617" stroke="#334155" strokeWidth="2" rx="4" />
                        
                        {/* Outer Glowing Halo Beam around Island */}
                        <rect x="42" y="32" width="156" height="96" fill="none" stroke="#f59e0b" strokeWidth="4" strokeOpacity="0.4" rx="4" />
                        
                        {/* Center Floating Island */}
                        <rect x="50" y="40" width="140" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="3" />

                        {/* Chandelier / Pendant Light in Center */}
                        <circle cx="120" cy="80" r="12" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
                        <text x="120" y="83" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                          LIGHT
                        </text>

                        {/* Spotlights inside Island */}
                        <circle cx="70" cy="60" r="2.5" fill="#38bdf8" />
                        <circle cx="170" cy="60" r="2.5" fill="#38bdf8" />
                        <circle cx="70" cy="100" r="2.5" fill="#38bdf8" />
                        <circle cx="170" cy="100" r="2.5" fill="#38bdf8" />

                        <text x="120" y="55" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          FLOATING ISLAND
                        </text>
                        <text x="120" y="110" fill="#fbbf24" fontSize="7" textAnchor="middle">
                          ✨ 360° Outward Halo Glow
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Center island floats with light spilling outward</span>
                    </div>

                    {/* Architectural Cross Section */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-400" /> Architectural Cross-Section
                      </span>
                      <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-auto">
                        {/* RCC Roof Slab */}
                        <rect x="5" y="10" width="250" height="18" fill="#334155" />
                        <rect x="5" y="10" width="250" height="18" fill="url(#concreteHatchGlobal)" />

                        {/* Walls */}
                        <rect x="5" y="28" width="16" height="122" fill="#1e293b" />
                        <rect x="239" y="28" width="16" height="122" fill="#1e293b" />

                        {/* Suspension Hangers */}
                        <line x1="80" y1="28" x2="80" y2="95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
                        <line x1="180" y1="28" x2="180" y2="95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />

                        {/* Floating Island Bottom Soffit Board */}
                        <rect x="65" y="95" width="130" height="9" fill="#d97706" stroke="#fbbf24" strokeWidth="1" rx="1" />
                        
                        {/* Left Vertical Fascia & Cove Lip (Outward facing) */}
                        <rect x="65" y="65" width="6" height="30" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                        <rect x="57" y="60" width="8" height="12" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                        <circle cx="61" cy="66" r="2.5" fill="#fef08a" />
                        <polygon points="61,63 15,30 25,50" fill="url(#warmLightLeft)" />

                        {/* Right Vertical Fascia & Cove Lip (Outward facing) */}
                        <rect x="189" y="65" width="6" height="30" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                        <rect x="195" y="60" width="8" height="12" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                        <circle cx="199" cy="66" r="2.5" fill="#fef08a" />
                        <polygon points="199,63 245,30 235,50" fill="url(#warmLightCove)" />

                        <text x="130" y="80" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          SUSPENDED ISLAND
                        </text>
                        <text x="130" y="118" fill="#fef08a" fontSize="7" textAnchor="middle">
                          Multiplier = Perimeter × 2 (Vertical Fascia + Cove Lip)
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Trough points outward, bathing the slab in indirect light</span>
                    </div>

                  </div>

                  {/* Calculation Rules Summary */}
                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
                    <strong className="text-amber-950 font-bold block">Calculation Formula:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-900 font-mono text-[11px]">
                      <div>• Surface Area = <strong>Island Length × Island Width</strong></div>
                      <div>• Perimeter Step = <strong>2 × (Island Length + Island Width)</strong></div>
                      <div>• Total Quantity = <strong>Surface Area + (Perimeter × 2)</strong></div>
                      <div>• LED Strip = <strong>1 Continuous Driver per 15 Meters</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 4. ISLAND CEILING (WITHOUT COVE) ---------------- */}
              {activeDesign === 'ISLAND_NO_COVE' && (
                <div className="p-5 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-sky-700 text-white font-bold text-[10px]">
                          TYPE 4
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Floating Island Ceiling — Without Cove (Sharp Modern Step Box)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        A solid geometric box suspended in center with direct downlights. Features a clean, sharp vertical drop without hidden LED light channels.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto shrink-0">
                      Multiplier: ×1 (Without Cove)
                    </span>
                  </div>

                  {/* Dual Demonstration: Plan View & Cross Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Plan View */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-sky-400" /> Plan View (Top Looking Up)
                      </span>
                      <svg viewBox="0 0 240 160" className="w-full max-w-[220px] h-auto">
                        <rect x="10" y="10" width="220" height="140" fill="#020617" stroke="#334155" strokeWidth="2" rx="4" />
                        
                        {/* Center Box Island with crisp solid border */}
                        <rect x="50" y="40" width="140" height="80" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="2" />

                        {/* Spotlights grid */}
                        <circle cx="75" cy="60" r="3.5" fill="#38bdf8" />
                        <circle cx="120" cy="60" r="3.5" fill="#38bdf8" />
                        <circle cx="165" cy="60" r="3.5" fill="#38bdf8" />
                        <circle cx="75" cy="100" r="3.5" fill="#38bdf8" />
                        <circle cx="120" cy="100" r="3.5" fill="#38bdf8" />
                        <circle cx="165" cy="100" r="3.5" fill="#38bdf8" />

                        <text x="120" y="83" fill="#f8fafc" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          SOLID STEPPED ISLAND
                        </text>
                        <text x="120" y="132" fill="#94a3b8" fontSize="7" textAnchor="middle">
                          (No Indirect LED Cove • Clean Sharp Edge)
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Sharp architectural box with direct downlight grid</span>
                    </div>

                    {/* Architectural Cross Section */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-sky-400" /> Architectural Cross-Section
                      </span>
                      <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-auto">
                        {/* RCC Roof Slab */}
                        <rect x="5" y="10" width="250" height="18" fill="#334155" />
                        <rect x="5" y="10" width="250" height="18" fill="url(#concreteHatchGlobal)" />

                        {/* Suspension Hangers */}
                        <line x1="80" y1="28" x2="80" y2="95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
                        <line x1="180" y1="28" x2="180" y2="95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />

                        {/* Floating Island Bottom Soffit Board */}
                        <rect x="65" y="95" width="130" height="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="1" />
                        
                        {/* Clean Straight Vertical Fascia Drop Left & Right (NO Cove Lip) */}
                        <rect x="65" y="55" width="6" height="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                        <rect x="189" y="55" width="6" height="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

                        {/* Downward Light Cone */}
                        <polygon points="90,104 70,145 110,145" fill="#38bdf8" fillOpacity="0.15" />
                        <polygon points="170,104 150,145 190,145" fill="#38bdf8" fillOpacity="0.15" />

                        <text x="130" y="75" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          CLEAN VERTICAL BOX STEP
                        </text>
                        <text x="130" y="118" fill="#38bdf8" fontSize="7" textAnchor="middle">
                          Multiplier = Perimeter × 1 (Single Vertical Drop Board)
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Fascia drops flush with no return lip or LED trough</span>
                    </div>

                  </div>

                  {/* Calculation Rules Summary */}
                  <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 text-xs space-y-1.5">
                    <strong className="text-sky-950 font-bold block">Calculation Formula:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sky-900 font-mono text-[11px]">
                      <div>• Surface Area = <strong>Island Length × Island Width</strong></div>
                      <div>• Fascia Perimeter = <strong>2 × (Island Length + Island Width)</strong></div>
                      <div>• Total Quantity = <strong>Surface Area + (Perimeter × 1)</strong></div>
                      <div>• Advantage: <strong>Clean, minimalist, zero dust trap</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 5. L-SHAPE CEILING ---------------- */}
              {activeDesign === 'L_SHAPE' && (
                <div className="p-5 rounded-2xl border border-purple-200 bg-white shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-700 text-white font-bold text-[10px]">
                          TYPE 5
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          L-Shape Ceiling (Corner Zoning Drop Band)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        A dropped band running continuously along two perpendicular adjacent walls to visually zone dining, study, or kitchen counters.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto shrink-0">
                      Open-Concept Zoning
                    </span>
                  </div>

                  {/* Dual Demonstration: Plan View & Cross Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Plan View */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-purple-400" /> Plan View (Top Looking Up)
                      </span>
                      <svg viewBox="0 0 240 160" className="w-full max-w-[220px] h-auto">
                        {/* Outer Room */}
                        <rect x="10" y="10" width="220" height="140" fill="#020617" stroke="#475569" strokeWidth="2" rx="4" />
                        
                        {/* L-Shape Dropped Band: Top & Left */}
                        <path d="M 10 10 L 230 10 L 230 50 L 50 50 L 50 150 L 10 150 Z" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                        
                        {/* Cove Light Line along Interior L-Step */}
                        <path d="M 230 50 L 50 50 L 50 150" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />

                        {/* Spotlights along L-Arm */}
                        <circle cx="30" cy="30" r="3" fill="#38bdf8" />
                        <circle cx="100" cy="30" r="3" fill="#38bdf8" />
                        <circle cx="170" cy="30" r="3" fill="#38bdf8" />
                        <circle cx="30" cy="90" r="3" fill="#38bdf8" />
                        <circle cx="30" cy="130" r="3" fill="#38bdf8" />

                        <text x="140" y="95" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          ORIGINAL RCC ROOF SLAB
                        </text>
                        <text x="140" y="108" fill="#94a3b8" fontSize="6.5" textAnchor="middle">
                          (Two Walls Fully Open)
                        </text>
                        <text x="140" y="122" fill="#f59e0b" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                          ✨ L-Cove Step Highlight
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">L-band covers corner walls with cove running along inner angle</span>
                    </div>

                    {/* Architectural Cross Section */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-purple-400" /> Architectural Cross-Section
                      </span>
                      <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-auto">
                        {/* RCC Roof Slab */}
                        <rect x="5" y="10" width="250" height="18" fill="#334155" />
                        <rect x="5" y="10" width="250" height="18" fill="url(#concreteHatchGlobal)" />

                        {/* Left Wall (Anchored) */}
                        <rect x="5" y="28" width="16" height="122" fill="#1e293b" />
                        
                        {/* Dropped L-Arm Soffit on Left */}
                        <rect x="21" y="110" width="70" height="8" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" rx="1" />
                        
                        {/* Fascia Step & Upstand Lip */}
                        <rect x="85" y="65" width="6" height="45" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" />
                        <rect x="77" y="60" width="8" height="12" fill="#7c3aed" stroke="#c084fc" strokeWidth="1" />
                        <circle cx="81" cy="65" r="2.5" fill="#f59e0b" />
                        <polygon points="81,62 165,30 150,55" fill="url(#warmLightCove)" />

                        {/* Right Open Wall */}
                        <rect x="239" y="28" width="16" height="122" fill="#1e293b" />

                        <text x="170" y="70" fill="#f8fafc" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          ORIGINAL RCC ROOF SLAB
                        </text>
                        <text x="170" y="85" fill="#c084fc" fontSize="7" textAnchor="middle">
                          (Open to Dining / Living Space)
                        </text>
                        <text x="56" y="132" fill="#e9d5ff" fontSize="7" textAnchor="middle">
                          Dropped L-Band
                        </text>
                      </svg>
                      <span className="text-[10px] text-slate-400 mt-2 text-center">Drops along corner walls and steps back up into open room</span>
                    </div>

                  </div>

                  {/* Calculation Rules Summary */}
                  <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-xs space-y-1.5">
                    <strong className="text-purple-950 font-bold block">Calculation Formula:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-purple-900 font-mono text-[11px]">
                      <div>• Surface Area = <strong>(Length × Drop) + ((Width - Drop) × Drop)</strong></div>
                      <div>• Step Run = <strong>(Length - Drop) + (Width - Drop)</strong></div>
                      <div>• Multiplier = <strong>×2 (with cove)</strong> or <strong>×1 (without cove)</strong></div>
                      <div>• Corner Overlap: <strong>Auto-deduplicated in calculation</strong></div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 2: EDGE & PELMET ADDONS ================= */}
          {activeTab === 'EDGE_AND_SHAPES' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CornerDownRight className="w-4 h-4 text-slate-700" />
                  <span>How to Use the 'Edge' Addon</span>
                </div>
                <p className="text-xs text-slate-600">
                  The Edge addon is used whenever you have a linear vertical step, curtain pocket (pelmet), or beam bulkhead that needs framing and finishing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                        Multiplier ×2
                      </span>
                      <strong className="text-amber-950 text-xs">Edge (With Cove)</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • <strong>Curtain Pockets / Window Pelmets:</strong> Concealed cove running across a window wall washing light down curtains.<br/>
                      • <strong>Indirect Cove Steps:</strong> A stepped vertical recess between two ceiling heights with a return channel lip for LED strip.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-bold">
                        Multiplier ×1
                      </span>
                      <strong className="text-sky-950 text-xs">Edge (Without Cove)</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • <strong>Simple Curtain Pelmets:</strong> Vertical board drop to conceal curtain tracks without strip light.<br/>
                      • <strong>Beam Boxing & Bulkheads:</strong> Straight vertical step downs covering structural RCC beams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: REDUCTIONS & DEDUCTIONS ================= */}
          {activeTab === 'REDUCTIONS' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-4">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <MinusCircle className="w-4 h-4 text-rose-600" />
                  <span>Understanding Reductions & Deductions</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reductions allow you to subtract cutouts, ventilation shafts, or exempted edges from the total false ceiling calculation:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-rose-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 text-[10px] font-bold">
                        Surface Deduction
                      </span>
                      <strong className="text-rose-950 text-xs">Exempted Area (Cutout)</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • Used for skylight cutouts, HVAC ventilation shafts, or structural columns/voids.<br/>
                      • Calculated as <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-950">L × W (sq.ft)</code> and directly deducted from the total board area.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-rose-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 text-[10px] font-bold">
                        Edge Deduction
                      </span>
                      <strong className="text-rose-950 text-xs">Edge Reduction</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      • Used when an existing beam or wall already acts as a natural fascia, eliminating the need for gypsum framing.<br/>
                      • Deducts <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-950">Length × 2</code> (with cove) or <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-950">Length × 1</code> (without cove) from edge runs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: ELECTRICALS ================= */}
          {activeTab === 'ELECTRICALS' && (
            <div className="space-y-6">
              
              {/* The Continuous Run Rule */}
              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <span>The Continuous Run Rule (1 Adaptor / 15 Meters)</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  For every continuous strip light run, exactly <strong>1 LED power adaptor/driver is required for every 15 meters</strong> of strip light (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 font-semibold text-amber-900">ceil(run_meters / 15)</code>).
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Why Disconnected Sections Calculate Separately
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An adaptor cannot jump across open space between physically separate ceiling elements (e.g. a peripheral wall cove and a center floating island). Each independent cove run requires its own dedicated driver unit wired to the local power point.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Standard: 300 mm = 1 ft • LIVIN INTERIORS Estimation System
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
          >
            Got it, Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
