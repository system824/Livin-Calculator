import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Scissors, 
  Frame, 
  Info,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  BookOpen
} from 'lucide-react';
import { MoldingFrameItem, MoldingFrameType } from '../types';
import { 
  calculateMoldingQuantity, 
  createNewMoldingFrame, 
  DEFAULT_MOLDING_ITEMS,
  STANDARD_MOLDING_SIZES,
  getProfileSizeById,
  PVC_STOCK_BAR_LENGTH_MM,
  PVC_STOCK_BAR_LENGTH_FT,
  FIXED_WASTAGE_FACTOR
} from '../utils/moldingCalculator';
import { MoldingManualModal } from './MoldingManualModal';


interface MoldingCalculatorProps {
  initialItems?: MoldingFrameItem[];
  onSave?: (items: MoldingFrameItem[]) => void;
}

const BAR_COLORS = [
  'bg-indigo-500 text-white border-indigo-600',
  'bg-emerald-500 text-white border-emerald-600',
  'bg-amber-500 text-white border-amber-600',
  'bg-sky-500 text-white border-sky-600',
  'bg-rose-500 text-white border-rose-600',
  'bg-purple-500 text-white border-purple-600',
  'bg-teal-500 text-white border-teal-600',
  'bg-orange-500 text-white border-orange-600',
];

