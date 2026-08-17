import React, { useState } from 'react';
import { 
  ChevronDown, 
  RotateCcw, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Zap, 
  Layers, 
  Info, 
  ListTree, 
  Eye, 
  MinusCircle,
  BookOpen
} from 'lucide-react';
import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  ReductionItem,
  CeilingCalculationResults, 
  CeilingCategory, 
  PeripheralSubOption, 
  IslandSubOption,
  EdgeSubOption,
  ExtraCategory,
  ReductionCategory,
  CoveOption
} from '../types';
import { formatFt } from '../utils/calculator';
import { SplitBreakdownModal } from './SplitBreakdownModal';
import { CeilingVisualizer } from './CeilingVisualizer';

interface MinimalCeilingCalculatorProps {
  primaryInputs: PrimaryCeilingInputs;
  extraItems: ExtraItem[];
  reductions?: ReductionItem[];
  results: CeilingCalculationResults;
  onChangePrimary: <K extends keyof PrimaryCeilingInputs>(key: K, value: PrimaryCeilingInputs[K]) => void;
  onAddExtra: (type?: ExtraCategory) => void;
  onUpdateExtra: (id: string, updated: Partial<ExtraItem>) => void;
  onRemoveExtra: (id: string) => void;
  onAddReduction?: (type?: ReductionCategory) => void;
  onUpdateReduction?: (id: string, updated: Partial<ReductionItem>) => void;
  onRemoveReduction?: (id: string) => void;
  onResetAll: () => void;
  onClearExtras: () => void;
  onClearReductions?: () => void;
  onOpenManual?: () => void;
}

