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
  BookOpen
} from 'lucide-react';
import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  CeilingCalculationResults, 
  CeilingCategory, 
  PeripheralSubOption, 
  IslandSubOption,
  EdgeSubOption,
  ExtraCategory
} from '../types';
import { formatFt } from '../utils/calculator';
import { SplitBreakdownModal } from './SplitBreakdownModal';
import { CeilingVisualizer } from './CeilingVisualizer';
import { CeilingManualModal } from './CeilingManualModal';

interface MinimalCeilingCalculatorProps {
  primaryInputs: PrimaryCeilingInputs;
  extraItems: ExtraItem[];
  results: CeilingCalculationResults;
  onChangePrimary: <K extends keyof PrimaryCeilingInputs>(key: K, value: PrimaryCeilingInputs[K]) => void;
  onAddExtra: (type?: ExtraCategory) => void;
  onUpdateExtra: (id: string, updated: Partial<ExtraItem>) => void;
  onRemoveExtra: (id: string) => void;
  onResetAll: () => void;
  onClearExtras: () => void;
}

export const MinimalCeilingCalculator: React.FC<MinimalCeilingCalculatorProps> = ({
  primaryInputs,
  extraItems,
  results,
  onChangePrimary,
  onAddExtra,
  onUpdateExtra,
  onRemoveExtra,
  onResetAll,
  onClearExtras,
}) => {
  const [copied, setCopied] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const getPrimaryTitle = () => {
    if (primaryInputs.category === 'PERIPHERAL') {
      return primaryInputs.peripheralSubOption === 'FULL_AREA_COVERED'
        ? 'Peripheral (Peripheral drop along with center area covered)'
        : 'Peripheral (Only peripheral drop)';
    }
    if (primaryInputs.category === 'ISLAND') {
      return primaryInputs.islandSubOption === 'WITH_COVE'
        ? 'Island Ceiling (With cove)'
        : 'Island Ceiling (Without cove)';
    }
    return 'L-Shape Ceiling';
  };

  const handleCopySummary = () => {
    let text = `--- FALSE CEILING CALCULATION ---\n`;
    text += `PRIMARY CEILING: ${getPrimaryTitle()}\n`;
    text += `Dimensions: L=${primaryInputs.lengthMm} mm (${formatFt(primaryInputs.lengthMm)} ft) × W=${primaryInputs.widthMm} mm (${formatFt(primaryInputs.widthMm)} ft)`;
    if (primaryInputs.category !== 'ISLAND') {
      text += ` | PW=${primaryInputs.peripheralWidthMm} mm (${formatFt(primaryInputs.peripheralWidthMm)} ft)`;
    }
    text += `\n`;

    if (extraItems.length > 0) {
      text += `\nEXTRAS (${extraItems.length}):\n`;
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

    text += `\nSUMMARY:\n`;
    text += `• Total Surface Area: ${results.totalSurfaceAreaSqft} sq.ft\n`;
    text += `• Total Cove: ${results.totalCoveRft} RFT\n`;
    text += `• TOTAL F.C SQFT: ${results.totalFcSqft} sq.ft\n\n`;
    text += `ELECTRICALS (1 Adaptor per 15' continuous strip):\n`;
    text += `• Total Strip Light: ${results.totalStripLightRft} RFT\n`;
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
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              False Ceiling Calculator
            </h1>
            <p className="text-xs text-slate-500">
              Standard 300 mm = 1 ft Conversion • 1 Adaptor / 15' Cove
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

          {/* Manual Button */}
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-900 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-sm"
            title="Open Ceiling Manual & Guide (Shapes, Clouds, Edges, Electricals)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSplitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
            title="View detailed item-by-item split"
          >
            <ListTree className="w-3.5 h-3.5 text-slate-600" />
            <span>View Split</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
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
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Primary Ceiling
                </span>
                <p className="text-xs text-slate-400">
                  Main ceiling design and room base dimensions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors"
              >
                <BookOpen className="w-3 h-3 text-slate-700" />
                <span>Types Guide</span>
              </button>
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
                    className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
                  >
                    <option value="PERIPHERAL">Peripheral</option>
                    <option value="ISLAND">Island Ceiling</option>
                    <option value="L_SHAPE">L-Shape Ceiling</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Peripheral Sub-option */}
              {primaryInputs.category === 'PERIPHERAL' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peripheral Option
                  </label>
                  <div className="relative">
                    <select
                      value={primaryInputs.peripheralSubOption}
                      onChange={(e) => onChangePrimary('peripheralSubOption', e.target.value as PeripheralSubOption)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
                    >
                      <option value="ONLY_PERIPHERAL_DROP">Only peripheral drop</option>
                      <option value="FULL_AREA_COVERED">Peripheral drop along with center area covered</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Island Sub-option */}
              {primaryInputs.category === 'ISLAND' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cove Option
                  </label>
                  <div className="relative">
                    <select
                      value={primaryInputs.islandSubOption}
                      onChange={(e) => onChangePrimary('islandSubOption', e.target.value as IslandSubOption)}
                      className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
                    >
                      <option value="WITH_COVE">With cove (×2 Multiplier)</option>
                      <option value="WITHOUT_COVE">Without cove (×1 Multiplier)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Primary Ceiling Dimension Inputs (Left-aligned, No spin buttons) */}
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
                  label="Peripheral Width (PW)"
                  value={primaryInputs.peripheralWidthMm}
                  onChange={(val) => onChangePrimary('peripheralWidthMm', val)}
                />
              )}
            </div>
          </section>

          {/* 2. Extras & Addons Card with Clean Dropdowns (Island, Edge, Extra Area) */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
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
                {/* Single clean Add button */}
                <button
                  type="button"
                  onClick={() => onAddExtra('ISLAND')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>+ Add Extra</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {extraItems.length === 0 ? (
              <div className="py-7 text-center border border-dashed border-slate-200 rounded-lg space-y-2.5">
                <p className="text-xs text-slate-500">
                  No extra elements added. Use for islands, edges, or extra areas.
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onAddExtra('ISLAND')}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
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
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative shadow-sm"
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
                            className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
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
                              className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
                            >
                              <option value="WITH_COVE">With cove (×2 Multiplier)</option>
                              <option value="WITHOUT_COVE">Without cove (×1 Multiplier)</option>
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
                              className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer shadow-sm"
                            >
                              <option value="WITH_COVE">With cove (Curtain pocket/indirect, ×2)</option>
                              <option value="WITHOUT_COVE">Without cove (Pelmet/fascia drop, ×1)</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {item.category === 'EXTRA_AREA' && (
                        <div className="flex items-center">
                          <p className="text-[11px] text-slate-500 pt-3">
                            Flat ceiling area extension (shown on side)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Edge Note with Manual Link */}
                    {item.category === 'EDGE' && (
                      <div className="bg-white border border-slate-200 rounded-lg p-2 text-[11px] text-slate-600 flex items-center justify-between shadow-sm">
                        <span className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Curtain pocket, step drop, or pelmet length.</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowManualModal(true)}
                          className="text-[10px] font-semibold text-slate-800 underline hover:text-black ml-2"
                        >
                          Manual Guide
                        </button>
                      </div>
                    )}

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

          {/* 3. Ceiling Visualization Section (2D Plan View Only) */}
          <CeilingVisualizer
            primaryInputs={primaryInputs}
            extraItems={extraItems}
            results={results}
          />

        </div>

        {/* ================= RIGHT COLUMN: SUMMARY (5 Cols) ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Calculated Summary
                </span>
                <p className="text-xs text-slate-400">
                  Primary + {extraItems.length} Extra{extraItems.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                  title="Open calculation manual"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSplitModal(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                  title="View itemized breakdown"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
              </div>
            </div>

            {/* 2-Metric Grid: Total Surface Area & Total Cove */}
            <div className="grid grid-cols-2 gap-3">
              
              <div 
                onClick={() => setShowSplitModal(true)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 cursor-pointer hover:border-slate-300 transition-colors group"
                title="Click to view split details"
              >
                <span className="text-xs font-medium text-slate-500 block mb-1 group-hover:text-slate-800">
                  Total Surface Area
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                    {results.totalSurfaceAreaSqft}
                  </span>
                  <span className="text-xs font-medium text-slate-500">sq.ft</span>
                </div>
              </div>

              <div 
                onClick={() => setShowSplitModal(true)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 cursor-pointer hover:border-slate-300 transition-colors group"
                title="Click to view split details"
              >
                <span className="text-xs font-medium text-slate-500 block mb-1 group-hover:text-slate-800">
                  Total Cove
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                    {results.totalCoveRft}
                  </span>
                  <span className="text-xs font-medium text-slate-500">RFT</span>
                </div>
              </div>

            </div>

            {/* TOTAL F.C SQFT Highlight - Clickable */}
            <div 
              onClick={() => setShowSplitModal(true)}
              className="bg-slate-900 text-white rounded-xl p-4.5 p-4 cursor-pointer hover:bg-slate-800 transition-colors group shadow-md"
              title="Click to view itemized split breakdown"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  TOTAL F.C SQFT
                </span>
                <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 group-hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                  <ListTree className="w-3 h-3 text-slate-300" />
                  <span>Click for Split</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-[11px] text-slate-400">
                  Surface Area + Edge Additions
                </span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    {results.totalFcSqft}
                  </span>
                  <span className="text-xs font-medium text-slate-300 ml-1.5">sq.ft</span>
                </div>
              </div>
            </div>

            {/* Unified Electricals Section (1 Adaptor per 15' continuous run) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>Electricals</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualModal(true)}
                  className="text-[10px] font-mono text-amber-900 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300 transition-colors underline"
                >
                  1 Adaptor / 15' run
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col justify-between p-2.5 rounded-lg bg-white border border-amber-200">
                  <span className="text-slate-500 text-[11px]">Total Strip Light:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {results.totalStripLightRft} <span className="text-[10px] text-slate-500 font-normal">RFT</span>
                  </span>
                </div>

                <div className="flex flex-col justify-between p-2.5 rounded-lg bg-white border border-amber-200">
                  <span className="text-slate-500 text-[11px]">Total Adaptors:</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono font-bold text-amber-900 text-sm">
                      {results.totalAdaptors}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Nos</span>
                  </div>
                </div>
              </div>

              {/* Adaptor breakdown sub-explanation */}
              {results.totalAdaptors > 0 && (
                <div className="text-[11px] text-amber-900 bg-white/80 p-2 rounded border border-amber-200 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    {results.primaryBreakdown.coveRft > 0 && (
                      <>Primary: {results.primaryBreakdown.coveRft}' → {results.primaryBreakdown.adaptors} Nos</>
                    )}
                    {results.extrasBreakdown.some(e => e.coveRft > 0) && (
                      <>{results.primaryBreakdown.coveRft > 0 ? ' + ' : ''}Extras: {results.extrasBreakdown.filter(e => e.coveRft > 0).map(e => `${e.coveRft}' (${e.adaptors})`).join(', ')}</>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Ceiling & Shapes Manual</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSplitModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
              >
                <ListTree className="w-4 h-4" />
                <span>View Itemized Split Breakdown</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
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

      {/* Modal for Ceiling Manual & Guides */}
      <CeilingManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
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
    <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1 focus-within:border-slate-400 transition-colors">
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
          className="w-full bg-slate-50 border border-slate-300 rounded-md py-1.5 pl-3 pr-10 text-xs font-mono font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-2.5 text-[11px] font-mono text-slate-400 pointer-events-none">
          mm
        </span>
      </div>
    </div>
  );
};
