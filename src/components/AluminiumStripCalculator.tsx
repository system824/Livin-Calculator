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
  FolderPlus,
  BookOpen
} from 'lucide-react';
import { AluminiumStripType, AluminiumStripPlacement } from '../types';
import { 
  calculateAllAluminiumTypes, 
  createNewAluminiumType,
  createNewAluminiumPlacement,
  DEFAULT_ALUMINIUM_TYPES,
  STOCK_BAR_LENGTH_MM
} from '../utils/aluminiumCalculator';

interface AluminiumStripCalculatorProps {
  initialTypes?: AluminiumStripType[];
  onSaveTypes?: (types: AluminiumStripType[]) => void;
  onOpenManual?: () => void;
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
  initialTypes,
  onSaveTypes,
  onOpenManual,
}) => {
  const [types, setTypes] = useState<AluminiumStripType[]>(
    initialTypes && initialTypes.length > 0 ? initialTypes : DEFAULT_ALUMINIUM_TYPES
  );
  const [stockLengthMm] = useState<number>(STOCK_BAR_LENGTH_MM);
  const [copied, setCopied] = useState<boolean>(false);

  const updateTypes = (newTypes: AluminiumStripType[]) => {
    setTypes(newTypes);
    if (onSaveTypes) onSaveTypes(newTypes);
  };

  const addType = () => {
    const newType = createNewAluminiumType(types.length + 1);
    updateTypes([...types, newType]);
  };

  const removeType = (typeId: string) => {
    updateTypes(types.filter((t) => t.id !== typeId));
  };

  const updateTypeName = (typeId: string, name: string) => {
    updateTypes(
      types.map((t) => (t.id === typeId ? { ...t, name } : t))
    );
  };

  const addPlacement = (typeId: string) => {
    updateTypes(
      types.map((t) => {
        if (t.id !== typeId) return t;
        const newPlacement = createNewAluminiumPlacement(t.placements.length + 1);
        return {
          ...t,
          placements: [...t.placements, newPlacement],
        };
      })
    );
  };

  const removePlacement = (typeId: string, placementId: string) => {
    updateTypes(
      types.map((t) => {
        if (t.id !== typeId) return t;
        return {
          ...t,
          placements: t.placements.filter((p) => p.id !== placementId),
        };
      })
    );
  };

  const updatePlacementField = (
    typeId: string,
    placementId: string,
    field: keyof AluminiumStripPlacement,
    val: string | number
  ) => {
    updateTypes(
      types.map((t) => {
        if (t.id !== typeId) return t;
        return {
          ...t,
          placements: t.placements.map((p) => {
            if (p.id !== placementId) return p;
            return {
              ...p,
              [field]: field === 'label' ? val : Math.max(0, Number(val) || 0),
            };
          }),
        };
      })
    );
  };

  const resetAll = () => {
    updateTypes(DEFAULT_ALUMINIUM_TYPES);
  };

  // Perform calculation across all Strip Types
  const results = useMemo(() => {
    return calculateAllAluminiumTypes(types, stockLengthMm);
  }, [types, stockLengthMm]);

  // Color map for cut pieces
  const placementColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let colorIdx = 0;
    types.forEach((type) => {
      type.placements.forEach((p) => {
        map[p.id] = BAR_COLORS[colorIdx % BAR_COLORS.length];
        colorIdx++;
      });
    });
    return map;
  }, [types]);

  const copyToClipboard = () => {
    let text = `====================================\n`;
    text += `ALUMINIUM STRIP CUTTING SCHEDULE & ESTIMATE\n`;
    text += `Standard Stock Bar: 10 ft (3000 mm) | Zero Joints Method\n`;
    text += `====================================\n`;
    text += `TOTAL QUANTITY SUMMARY:\n`;
    text += `• Total 10' Bars Required: ${results.barsRequired} Bars (${results.totalStockPurchasedFt} ft)\n`;
    text += `• Total Design Length: ${results.totalDesignLengthFt} ft (${results.totalDesignLengthMm} mm)\n`;
    text += `• Total Design Pieces: ${results.totalDesignPieces} pcs\n`;
    text += `• Offcut / Scrap: ${results.totalWastageFt} ft (${results.wastagePercentage}%)\n\n`;

    results.typesResults.forEach((tr, tIdx) => {
      text += `--- STRIP TYPE ${tIdx + 1}: ${tr.name.toUpperCase()} ---\n`;
      text += `• Bars Required: ${tr.barsRequired} Bars (10' each)\n`;
      text += `• Net Length: ${tr.totalDesignLengthFt} ft (${tr.totalDesignLengthMm} mm) | Pieces: ${tr.totalPieces} pcs\n`;
      text += `• Placements:\n`;
      const curType = types.find((t) => t.id === tr.typeId);
      curType?.placements.forEach((p, pIdx) => {
        text += `  ${pIdx + 1}. ${p.label}: ${p.lengthMm} mm (${(p.lengthMm / 300).toFixed(2)} ft) × ${p.quantity} pcs\n`;
      });
      text += `• Cutting Schedule:\n`;
      tr.stockBars.forEach((bar) => {
        text += `  Bar #${bar.barNumber} [Used: ${bar.usedLengthMm}mm / Offcut: ${bar.remainingLengthMm}mm]:\n`;
        bar.cuts.forEach((c) => {
          text += `    - ${c.label} -> ${c.lengthMm}mm (${(c.lengthMm / 300).toFixed(2)}ft)\n`;
        });
      });
      text += `\n`;
    });

    text += `====================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLoadWardrobeExample = (examplePlacements: AluminiumStripPlacement[]) => {
    updateTypes([
      {
        id: `alt_${Date.now()}_1`,
        name: '3-Door Wardrobe T-Profile (Example)',
        placements: examplePlacements,
      },
    ]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Ruler className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Aluminium Strip Calculator
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              10' (3000 mm) Stock Bar
            </span>
            {onOpenManual && (
              <button
                type="button"
                onClick={onOpenManual}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer ml-1"
                title="Open Aluminium Strip Manual & Wardrobe Guide"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Manual</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Calculate requirements for multiple strip types (e.g. Strip Type 1, Strip Type 2) with zero-joint stock optimization.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid: Entries Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strip Types (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Strip Types ({types.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={addType}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ Add Strip Type</span>
              </button>
            </div>
          </div>

          {/* Oversized Piece Alert if any */}
          {results.oversizedPieces.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Oversized Piece Warning (&gt; 3000 mm / 10 ft)</span>
              </div>
              <p className="text-[11px] text-amber-800">
                The following piece(s) exceed the standard 3000 mm (10') stock bar length and cannot be cut without a joint:
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

          {/* List of Strip Types (Strip Type 1, Strip Type 2...) */}
          <div className="space-y-5">
            {types.map((typeItem, tIdx) => {
              const typeResult = results.typesResults.find((tr) => tr.typeId === typeItem.id);

              return (
                <div
                  key={typeItem.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
                >
                  {/* Strip Type Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-2.5 flex-1">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {tIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={typeItem.name}
                        onChange={(e) => updateTypeName(typeItem.id, e.target.value)}
                        placeholder={`Strip Type ${tIdx + 1}`}
                        className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:bg-slate-50 px-1.5 py-0.5 rounded outline-none transition-colors w-full max-w-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {typeResult && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                          {typeResult.barsRequired} Bars ({typeResult.totalDesignLengthFt} ft)
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeType(typeItem.id)}
                        disabled={types.length <= 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Remove Strip Type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Placements for this Strip Type */}
                  <div className="space-y-3">
                    {typeItem.placements.map((placement, pIdx) => {
                      const ftVal = (placement.lengthMm / 300).toFixed(2);
                      const isOver = placement.lengthMm > stockLengthMm;

                      return (
                        <div
                          key={placement.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isOver
                              ? 'border-amber-300 bg-amber-50/40'
                              : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                                {pIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={placement.label}
                                onChange={(e) =>
                                  updatePlacementField(typeItem.id, placement.id, 'label', e.target.value)
                                }
                                placeholder="e.g. Door 1 & 2 Horizontal, Door 3 Vertical"
                                className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:bg-white px-1 py-0.5 rounded outline-none transition-colors w-48 sm:w-64"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removePlacement(typeItem.id, placement.id)}
                              disabled={typeItem.placements.length <= 1}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              title="Remove Placement"
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
                                value={placement.lengthMm || ''}
                                onChange={(e) =>
                                  updatePlacementField(typeItem.id, placement.id, 'lengthMm', e.target.value)
                                }
                                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-left focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                                placeholder="e.g. 500"
                              />
                            </div>

                            {/* Quantity */}
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                                <span>Quantity (pieces)</span>
                                <span className="font-mono text-slate-500 font-semibold">
                                  Total: {((placement.lengthMm * placement.quantity) / 300).toFixed(1)} ft
                                </span>
                              </div>
                              <input
                                type="number"
                                min="1"
                                value={placement.quantity || ''}
                                onChange={(e) =>
                                  updatePlacementField(typeItem.id, placement.id, 'quantity', e.target.value)
                                }
                                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-left focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                                placeholder="e.g. 4"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Placement inside this Strip Type */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => addPlacement(typeItem.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Placement to {typeItem.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock Bar Spec Footer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-500 shadow-xs">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Stock Bar Specification:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                10 Feet = 3000 mm
              </span>
              <span className="text-[10px] text-slate-400">(300 mm = 1 ft standard)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Quantity Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quantity Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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

            {/* Total Required 10' Bars */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                  Total 10' Strips Required
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {results.barsRequired}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
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

            {/* Type-by-Type Summary Table */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Type-wise Requirements
              </span>
              <div className="space-y-1.5 text-xs">
                {results.typesResults.map((tr, idx) => (
                  <div
                    key={tr.typeId}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">
                        {tr.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">
                        {tr.barsRequired} Bars
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1.5">
                        ({tr.totalDesignLengthFt} ft)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Bar Nesting Cut Diagram */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Stock Bar Nesting Schedule (10' / 3000 mm)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {results.stockBars.length} Bars
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Visual layout of how individual 10-foot stock strips should be cut at site to eliminate scrap and avoid joints:
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
                        const colorClass = placementColorMap[cut.itemId] || 'bg-slate-700 text-white';

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
    </div>
  );
};