export const MinimalCeilingCalculator: React.FC<MinimalCeilingCalculatorProps> = ({
  primaryInputs,
  extraItems,
  reductions = [],
  results,
  onChangePrimary,
  onAddExtra,
  onUpdateExtra,
  onRemoveExtra,
  onAddReduction,
  onUpdateReduction,
  onRemoveReduction,
  onResetAll,
  onClearExtras,
  onClearReductions,
  onOpenManual,
}) => {
  const [copied, setCopied] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const getPrimaryTitle = () => {
    if (primaryInputs.category === 'PERIPHERAL') {
      const cove = primaryInputs.peripheralCoveOption === 'WITH_COVE' ? 'With cove' : 'Without cove';
      return primaryInputs.peripheralSubOption === 'FULL_AREA_COVERED'
        ? `Peripheral (${cove} • Center covered)`
        : `Peripheral (${cove} • Only drop)`;
    }
    if (primaryInputs.category === 'ISLAND') {
      return primaryInputs.islandSubOption === 'WITH_COVE'
        ? 'Island Ceiling (With cove)'
        : 'Island Ceiling (Without cove)';
    }
    const cove = primaryInputs.lShapeCoveOption === 'WITH_COVE' ? 'With cove' : 'Without cove';
    return `L-Shape Ceiling (${cove})`;
  };

  const handleCopySummary = () => {
    let text = `--- FALSE CEILING CALCULATION ---\n`;
    text += `PRIMARY CEILING: ${getPrimaryTitle()}\n`;
    text += `Dimensions: L=${primaryInputs.lengthMm} mm (${formatFt(primaryInputs.lengthMm)} ft) × W=${primaryInputs.widthMm} mm (${formatFt(primaryInputs.widthMm)} ft)`;
    if (primaryInputs.category !== 'ISLAND') {
      const label = primaryInputs.category === 'L_SHAPE' ? 'Drop Width' : 'PW';
      text += ` | ${label}=${primaryInputs.peripheralWidthMm} mm (${formatFt(primaryInputs.peripheralWidthMm)} ft)`;
    }
    text += `\n`;

    if (extraItems.length > 0) {
      text += `\nEXTRAS & ADDONS (${extraItems.length}):\n`;
      extraItems.forEach((item, index) => {
        if (item.category === 'ISLAND') {
          text += `${index + 1}. Island (${item.islandSubOption === 'WITH_COVE' ? 'With cove' : 'Without cove'}): ${item.lengthMm} × ${item.widthMm} mm (${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft)\n`;
        } else if (item.category === 'EDGE') {
          text += `${index + 1}. Edge (${item.edgeSubOption === 'WITH_COVE' ? 'With cove' : 'Without cove'}): Length ${item.lengthMm} mm (${formatFt(item.lengthMm)} ft)\n`;
        } else if (item.category === 'EXTRA_AREA') {
          text += `${index + 1}. Extra Area: ${item.lengthMm} × ${item.widthMm} mm (${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft)\n`;
        }
      });
    }

    if (reductions.length > 0) {
      text += `\nREDUCTIONS & DEDUCTIONS (${reductions.length}):\n`;
      reductions.forEach((item, index) => {
        if (item.category === 'EXEMPTED_AREA') {
          text += `${index + 1}. Exempted Area: ${item.lengthMm} × ${item.widthMm} mm (${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft)\n`;
        } else if (item.category === 'EDGE') {
          text += `${index + 1}. Edge (${item.edgeSubOption === 'WITH_COVE' ? 'With cove' : 'Without cove'}): Length ${item.lengthMm} mm (${formatFt(item.lengthMm)} ft)\n`;
        }
      });
    }

    text += `\nSUMMARY:\n`;
    text += `• Total Surface Area: ${results.totalSurfaceAreaSqft} sq.ft\n`;
    text += `• Total Cove: ${results.totalStripLightMtr} m (${results.totalStripLightRft} RFT)\n`;
    text += `• TOTAL F.C QTY: ${results.totalFcSqft} sq.ft\n\n`;
    text += `ELECTRICALS (1 Adaptor per 15m continuous strip):\n`;
    text += `• Total Strip Light: ${results.totalStripLightMtr} m (${results.totalStripLightRft} RFT)\n`;
    text += `• Total Adaptors: ${results.totalAdaptors} Nos\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerReset = () => {
    onResetAll();
    setResetFeedback('Reset Done');
    setTimeout(() => setResetFeedback(null), 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                False Ceiling Calculator
              </h1>
              {onOpenManual && (
                <button
                  type="button"
                  onClick={onOpenManual}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-900 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
                  title="Open False Ceiling Manual & Design Guide"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manual</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Standard 300 mm = 1 ft Conversion • 1 Adaptor / 15m Cove Light
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {resetFeedback && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              {resetFeedback}
            </span>
          )}

          {/* View Split Button */}
          <button
            type="button"
            onClick={() => setShowSplitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
            title="View detailed item-by-item split"
          >
            <ListTree className="w-3.5 h-3.5 text-slate-600" />
            <span>View Split</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTriggerReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
            title="Reset removes all values and clears all extras"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Side-by-Side Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: ENTRIES & VISUALIZER (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Primary Ceiling Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Primary Ceiling
                </span>
                <p className="text-xs text-slate-400">
                  Main ceiling design and room base dimensions
                </p>
              </div>
            </div>

            {/* Ceiling Type Selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ceiling Type
                </label>
                <div className="relative">
                  <select
                    value={primaryInputs.category}
                    onChange={(e) => onChangePrimary('category', e.target.value as CeilingCategory)}
                    className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                  >
                    <option value="PERIPHERAL">Peripheral</option>
                    <option value="ISLAND">Island Ceiling</option>
                    <option value="L_SHAPE">L-Shape Ceiling</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Peripheral Sub-options: Option & Cove Option */}
              {primaryInputs.category === 'PERIPHERAL' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Peripheral Coverage
                    </label>
                    <div className="relative">
                      <select
                        value={primaryInputs.peripheralSubOption}
                        onChange={(e) => onChangePrimary('peripheralSubOption', e.target.value as PeripheralSubOption)}
                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                      >
                        <option value="ONLY_PERIPHERAL_DROP">Only peripheral drop</option>
                        <option value="FULL_AREA_COVERED">Peripheral drop + center covered</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cove Option
                    </label>
                    <div className="relative">
                      <select
                        value={primaryInputs.peripheralCoveOption || 'WITH_COVE'}
                        onChange={(e) => onChangePrimary('peripheralCoveOption', e.target.value as CoveOption)}
                        className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                      >
                        <option value="WITH_COVE">With cove</option>
                        <option value="WITHOUT_COVE">Without cove</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Island Sub-option: Cove Option */}
              {primaryInputs.category === 'ISLAND' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cove Option
                  </label>
                  <div className="relative">
                    <select
                      value={primaryInputs.islandSubOption}
                      onChange={(e) => onChangePrimary('islandSubOption', e.target.value as IslandSubOption)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                    >
                      <option value="WITH_COVE">With cove</option>
                      <option value="WITHOUT_COVE">Without cove</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* L-Shape Sub-option: Cove Option */}
              {primaryInputs.category === 'L_SHAPE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cove Option
                  </label>
                  <div className="relative">
                    <select
                      value={primaryInputs.lShapeCoveOption || 'WITH_COVE'}
                      onChange={(e) => onChangePrimary('lShapeCoveOption', e.target.value as CoveOption)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                    >
                      <option value="WITH_COVE">With cove</option>
                      <option value="WITHOUT_COVE">Without cove</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

            </div>

            {/* Primary Ceiling Dimension Inputs */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dimensions (in mm)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DimensionInput
                  label="Length (L)"
                  value={primaryInputs.lengthMm}
                  onChange={(val) => onChangePrimary('lengthMm', val)}
                />
                <DimensionInput
                  label="Width (W)"
                  value={primaryInputs.widthMm}
                  onChange={(val) => onChangePrimary('widthMm', val)}
                />
              </div>

              {primaryInputs.category !== 'ISLAND' && (
                <DimensionInput
                  label={primaryInputs.category === 'L_SHAPE' ? 'Drop Width' : 'Peripheral Width (PW)'}
                  value={primaryInputs.peripheralWidthMm}
                  onChange={(val) => onChangePrimary('peripheralWidthMm', val)}
                />
              )}
            </div>
          </section>

          {/* 2. Extras & Addons Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Extras & Addons ({extraItems.length})
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add extra islands, edges/curtain pockets, or area extensions
                </p>
              </div>

              <div className="flex items-center gap-2">
                {extraItems.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearExtras}
                    className="text-xs font-medium text-slate-500 hover:text-rose-600 underline mr-1 transition-colors"
                  >
                    Clear Extras
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onAddExtra('ISLAND')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>+ Add Extra</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {extraItems.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
                <p className="text-xs text-slate-500">
                  No extra elements added. Use for extra islands, edges, or areas.
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onAddExtra('ISLAND')}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Extra Item</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {extraItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Extra #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveExtra(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Extra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Main Extra Category Dropdown (Island, Edge, Extra Area) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Type
                        </label>
                        <div className="relative">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const cat = e.target.value as ExtraCategory;
                              onUpdateExtra(item.id, {
                                category: cat,
                                lengthMm: item.lengthMm || (cat === 'EDGE' ? 2400 : 1800),
                                widthMm: cat === 'EDGE' ? 0 : (item.widthMm || 1200),
                              });
                            }}
                            className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                          >
                            <option value="ISLAND">Island</option>
                            <option value="EDGE">Edge</option>
                            <option value="EXTRA_AREA">Extra Area</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Sub Option Dropdown depending on Type */}
                      {item.category === 'ISLAND' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Cove Option
                          </label>
                          <div className="relative">
                            <select
                              value={item.islandSubOption}
                              onChange={(e) => onUpdateExtra(item.id, { islandSubOption: e.target.value as IslandSubOption })}
                              className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                            >
                              <option value="WITH_COVE">With cove</option>
                              <option value="WITHOUT_COVE">Without cove</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {item.category === 'EDGE' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Edge Option
                          </label>
                          <div className="relative">
                            <select
                              value={item.edgeSubOption}
                              onChange={(e) => onUpdateExtra(item.id, { edgeSubOption: e.target.value as EdgeSubOption })}
                              className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-xs"
                            >
                              <option value="WITH_COVE">With cove</option>
                              <option value="WITHOUT_COVE">Without cove</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {item.category === 'EXTRA_AREA' && (
                        <div className="flex items-center">
                          <p className="text-[11px] text-slate-500 pt-3">
                            Flat ceiling area extension
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dimension Inputs for Extra */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <DimensionInput
                        label={item.category === 'EDGE' ? 'Edge Length (L)' : 'Length (L)'}
                        value={item.lengthMm}
                        onChange={(val) => onUpdateExtra(item.id, { lengthMm: val })}
                      />

                      {item.category !== 'EDGE' && (
                        <DimensionInput
                          label="Width (W)"
                          value={item.widthMm}
                          onChange={(val) => onUpdateExtra(item.id, { widthMm: val })}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. Reductions & Deductions Card (Edge & Exempted Area) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <MinusCircle className="w-4 h-4" />
                  <span>Reductions & Deductions ({reductions.length})</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Subtract cutouts, shafts, or exempted edges from false ceiling
                </p>
              </div>

              <div className="flex items-center gap-2">
                {reductions.length > 0 && onClearReductions && (
                  <button
                    type="button"
                    onClick={onClearReductions}
                    className="text-xs font-medium text-slate-500 hover:text-rose-600 underline mr-1 transition-colors"
                  >
                    Clear Reductions
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onAddReduction && onAddReduction('EXEMPTED_AREA')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-600" />
                  <span>+ Add Reduction</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {reductions.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-rose-200/70 rounded-xl space-y-2 bg-rose-50/20">
                <p className="text-xs text-slate-500">
                  No reductions added. Use to subtract exempted areas or edges from calculation.
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onAddReduction && onAddReduction('EXEMPTED_AREA')}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Reduction</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reductions.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900">
                        Reduction #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveReduction && onRemoveReduction(item.id)}
                        className="p-1 rounded text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                        title="Remove Reduction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Reduction Category Dropdown (Exempted Area, Edge) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Reduction Type
                        </label>
                        <div className="relative">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const cat = e.target.value as ReductionCategory;
                              if (onUpdateReduction) {
                                onUpdateReduction(item.id, {
                                  category: cat,
                                  lengthMm: item.lengthMm || 1200,
                                  widthMm: cat === 'EDGE' ? 0 : (item.widthMm || 900),
                                });
                              }
                            }}
                            className="w-full appearance-none bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer shadow-xs"
                          >
                            <option value="EXEMPTED_AREA">Exempted Area</option>
                            <option value="EDGE">Edge</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Sub Option Dropdown for Edge */}
                      {item.category === 'EDGE' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Edge Option
                          </label>
                          <div className="relative">
                            <select
                              value={item.edgeSubOption}
                              onChange={(e) => onUpdateReduction && onUpdateReduction(item.id, { edgeSubOption: e.target.value as EdgeSubOption })}
                              className="w-full appearance-none bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer shadow-xs"
                            >
                              <option value="WITH_COVE">With cove</option>
                              <option value="WITHOUT_COVE">Without cove</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {item.category === 'EXEMPTED_AREA' && (
                        <div className="flex items-center">
                          <p className="text-[11px] text-slate-500 pt-3">
                            Subtracted directly from surface area
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dimension Inputs for Reduction */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <DimensionInput
                        label={item.category === 'EDGE' ? 'Edge Length (L)' : 'Length (L)'}
                        value={item.lengthMm}
                        onChange={(val) => onUpdateReduction && onUpdateReduction(item.id, { lengthMm: val })}
                      />

                      {item.category !== 'EDGE' && (
                        <DimensionInput
                          label="Width (W)"
                          value={item.widthMm}
                          onChange={(val) => onUpdateReduction && onUpdateReduction(item.id, { widthMm: val })}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. Ceiling Visualization Section */}
          <CeilingVisualizer
            primaryInputs={primaryInputs}
            extraItems={extraItems}
            results={results}
          />

        </div>

        {/* ================= RIGHT COLUMN: SUMMARY (5 Cols) ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Calculated Summary
                </span>
                <p className="text-xs text-slate-400">
                  Primary + {extraItems.length} Extra{extraItems.length === 1 ? '' : 's'}
                  {reductions.length > 0 ? ` - ${reductions.length} Deduction${reductions.length === 1 ? '' : 's'}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSplitModal(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl border border-slate-200 transition-colors"
                  title="View itemized breakdown"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* ONLY TOTAL F.C QTY VISIBLE IN DEFAULT VIEW (Surface area & Cove inside Split up) */}
            <div 
              onClick={() => setShowSplitModal(true)}
              className="bg-slate-900 text-white rounded-2xl p-5 cursor-pointer hover:bg-slate-800 transition-all group shadow-md"
              title="Click to view itemized split breakdown"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Total FC Qty
                </span>
                <span className="text-[11px] font-semibold text-slate-200 bg-slate-800 group-hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors">
                  <ListTree className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Split-up</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-slate-400">
                  Total False Ceiling Quantity
                </span>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {results.totalFcSqft}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 ml-1.5">sq.ft</span>
                </div>
              </div>
            </div>

            {/* Split-up Quick Action Trigger */}
            <button
              type="button"
              onClick={() => setShowSplitModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Click here to view <strong>Surface Area</strong> & <strong>Cove Split-up</strong></span>
              </div>
              <span className="text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                Open Split →
              </span>
            </button>

            {/* Electricals Section (1 Adaptor per 15m continuous run) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>Electricals</span>
                </div>
                <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-semibold">
                  1 Adaptor / 15m run
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <span className="text-slate-500 text-[11px]">Total Strip Light:</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {results.totalStripLightMtr}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">meters</span>
                    <span className="text-[10px] text-slate-400 font-mono">({results.totalStripLightRft} ft)</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <span className="text-slate-500 text-[11px]">Total Adaptors:</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono font-bold text-amber-900 text-sm">
                      {results.totalAdaptors}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Nos</span>
                  </div>
                </div>
              </div>

              {/* Adaptor breakdown explanation */}
              {results.totalAdaptors > 0 && (
                <div className="text-[11px] text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-200 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    {results.primaryBreakdown.coveMtr > 0 && (
                      <>Primary: {results.primaryBreakdown.coveMtr}m → {results.primaryBreakdown.adaptors} Nos</>
                    )}
                    {results.extrasBreakdown.some(e => e.coveMtr > 0) && (
                      <>{results.primaryBreakdown.coveMtr > 0 ? ' + ' : ''}Extras: {results.extrasBreakdown.filter(e => e.coveMtr > 0).map(e => `${e.coveMtr}m (${e.adaptors})`).join(', ')}</>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowSplitModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                <ListTree className="w-4 h-4" />
                <span>View Itemized Split Breakdown</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Summary to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Summary to Clipboard</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Modal for Quantity Split */}
      <SplitBreakdownModal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        results={results}
      />

    </div>
  );
};

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

const DimensionInput: React.FC<DimensionInputProps> = ({ label, value, onChange }) => {
  const ftVal = formatFt(value);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1 focus-within:border-slate-400 transition-colors">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">
          {label}
        </label>
        <span className="text-[11px] font-mono text-slate-500">
          = <strong className="text-slate-800 font-semibold">{ftVal}</strong> ft
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="number"
          min="0"
          step="50"
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={(e) => {
            const raw = parseFloat(e.target.value);
            onChange(isNaN(raw) ? 0 : Math.max(0, raw));
          }}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 pl-3 pr-10 text-xs font-mono font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-2.5 text-[11px] font-mono text-slate-400 pointer-events-none">
          mm
        </span>
      </div>
    </div>
  );
};
