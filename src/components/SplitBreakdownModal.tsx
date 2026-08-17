import React, { useState } from 'react';
import { X, Copy, Check, Info, Zap, MinusCircle } from 'lucide-react';
import { CeilingCalculationResults } from '../types';

interface SplitBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CeilingCalculationResults;
}

export const SplitBreakdownModal: React.FC<SplitBreakdownModalProps> = ({
  isOpen,
  onClose,
  results,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build adaptor calculation string
  const adaptorBreakdownParts = [
    results.primaryBreakdown.coveMtr > 0
      ? `Primary (${results.primaryBreakdown.coveMtr}m → ${results.primaryBreakdown.adaptors})`
      : null,
    ...results.extrasBreakdown
      .filter((e) => e.coveMtr > 0)
      .map((e) => `${e.name} (${e.coveMtr}m → ${e.adaptors})`),
  ].filter(Boolean);

  const adaptorEquation = [
    results.primaryBreakdown.coveMtr > 0 ? results.primaryBreakdown.adaptors : 0,
    ...results.extrasBreakdown.map((e) => (e.coveMtr > 0 ? e.adaptors : 0)),
  ]
    .filter((a) => a > 0)
    .join(' + ');

  const handleCopySplit = () => {
    let text = `=== FALSE CEILING ITEM-WISE SPLIT BREAKDOWN ===\n\n`;
    text += `1. ${results.primaryBreakdown.name.toUpperCase()} (${results.primaryBreakdown.categoryLabel})\n`;
    text += `   Dimensions: ${results.primaryBreakdown.dimensionsLabel}\n`;
    text += `   • Surface Area: ${results.primaryBreakdown.surfaceAreaSqft} sq.ft\n`;
    text += `   • Edge / Cove: ${results.primaryBreakdown.edgeRft} RFT × ${results.primaryBreakdown.edgeMultiplier} = ${results.primaryBreakdown.edgeSqft} sq.ft\n`;
    text += `   • Item Total: ${results.primaryBreakdown.fcSqft} sq.ft\n`;
    if (results.primaryBreakdown.coveMtr > 0) {
      text += `   • Strip Light Cove: ${results.primaryBreakdown.coveMtr} m (${results.primaryBreakdown.coveRft} RFT) → ${results.primaryBreakdown.adaptors} Adaptor${results.primaryBreakdown.adaptors === 1 ? '' : 's'} @ 1 per 15m\n`;
    }
    text += `\n`;

    if (results.extrasBreakdown.length > 0) {
      text += `EXTRAS & ADDONS:\n`;
      results.extrasBreakdown.forEach((extra, idx) => {
        text += `${idx + 2}. ${extra.name}: ${extra.categoryLabel}\n`;
        text += `   Dimensions: ${extra.dimensionsLabel}\n`;
        text += `   • Surface Area: ${extra.surfaceAreaSqft} sq.ft\n`;
        if (extra.edgeRft > 0) {
          text += `   • Edge / Cove: ${extra.edgeRft} RFT × ${extra.edgeMultiplier} = ${extra.edgeSqft} sq.ft\n`;
        }
        text += `   • Item Total: ${extra.fcSqft} sq.ft\n`;
        if (extra.coveMtr > 0) {
          text += `   • Strip Light Cove: ${extra.coveMtr} m (${extra.coveRft} RFT) → ${extra.adaptors} Adaptor${extra.adaptors === 1 ? '' : 's'} @ 1 per 15m\n`;
        }
        text += `\n`;
      });
    }

    if (results.reductionsBreakdown && results.reductionsBreakdown.length > 0) {
      text += `REDUCTIONS & DEDUCTIONS:\n`;
      results.reductionsBreakdown.forEach((reduct, idx) => {
        text += `- ${reduct.name}: ${reduct.categoryLabel}\n`;
        text += `   Dimensions: ${reduct.dimensionsLabel}\n`;
        if (reduct.surfaceAreaSqft > 0) {
          text += `   • Deducted Surface Area: -${reduct.surfaceAreaSqft} sq.ft\n`;
        }
        if (reduct.edgeSqft > 0) {
          text += `   • Deducted Edge: -${reduct.edgeSqft} sq.ft\n`;
        }
        text += `\n`;
      });
    }

    text += `----------------------------------------\n`;
    text += `CUMULATIVE TOTALS:\n`;
    text += `• Total Surface Area: ${results.totalSurfaceAreaSqft} sq.ft\n`;
    text += `• Total Edge & Cove Area: ${results.totalEdgeSqft} sq.ft\n`;
    if (results.totalReductionSqft > 0) {
      text += `• Total Deductions: -${results.totalReductionSqft} sq.ft\n`;
    }
    text += `• TOTAL F.C SQFT: ${results.totalFcSqft} sq.ft\n\n`;
    text += `ELECTRICALS (1 Adaptor per 15m continuous strip):\n`;
    text += `• Total Strip Light: ${results.totalStripLightMtr} m (${results.totalStripLightRft} RFT)\n`;
    text += `• Total Adaptors: ${results.totalAdaptors} Nos (${adaptorEquation ? `${adaptorEquation} = ${results.totalAdaptors}` : '0'})\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Quantity Split Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Detailed step-by-step surface area, cove, edge, and deduction calculations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySplit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Split</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Split</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          
          {/* Primary Ceiling Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                1. Primary Ceiling
              </span>
              <span className="text-xs font-semibold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                {results.primaryBreakdown.fcSqft} sq.ft
              </span>
            </div>

            <div className="text-xs text-slate-600">
              <strong>Type:</strong> {results.primaryBreakdown.categoryLabel}
            </div>
            <div className="text-xs text-slate-600">
              <strong>Dimensions:</strong> {results.primaryBreakdown.dimensionsLabel}
            </div>

            {/* Calculations Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Surface Area:</span>
                <span className="font-mono font-bold text-slate-800">{results.primaryBreakdown.surfaceAreaSqft} sq.ft</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Edge / Cove:</span>
                <span className="font-mono font-bold text-slate-800">
                  {results.primaryBreakdown.edgeRft} RFT <span className="text-slate-500 font-normal">× {results.primaryBreakdown.edgeMultiplier}</span> = {results.primaryBreakdown.edgeSqft} sq.ft
                </span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[11px]">Strip Light Cove:</span>
                <span className="font-mono font-bold text-slate-800">
                  {results.primaryBreakdown.coveMtr} m <span className="text-[10px] text-slate-500">({results.primaryBreakdown.coveRft} RFT)</span>
                  {results.primaryBreakdown.coveMtr > 0 && (
                    <span className="text-[10px] text-amber-700 block font-normal mt-0.5">
                      → {results.primaryBreakdown.adaptors} Adaptor{results.primaryBreakdown.adaptors === 1 ? '' : 's'} (ceil({results.primaryBreakdown.coveMtr}m / 15m))
                    </span>
                  )}
                </span>
              </div>
            </div>

            {results.primaryBreakdown.notes && (
              <p className="text-[11px] text-slate-500 italic mt-1">
                • {results.primaryBreakdown.notes}
              </p>
            )}
          </div>

          {/* Extras Items Cards */}
          {results.extrasBreakdown.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Extras & Addons ({results.extrasBreakdown.length})
              </span>

              {results.extrasBreakdown.map((extra, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {idx + 2}. {extra.name} ({extra.categoryLabel})
                    </span>
                    <span className="text-xs font-semibold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      +{extra.fcSqft} sq.ft
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Dimensions:</strong> {extra.dimensionsLabel}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Surface Area:</span>
                      <span className="font-mono font-bold text-slate-800">+{extra.surfaceAreaSqft} sq.ft</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Edge / Cove:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {extra.edgeRft > 0 ? (
                          <>
                            {extra.edgeRft} RFT <span className="text-slate-500 font-normal">× {extra.edgeMultiplier}</span> = +{extra.edgeSqft} sq.ft
                          </>
                        ) : (
                          '0 sq.ft'
                        )}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block text-[11px]">Strip Light Cove:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {extra.coveMtr} m <span className="text-[10px] text-slate-500">({extra.coveRft} RFT)</span>
                        {extra.coveMtr > 0 && (
                          <span className="text-[10px] text-amber-700 block font-normal mt-0.5">
                            → {extra.adaptors} Adaptor{extra.adaptors === 1 ? '' : 's'} (ceil({extra.coveMtr}m / 15m))
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {extra.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      • {extra.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reductions / Deductions Section */}
          {results.reductionsBreakdown && results.reductionsBreakdown.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <MinusCircle className="w-3.5 h-3.5" />
                <span>Reductions & Deductions ({results.reductionsBreakdown.length})</span>
              </span>

              {results.reductionsBreakdown.map((reduct, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">
                      {reduct.name} ({reduct.categoryLabel})
                    </span>
                    <span className="text-xs font-semibold text-rose-700 bg-white border border-rose-200 px-2 py-0.5 rounded">
                      -{reduct.fcSqft} sq.ft
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong>Dimensions:</strong> {reduct.dimensionsLabel}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-200 text-xs">
                    {reduct.surfaceAreaSqft > 0 && (
                      <div className="bg-white p-2 rounded border border-rose-200">
                        <span className="text-slate-500 block text-[11px]">Deducted Surface:</span>
                        <span className="font-mono font-bold text-rose-700">-{reduct.surfaceAreaSqft} sq.ft</span>
                      </div>
                    )}
                    {reduct.edgeSqft > 0 && (
                      <div className="bg-white p-2 rounded border border-rose-200">
                        <span className="text-slate-500 block text-[11px]">Deducted Edge:</span>
                        <span className="font-mono font-bold text-rose-700">
                          -{reduct.edgeSqft} sq.ft ({reduct.edgeRft} RFT × {reduct.edgeMultiplier})
                        </span>
                      </div>
                    )}
                  </div>

                  {reduct.notes && (
                    <p className="text-[11px] text-rose-800 italic mt-1">
                      • {reduct.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Electrical Formula Reference Box */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Zap className="w-4 h-4 text-amber-700" />
              <span>Electrical Calculation Rule (Continuous Runs)</span>
            </div>
            <p className="text-[11px] text-amber-900">
              For every continuous strip light run, <strong>1 adaptor is required for every 15 meters</strong> of strip light (<code className="font-mono font-semibold bg-amber-100 px-1 py-0.5 rounded">ceil(cove_meters / 15)</code>).
            </p>
            {adaptorBreakdownParts.length > 0 ? (
              <div className="mt-1 font-mono text-[11px] bg-white p-2 rounded border border-amber-200 text-slate-800">
                <strong>Adaptor Equation:</strong> {adaptorBreakdownParts.join(' + ')} = <strong className="text-amber-800">{results.totalAdaptors} Nos Total</strong>
              </div>
            ) : (
              <div className="mt-1 text-[11px] text-slate-600">
                No active cove strip light in current configuration.
              </div>
            )}
          </div>

          {/* Formula Reference Box */}
          <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-900">
              <Info className="w-4 h-4 text-slate-600" />
              <span>Calculation Logic & Rules</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
              <li><strong>With Cove:</strong> Edge/perimeter is multiplied by <strong>2</strong> (accounts for cove light recess and vertical drop).</li>
              <li><strong>Without Cove:</strong> Edge/perimeter is multiplied by <strong>1</strong> (accounts for single vertical fascia drop).</li>
              <li><strong>Total FC Qty:</strong> (Primary Surface + Addons Surface - Deductions Surface) + (Primary Edge + Addons Edge - Deductions Edge).</li>
            </ul>
          </div>

          {/* Summary Totals Table */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Total Surface Area:</span>
              <span className="font-mono font-bold text-slate-900">{results.totalSurfaceAreaSqft} sq.ft</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Total Edge / Fascia Additions:</span>
              <span className="font-mono font-bold text-slate-900">{results.totalEdgeSqft} sq.ft</span>
            </div>
            {results.totalReductionSqft > 0 && (
              <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
                <span>Total Reductions / Deductions:</span>
                <span className="font-mono font-bold">-{results.totalReductionSqft} sq.ft</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Total Strip Light Cove:</span>
              <span className="font-mono font-bold text-slate-900">{results.totalStripLightMtr} m ({results.totalStripLightRft} RFT)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200">
              <span>Total Adaptors:</span>
              <span className="font-mono font-bold">{results.totalAdaptors} Nos</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL F.C SQFT:</span>
              <span className="font-mono text-base">{results.totalFcSqft} sq.ft</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
          >
            Close Split View
          </button>
        </div>
      </div>
    </div>
  );
};
