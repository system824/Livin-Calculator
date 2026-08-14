import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Scissors, 
  Ruler, 
  Info,
  Layers,
  BookOpen
} from 'lucide-react';
import { AluminiumStripItem } from '../types';
import { 
  calculateAluminiumStrips, 
  createNewAluminiumItem, 
  DEFAULT_ALUMINIUM_ITEMS,
  STOCK_BAR_LENGTH_MM,
  STOCK_BAR_LENGTH_FT
} from '../utils/aluminiumCalculator';
import { AluminiumManualModal } from './AluminiumManualModal';

interface AluminiumStripCalculatorProps {
  initialItems?: AluminiumStripItem[];
  onSaveItems?: (items: AluminiumStripItem[]) => void;
}

const BAR_COLORS = [
  'bg-sky-500 text-white border-sky-600',
  'bg-emerald-500 text-white border-emerald-600',
  'bg-amber-500 text-white border-amber-600',
  'bg-violet-500 text-white border-violet-600',
  'bg-rose-500 text-white border-rose-600',
  'bg-indigo-500 text-white border-indigo-600',
  'bg-teal-500 text-white border-teal-600',
  'bg-orange-500 text-white border-orange-600',
];

export const AluminiumStripCalculator: React.FC<AluminiumStripCalculatorProps> = ({
  initialItems,
  onSaveItems,
}) => {
  const [items, setItems] = useState<AluminiumStripItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_ALUMINIUM_ITEMS
  );
  const [stockLengthMm, setStockLengthMm] = useState<number>(STOCK_BAR_LENGTH_MM);
  const [copied, setCopied] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);


  // Sync back to parent when items change
  const updateItems = (newItems: AluminiumStripItem[]) => {
    setItems(newItems);
    if (onSaveItems) onSaveItems(newItems);
  };

  const addItem = () => {
    const newItem = createNewAluminiumItem(items.length + 1);
    updateItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    updateItems(items.filter((item) => item.id !== id));
  };

  const updateItemField = (id: string, field: keyof AluminiumStripItem, val: string | number) => {
    updateItems(
      items.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          [field]: field === 'label' ? val : Math.max(0, Number(val) || 0),
        };
      })
    );
  };

  const resetAll = () => {
    updateItems([
      { id: `al_${Date.now()}_1`, label: 'Module 1', lengthMm: 2400, quantity: 2 },
    ]);
  };

  // Perform calculation
  const results = useMemo(() => {
    return calculateAluminiumStrips(items, stockLengthMm);
  }, [items, stockLengthMm]);

  // Color map for distinct items
  const itemColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    items.forEach((item, index) => {
      map[item.id] = BAR_COLORS[index % BAR_COLORS.length];
    });
    return map;
  }, [items]);

  const copyToClipboard = () => {
    const text = `====================================
ALUMINIUM STRIP CUTTING SCHEDULE & ESTIMATE
Standard Stock Bar: ${results.stockLengthFt}ft (${results.stockLengthMm}mm)
Constraint: Zero Joints per Cut Piece
====================================
Total 10' Bars Required: ${results.barsRequired} Bars (${results.totalStockPurchasedFt} ft)
Total Design Length: ${results.totalDesignLengthFt} ft (${results.totalDesignLengthMm} mm)
Total Design Pieces: ${results.totalDesignPieces} pcs
Material Wastage/Offcut: ${results.totalWastageFt} ft (${results.wastagePercentage}%)

--- MODULE PLACEMENTS ---
${items.map((it, i) => `${i + 1}. ${it.label}: ${it.lengthMm}mm (${(it.lengthMm / 300).toFixed(2)}ft) × ${it.quantity} pcs`).join('\n')}

--- STOCK BAR CUTTING SCHEDULE ---
${results.stockBars.map((bar) => `Bar #${bar.barNumber} [Used: ${bar.usedLengthMm}mm / Left: ${bar.remainingLengthMm}mm]:
  ${bar.cuts.map((c) => `• ${c.label} -> ${c.lengthMm}mm (${(c.lengthMm / 300).toFixed(2)}ft)`).join('\n  ')}`).join('\n\n')}
====================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Ruler className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Aluminium Strip Calculator
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              10' (3000 mm) Stock Bar
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Calculates the minimum full 10-foot stock strips required to achieve all design modules <strong>without intermediate joints</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            title="Open Aluminium Strip manual and wardrobe guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual</span>
          </button>
        </div>
      </div>


      {/* Main 2-Column Grid: Entries Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Design Entries (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Design Module Placements (mm)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Placement</span>
                </button>
              </div>
            </div>

            {/* Oversized Piece Alert if any */}
            {results.oversizedPieces.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Oversized Piece Warning (&gt; 3000 mm / 10 ft)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  The following piece(s) exceed the standard 3000 mm (10') stock bar length and cannot be cut without a joint or custom extra-long profile:
                </p>
                <ul className="list-disc list-inside font-mono text-[11px] text-amber-900 pt-1">
                  {results.oversizedPieces.map((op, idx) => (
                    <li key={idx}>
                      {op.label}: {op.lengthMm} mm ({(op.lengthMm / 300).toFixed(2)} ft) × {op.count} pcs
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Items Table / List */}
            <div className="space-y-3">
              {items.map((item, index) => {
                const ftVal = (item.lengthMm / 300).toFixed(2);
                const isOver = item.lengthMm > stockLengthMm;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isOver
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateItemField(item.id, 'label', e.target.value)}
                          placeholder="e.g. TV Wall Slat, Wardrobe T-Profile"
                          className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:bg-white px-1 py-0.5 rounded outline-none transition-colors w-48 sm:w-64"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        title="Remove Element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Length in mm */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                          <span>Length per piece (mm)</span>
                          <span className="font-mono text-slate-500 font-semibold">
                            ≈ {ftVal} ft
                          </span>
                        </div>
                        <input
                          type="number"
                          step="10"
                          min="1"
                          value={item.lengthMm || ''}
                          onChange={(e) => updateItemField(item.id, 'lengthMm', e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-left focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                          placeholder="e.g. 2400"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                          <span>Quantity (pieces)</span>
                          <span className="font-mono text-slate-500 font-semibold">
                            Total: {((item.lengthMm * item.quantity) / 300).toFixed(1)} ft
                          </span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => updateItemField(item.id, 'quantity', e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-left focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                          placeholder="e.g. 4"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stock Bar Length Setting */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Stock Bar Spec:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">
                  10 Feet = 3000 mm
                </span>
                <span className="text-[10px] text-slate-400">(300 mm = 1 ft)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Visual Cutting Diagram (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summary Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Quantity summary
                </h3>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >

                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schedule</span>
                  </>
                )}
              </button>
            </div>

            {/* Big Stat Box: Required 10' Bars */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                  Total 10' Strips Required
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {results.barsRequired}
                  </span>
                  <span className="text-sm text-slate-300 font-medium">
                    Bars (10 ft each)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                  = {results.totalStockPurchasedFt} Total Running Ft
                </p>
              </div>

              <div className="text-right border-l border-white/10 pl-4">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Offcut / Scrap
                </span>
                <span className="text-base font-bold text-white">
                  {results.wastagePercentage}%
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ({results.totalWastageFt} ft offcut)
                </span>
              </div>
            </div>

            {/* Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Net Design Length
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {results.totalDesignLengthFt} ft
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {results.totalDesignLengthMm} mm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Total Cut Pieces
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {results.totalDesignPieces} pcs
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Zero joints within pieces
                </span>
              </div>
            </div>
          </div>

          {/* Visual Bar Nesting Cut Diagram */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Stock Bar Nesting Diagram (10' / 3000 mm)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {results.stockBars.length} Bars
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Visual layout of how individual 10-foot stock strips should be cut at site to eliminate scrap and avoid joints:
            </p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {results.stockBars.map((bar) => {
                const usedPct = (bar.usedLengthMm / bar.stockLengthMm) * 100;
                const remainingPct = (bar.remainingLengthMm / bar.stockLengthMm) * 100;

                return (
                  <div
                    key={bar.barNumber}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                      <span className="font-bold text-slate-900">
                        Bar #{bar.barNumber} (10' / {bar.stockLengthMm}mm)
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Used: {bar.usedLengthMm}mm • Offcut: {bar.remainingLengthMm}mm
                      </span>
                    </div>

                    {/* Visual Segment Bar */}
                    <div className="w-full h-7 rounded-lg overflow-hidden flex bg-slate-200 border border-slate-300 p-0.5 gap-0.5">
                      {bar.cuts.map((cut, cIdx) => {
                        const cutPct = (cut.lengthMm / bar.stockLengthMm) * 100;
                        const colorClass = itemColorMap[cut.itemId] || 'bg-slate-700 text-white';

                        return (
                          <div
                            key={cIdx}
                            style={{ width: `${cutPct}%` }}
                            className={`h-full rounded flex items-center justify-center px-1 text-[10px] font-mono font-bold truncate transition-all ${colorClass}`}
                            title={`${cut.label}: ${cut.lengthMm}mm (${(cut.lengthMm / 300).toFixed(2)}ft)`}
                          >
                            <span className="truncate">{cut.lengthMm}mm</span>
                          </div>
                        );
                      })}

                      {/* Remaining Offcut Segment */}
                      {bar.remainingLengthMm > 0 && (
                        <div
                          style={{ width: `${remainingPct}%` }}
                          className="h-full rounded bg-slate-200/80 text-slate-500 flex items-center justify-center px-1 text-[9px] font-mono font-medium truncate"
                          title={`Offcut / Scrap: ${bar.remainingLengthMm}mm`}
                        >
                          <span className="truncate">{bar.remainingLengthMm}mm offcut</span>
                        </div>
                      )}
                    </div>

                    {/* Cut Details list */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-600">
                      {bar.cuts.map((cut, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200"
                        >
                          <span className="font-bold text-slate-900">{cut.lengthMm}mm</span>
                          <span className="text-slate-400">({cut.label})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Aluminium Strip Manual Modal */}
      <AluminiumManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onLoadExample={(exampleItems) => updateItems(exampleItems)}
      />
    </div>
  );
};