export const MoldingCalculator: React.FC<MoldingCalculatorProps> = ({
  initialItems,
  onSave,
}) => {
  const [items, setItems] = useState<MoldingFrameItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_MOLDING_ITEMS
  );
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    (initialItems && initialItems[0]?.id) || DEFAULT_MOLDING_ITEMS[0].id
  );

  const updateItems = (newItems: MoldingFrameItem[]) => {
    setItems(newItems);
    if (onSave) onSave(newItems);
  };

  const addFrame = (type: MoldingFrameType = 'DOUBLE_FRAME') => {
    const nextIndex = items.length + 1;
    const newFrame = createNewMoldingFrame(type, nextIndex);
    const updated = [...items, newFrame];
    updateItems(updated);
    setSelectedItemId(newFrame.id);
  };

  const removeFrame = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    updateItems(updated);
    if (selectedItemId === id) {
      setSelectedItemId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const updateFrameField = (id: string, field: keyof MoldingFrameItem, val: any) => {
    const updated = items.map((it) => {
      if (it.id !== id) return it;
      return {
        ...it,
        [field]: field === 'label' || field === 'type' || field === 'profileSizeId' || field === 'outerProfileSizeId' || field === 'innerProfileSizeId'
          ? val 
          : Math.max(0, Number(val) || 0),
      };
    });
    updateItems(updated);
  };

  const resetAll = () => {
    const defaultItem: MoldingFrameItem = {
      id: `m_${Date.now()}`,
      label: 'Design 1',
      type: 'DOUBLE_FRAME',
      widthMm: 1200,
      heightMm: 1800,
      quantity: 1,
      innerOffsetMm: 75,
      outerProfileSizeId: 'w201',
      innerProfileSizeId: 'w101',
    };
    updateItems([defaultItem]);
    setSelectedItemId(defaultItem.id);
  };

  // Perform calculation with fixed 10% wastage
  const results = useMemo(() => {
    return calculateMoldingQuantity(items, PVC_STOCK_BAR_LENGTH_MM, FIXED_WASTAGE_FACTOR);
  }, [items]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Frame className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              PVC Molding Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Calculates 8-foot molding bars. Continuous pieces under 2400 mm have zero joints, while slats over 2400 mm use full bars + nested tail cuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            title="Open Molding calculation manual"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Designs Inputs (Left) & Calculation Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Designs Editor (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Design Specifications & Dimensions (mm)
                </h3>
              </div>

              {/* Add Design Dropdown / Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addFrame('DOUBLE_FRAME')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Design</span>
                </button>
              </div>
            </div>

            {/* Designs Form List */}
            <div className="space-y-4">
              {items.map((item, index) => {
                const isSelected = selectedItemId === item.id;
                const isDouble = item.type === 'DOUBLE_FRAME';
                const isSlat = item.type === 'HORIZONTAL_SLAT' || item.type === 'VERTICAL_SLAT';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/15'
                        : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row: Number, Name Input, Type Selector, Delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateFrameField(item.id, 'label', e.target.value)}
                          placeholder="e.g. Design 1, Design 2"
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:bg-white px-1.5 py-0.5 rounded outline-none transition-colors w-32 sm:w-44"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Type Select */}
                        <select
                          value={item.type}
                          onChange={(e) => updateFrameField(item.id, 'type', e.target.value as MoldingFrameType)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-slate-300 focus:border-indigo-600 outline-none transition-colors"
                        >
                          <option value="DOUBLE_FRAME">Double Box Frame</option>
                          <option value="BOX_FRAME">Single Box Frame</option>
                          <option value="HORIZONTAL_SLAT">Horizontal Slat/Batten</option>
                          <option value="VERTICAL_SLAT">Vertical Slat/Batten</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => removeFrame(item.id)}
                          disabled={items.length <= 1}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Remove Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dimensions & Quantity Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Width / Horizontal Length */}
                      {item.type !== 'VERTICAL_SLAT' && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                            <span>
                              {item.type === 'HORIZONTAL_SLAT' ? 'Length (mm)' : 'Width (mm)'}
                            </span>
                            <span className="font-mono text-slate-400 text-[10px]">
                              ≈ {((item.widthMm || 0) / 300).toFixed(2)} ft
                            </span>
                          </div>
                          <input
                            type="number"
                            step="10"
                            min="10"
                            value={item.widthMm || ''}
                            onChange={(e) => updateFrameField(item.id, 'widthMm', e.target.value)}
                            placeholder="e.g. 1200"
                            className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-left focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors"
                          />
                        </div>
                      )}

                      {/* Height / Vertical Length */}
                      {item.type !== 'HORIZONTAL_SLAT' && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                            <span>
                              {item.type === 'VERTICAL_SLAT' ? 'Height (mm)' : 'Height (mm)'}
                            </span>
                            <span className="font-mono text-slate-400 text-[10px]">
                              ≈ {((item.heightMm || 0) / 300).toFixed(2)} ft
                            </span>
                          </div>
                          <input
                            type="number"
                            step="10"
                            min="10"
                            value={item.heightMm || ''}
                            onChange={(e) => updateFrameField(item.id, 'heightMm', e.target.value)}
                            placeholder="e.g. 1800"
                            className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-left focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors"
                          />
                        </div>
                      )}

                      {/* Quantity */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                          <span>Quantity</span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => updateFrameField(item.id, 'quantity', e.target.value)}
                          placeholder="e.g. 1"
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-left focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Profile Size Dropdowns Section */}
                    <div className="mt-3 pt-3 border-t border-slate-200/60 bg-white/70 rounded-lg p-2.5">
                      {isDouble ? (
                        /* Double Frame: Outer Profile Size + Inner Profile Size + Inner Gap */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Outer Profile Size
                            </label>
                            <select
                              value={item.outerProfileSizeId || 'size_1'}
                              onChange={(e) => updateFrameField(item.id, 'outerProfileSizeId', e.target.value)}
                              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 focus:border-indigo-600 outline-none transition-colors"
                            >
                              {STANDARD_MOLDING_SIZES.map((sz) => (
                                <option key={sz.id} value={sz.id}>
                                  {sz.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Inner Profile Size
                            </label>
                            <select
                              value={item.innerProfileSizeId || 'size_2'}
                              onChange={(e) => updateFrameField(item.id, 'innerProfileSizeId', e.target.value)}
                              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 focus:border-indigo-600 outline-none transition-colors"
                            >
                              {STANDARD_MOLDING_SIZES.map((sz) => (
                                <option key={sz.id} value={sz.id}>
                                  {sz.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                              <span>Inner Offset Gap</span>
                              <span className="text-[10px] text-slate-400 font-mono font-normal">
                                {item.innerOffsetMm || 75}mm
                              </span>
                            </div>
                            <input
                              type="number"
                              min="10"
                              max="300"
                              step="5"
                              value={item.innerOffsetMm || 75}
                              onChange={(e) => updateFrameField(item.id, 'innerOffsetMm', e.target.value)}
                              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:border-indigo-600 outline-none transition-colors"
                              placeholder="75"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Single Frame / Slat / Custom: Single Profile Size Dropdown */
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-700">
                              Profile Size:
                            </span>
                          </div>
                          <select
                            value={item.profileSizeId || 'size_1'}
                            onChange={(e) => updateFrameField(item.id, 'profileSizeId', e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 focus:border-indigo-600 outline-none transition-colors w-full sm:w-60"
                          >
                            {STANDARD_MOLDING_SIZES.map((sz) => (
                              <option key={sz.id} value={sz.id}>
                                {sz.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Procurement Calculations & Stock Cutting Breakdown (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Results Procurement Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Summary
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +10% Wastage Included
              </span>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Total 8' Bars (+10%)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    {results.recommendedBarsTotal}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Bars
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {results.rawBarsRequired} raw + {results.recommendedBarsTotal - results.rawBarsRequired} extra buffer
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Total Linear Length
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-indigo-700">
                    {results.netMoldingLengthFt}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    RFT
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {results.totalMoldingPieces} total cut pieces
                </span>
              </div>
            </div>

            {/* Profile Size Breakdown Cards */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 block">
                Required Bars by Profile Size:
              </span>
              {results.profileSummaries.map((prof) => (
                <div 
                  key={prof.profileSizeId}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {prof.profileName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {prof.totalPieces} cuts • {prof.totalLinearFt} RFT ({prof.totalLinearMm} mm)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-700 block">
                      {prof.recommendedBarsTotal} Bars
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({prof.rawBarsRequired} raw + {prof.recommendedBarsTotal - prof.rawBarsRequired} waste)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rules Note */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-950 text-xs space-y-1">
              <div className="flex items-center gap-1 font-bold text-indigo-900">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Site Cutting Rule:</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                Single cut pieces ≤ 2400 mm are strictly uncut without joints. Slats exceeding 2400 mm utilize full 2400 mm bars plus nested tail cut offcuts.
              </p>
            </div>
          </div>

          {/* Detailed Cutting Schedule by Profile Size */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Scissors className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Stock Bar Cutting Allocation Schedule
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {results.profileSummaries.map((prof) => (
                <div key={prof.profileSizeId} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <span>{prof.profileName} Schedule</span>
                    <span className="text-indigo-700">{prof.rawBarsRequired} Stock Bars</span>
                  </div>

                  <div className="space-y-2.5">
                    {prof.stockBars.map((bar) => {
                      const usedPct = (bar.usedLengthMm / PVC_STOCK_BAR_LENGTH_MM) * 100;
                      const leftPct = (bar.remainingLengthMm / PVC_STOCK_BAR_LENGTH_MM) * 100;

                      return (
                        <div
                          key={bar.barNumber}
                          className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">
                              Bar #{bar.barNumber} (8' / 2400 mm)
                            </span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-emerald-700 font-semibold">
                                Used: {bar.usedLengthMm} mm
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500 font-medium">
                                Left: {bar.remainingLengthMm} mm
                              </span>
                            </div>
                          </div>

                          {/* Visual Cut Segments Bar */}
                          <div className="w-full h-5 rounded-md bg-slate-100 border border-slate-200 flex overflow-hidden">
                            {bar.cuts.map((cut, cIdx) => {
                              const cutPct = (cut.lengthMm / PVC_STOCK_BAR_LENGTH_MM) * 100;
                              const colorClass = BAR_COLORS[cIdx % BAR_COLORS.length];

                              return (
                                <div
                                  key={cIdx}
                                  className={`h-full ${colorClass} text-[9px] font-bold flex items-center justify-center px-1 truncate border-r border-white/20`}
                                  style={{ width: `${cutPct}%` }}
                                  title={`${cut.label}: ${cut.lengthMm} mm (${(cut.lengthMm / 300).toFixed(2)} ft)`}
                                >
                                  {cut.lengthMm}mm
                                </div>
                              );
                            })}

                            {bar.remainingLengthMm > 0 && (
                              <div
                                className="h-full bg-slate-200/80 text-slate-500 text-[9px] font-medium flex items-center justify-center px-1 truncate"
                                style={{ width: `${leftPct}%` }}
                                title={`Remaining Scrap: ${bar.remainingLengthMm} mm`}
                              >
                                {bar.remainingLengthMm > 150 ? `${bar.remainingLengthMm}mm left` : ''}
                              </div>
                            )}
                          </div>

                          {/* Cut Pieces Text List */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {bar.cuts.map((cut, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
                              >
                                {cut.label}: <strong>{cut.lengthMm}mm</strong> ({(cut.lengthMm / 300).toFixed(2)}ft)
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Elevation Canvas Gallery (Rearranged to Bottom) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Designs Elevation Visualizer (Side-by-Side Gallery)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {items.length} Design {items.length === 1 ? 'Element' : 'Elements'} Configured
          </span>
        </div>

        {/* Gallery of Designs side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const isSelected = selectedItemId === item.id;
            const w = item.widthMm || 0;
            const h = item.heightMm || 0;
            const outerProf = getProfileSizeById(item.outerProfileSizeId || 'w201');
            const innerProf = getProfileSizeById(item.innerProfileSizeId || 'w101');
            const singleProf = getProfileSizeById(item.profileSizeId || 'w201');
            const offset = item.innerOffsetMm || 75;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {item.label}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-500">
                        {item.type === 'DOUBLE_FRAME' && 'Double Box Frame'}
                        {item.type === 'BOX_FRAME' && 'Single Box Frame'}
                        {item.type === 'HORIZONTAL_SLAT' && 'Horizontal Slat/Batten'}
                        {item.type === 'VERTICAL_SLAT' && 'Vertical Slat/Batten'}
                        {item.type === 'CUSTOM_RUN' && 'Custom Linear Run'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                    × {item.quantity} {item.quantity === 1 ? 'qty' : 'sets'}
                  </span>
                </div>

                {/* Scaled 2D Elevation View for this Design */}
                <div className="h-44 w-full bg-slate-900 rounded-lg p-3 relative flex items-center justify-center overflow-hidden shadow-inner my-2">
                  {/* Subtle Grid Background */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                      backgroundSize: '12px 12px'
                    }}
                  />

                  {/* Render Double Frame */}
                  {item.type === 'DOUBLE_FRAME' && (
                    <div className="relative flex items-center justify-center max-h-36 max-w-[85%]">
                      {/* Outer Frame Box */}
                      <div 
                        className="border-2 border-amber-400 bg-amber-500/10 rounded-xs flex items-center justify-center p-3 shadow-md transition-all"
                        style={{
                          width: `${Math.min(180, Math.max(80, (w / 2000) * 160))}px`,
                          height: `${Math.min(130, Math.max(60, (h / 2000) * 120))}px`,
                        }}
                      >
                        {/* Inner Frame Box */}
                        <div 
                          className="w-full h-full border border-sky-300 bg-sky-400/20 rounded-xs flex items-center justify-center"
                        >
                          <span className="text-[9px] font-mono text-slate-300 font-semibold text-center leading-none px-1">
                            {w} × {h}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Single Box Frame */}
                  {item.type === 'BOX_FRAME' && (
                    <div 
                      className="border-2 border-indigo-400 bg-indigo-500/15 rounded-xs flex items-center justify-center shadow-md transition-all"
                      style={{
                        width: `${Math.min(180, Math.max(80, (w / 2000) * 160))}px`,
                        height: `${Math.min(130, Math.max(60, (h / 2000) * 120))}px`,
                      }}
                    >
                      <span className="text-[10px] font-mono text-slate-200 font-bold">
                        {w} × {h} mm
                      </span>
                    </div>
                  )}

                  {/* Render Horizontal Slat */}
                  {item.type === 'HORIZONTAL_SLAT' && (
                    <div className="w-full px-4 flex flex-col items-center gap-2">
                      <div className="w-full h-3 bg-emerald-400 rounded-xs relative shadow flex items-center justify-center">
                        {w > 2400 && (
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-rose-500" 
                            style={{ left: `${(2400 / w) * 100}%` }}
                            title="2400mm Joint Location"
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300 font-semibold">
                        Length: {w || h} mm {w > 2400 && '(Jointed at 2400mm)'}
                      </span>
                    </div>
                  )}

                  {/* Render Vertical Slat */}
                  {item.type === 'VERTICAL_SLAT' && (
                    <div className="h-full py-2 flex flex-col items-center justify-center gap-1">
                      <div className="w-3 h-28 bg-emerald-400 rounded-xs relative shadow flex items-center justify-center">
                        {h > 2400 && (
                          <div 
                            className="absolute left-0 right-0 h-0.5 bg-rose-500" 
                            style={{ top: `${(2400 / h) * 100}%` }}
                            title="2400mm Joint Location"
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300 font-semibold">
                        {h || w} mm
                      </span>
                    </div>
                  )}

                  {/* Render Custom Run */}
                  {item.type === 'CUSTOM_RUN' && (
                    <div className="w-full px-4 flex flex-col items-center gap-2">
                      <div className="w-full h-2.5 bg-purple-400 rounded-xs shadow" />
                      <span className="text-[10px] font-mono text-purple-300 font-semibold">
                        {w || h} mm Linear Run
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Spec Badges */}
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                  {item.type === 'DOUBLE_FRAME' ? (
                    <>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                        Outer: {outerProf.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-medium">
                        Inner: {innerProf.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        Gap: {offset}mm
                      </span>
                    </>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                      Profile: {singleProf.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PVC Moulding Manual Modal */}
      <MoldingManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  );
};

