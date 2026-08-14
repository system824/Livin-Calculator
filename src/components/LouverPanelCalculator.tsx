import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  AlignJustify, 
  Layers, 
  Scissors, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Box
} from 'lucide-react';
import { LouverType, LouverSection } from '../types';
import { 
  calculateAllLouverTypes, 
  createNewLouverType, 
  createNewLouverSection, 
  DEFAULT_LOUVER_TYPES,
  STANDARD_LOUVER_WIDTH_MM,
  STANDARD_LOUVER_HEIGHT_MM
} from '../utils/louverCalculator';

interface LouverPanelCalculatorProps {
  initialTypes?: LouverType[];
  onSave?: (types: LouverType[]) => void;
}

const BAR_COLORS = [
  'bg-amber-500 text-white border-amber-600',
  'bg-indigo-500 text-white border-indigo-600',
  'bg-emerald-500 text-white border-emerald-600',
  'bg-sky-500 text-white border-sky-600',
  'bg-rose-500 text-white border-rose-600',
  'bg-purple-500 text-white border-purple-600',
  'bg-teal-500 text-white border-teal-600',
  'bg-orange-500 text-white border-orange-600',
];

export const LouverPanelCalculator: React.FC<LouverPanelCalculatorProps> = ({
  initialTypes,
  onSave,
}) => {
  const [types, setTypes] = useState<LouverType[]>(
    initialTypes && initialTypes.length > 0 ? initialTypes : DEFAULT_LOUVER_TYPES
  );

  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    (initialTypes || DEFAULT_LOUVER_TYPES).forEach((t) => {
      initialMap[t.id] = true;
    });
    return initialMap;
  });

  const updateTypes = (newTypes: LouverType[]) => {
    setTypes(newTypes);
    if (onSave) onSave(newTypes);
  };

  const toggleTypeExpand = (typeId: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  // Louver Type Operations
  const addLouverType = () => {
    const nextIndex = types.length + 1;
    const newType = createNewLouverType(nextIndex);
    const updated = [...types, newType];
    setExpandedTypes((prev) => ({ ...prev, [newType.id]: true }));
    updateTypes(updated);
  };

  const removeLouverType = (typeId: string) => {
    const updated = types.filter((t) => t.id !== typeId);
    updateTypes(updated);
  };

  const updateTypeName = (typeId: string, name: string) => {
    const updated = types.map((t) => (t.id === typeId ? { ...t, name } : t));
    updateTypes(updated);
  };

  // Section Operations under a Louver Type
  const addSectionToType = (typeId: string) => {
    const updated = types.map((t) => {
      if (t.id !== typeId) return t;
      const nextSecIndex = t.sections.length + 1;
      const newSec = createNewLouverSection(1, nextSecIndex);
      return {
        ...t,
        sections: [...t.sections, newSec],
      };
    });
    updateTypes(updated);
  };

  const removeSectionFromType = (typeId: string, sectionId: string) => {
    const updated = types.map((t) => {
      if (t.id !== typeId) return t;
      return {
        ...t,
        sections: t.sections.filter((s) => s.id !== sectionId),
      };
    });
    updateTypes(updated);
  };

  const updateSectionField = (
    typeId: string,
    sectionId: string,
    field: keyof LouverSection,
    val: string | number
  ) => {
    const updated = types.map((t) => {
      if (t.id !== typeId) return t;
      return {
        ...t,
        sections: t.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            [field]: field === 'name' ? val : Math.max(0, Number(val) || 0),
          };
        }),
      };
    });
    updateTypes(updated);
  };

  const resetAll = () => {
    const defaultTypes: LouverType[] = [
      {
        id: `lt_${Date.now()}_1`,
        name: 'Louver Type 1',
        sections: [
          {
            id: `sec_${Date.now()}_1`,
            name: 'Section 1',
            widthMm: 1200,
            heightMm: 2400,
          },
          {
            id: `sec_${Date.now()}_2`,
            name: 'Section 2',
            widthMm: 1200,
            heightMm: 600,
          },
        ],
      },
    ];
    updateTypes(defaultTypes);
    setExpandedTypes({ [defaultTypes[0].id]: true });
  };

  // Perform Calculations Louver Type wise without cross-type reuse
  const results = useMemo(() => {
    return calculateAllLouverTypes(types);
  }, [types]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <AlignJustify className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Louver Panel Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Configure sections by Louver Type. Scraps and nested cuts are optimized strictly within each Louver Type.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <button
            type="button"
            onClick={addLouverType}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Louver Type</span>
          </button>
        </div>
      </div>

      {/* 2-Column Main Layout: Louver Types & Sections Editor (Left) & Summary & Stock Cutting (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Louver Types with nested Sections (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {types.map((louverType, tIdx) => {
            const isExpanded = expandedTypes[louverType.id] ?? true;
            const typeResult = results.typesResults.find((r) => r.typeId === louverType.id);

            return (
              <div
                key={louverType.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 transition-all"
              >
                {/* Louver Type Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={louverType.name}
                          onChange={(e) => updateTypeName(louverType.id, e.target.value)}
                          placeholder="e.g. Louver Type 1"
                          className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-600 focus:bg-amber-50/20 px-1 py-0.5 rounded outline-none transition-colors w-40 sm:w-56"
                        />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          #{tIdx + 1}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium pl-1">
                        {louverType.sections.length} {louverType.sections.length === 1 ? 'Section' : 'Sections'} • {typeResult?.totalPanelsRequired || 0} Panels Needed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => addSectionToType(louverType.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleTypeExpand(louverType.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeLouverType(louverType.id)}
                      disabled={types.length <= 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      title="Remove Louver Type"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Louver Type Sections List */}
                {isExpanded && (
                  <div className="space-y-3 pt-1">
                    {louverType.sections.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No sections configured yet. Click "+ Add Section" above.
                      </div>
                    ) : (
                      louverType.sections.map((section, sIdx) => {
                        const secResult = typeResult?.sectionsResults.find(
                          (sr) => sr.sectionId === section.id
                        );

                        return (
                          <div
                            key={section.id}
                            className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:border-slate-300 transition-all space-y-3"
                          >
                            {/* Section Header */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                                  {sIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={section.name}
                                  onChange={(e) =>
                                    updateSectionField(louverType.id, section.id, 'name', e.target.value)
                                  }
                                  placeholder="e.g. Section 1, Section 2"
                                  className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-600 focus:bg-white px-1 py-0.5 rounded outline-none transition-colors w-40 sm:w-60"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                {secResult && (
                                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {secResult.panelsAcrossWidth} Columns
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeSectionFromType(louverType.id, section.id)}
                                  disabled={louverType.sections.length <= 1}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Remove Section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Section Inputs: Width & Height */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Width */}
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                                  <span>Width (mm)</span>
                                  <span className="font-mono text-slate-400 text-[10px]">
                                    = {secResult?.panelsAcrossWidth || 0} strips @ 300mm
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  step="50"
                                  min="10"
                                  value={section.widthMm || ''}
                                  onChange={(e) =>
                                    updateSectionField(louverType.id, section.id, 'widthMm', e.target.value)
                                  }
                                  placeholder="e.g. 1200"
                                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-amber-600 outline-none transition-colors"
                                />
                              </div>

                              {/* Height */}
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                                  <span>Height (mm)</span>
                                  <span className="font-mono text-slate-400 text-[10px]">
                                    ≈ {((section.heightMm || 0) / 300).toFixed(2)} ft
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  step="50"
                                  min="10"
                                  value={section.heightMm || ''}
                                  onChange={(e) =>
                                    updateSectionField(louverType.id, section.id, 'heightMm', e.target.value)
                                  }
                                  placeholder="e.g. 2400"
                                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-amber-600 outline-none transition-colors"
                                />
                              </div>
                            </div>

                            {/* Section Cutting Rule Info */}
                            {secResult && (
                              <div className="pt-2 border-t border-slate-200/50 flex flex-wrap items-center justify-between text-[10px] text-slate-500 gap-1">
                                <div>
                                  {secResult.fullPanelsCount > 0 && (
                                    <span className="font-semibold text-slate-700 mr-2">
                                      {secResult.fullPanelsCount} Full 2400mm Panel(s)
                                    </span>
                                  )}
                                  {secResult.excessHeightMm > 0 && (
                                    <span className="text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                      {secResult.panelsAcrossWidth} cut strip(s) @ {secResult.excessHeightMm}mm
                                    </span>
                                  )}
                                </div>
                                {secResult.widthTrimmingMm > 0 && (
                                  <span className="text-rose-600 font-mono">
                                    Trim {secResult.widthTrimmingMm}mm off width edge
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Summary & Louver Type Wise Cutting Breakdown (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Summary Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Summary
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {types.length} {types.length === 1 ? 'Louver Type' : 'Louver Types'}
              </span>
            </div>

            {/* Total Panels Metric Card */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                  Total 300×2400mm Panels Needed
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">
                    {results.totalPanelsRequired}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Panels
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-mono">
                  {results.totalFullPanelsDirect} Full Panels + {results.totalCutPanelsRequired} Cut Panels
                </p>
              </div>
            </div>

            {/* Louver Type wise panel count summary table */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 block">
                Panels Required by Louver Type:
              </span>
              {results.typesResults.map((tr) => (
                <div
                  key={tr.typeId}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{tr.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {tr.sectionsCount} {tr.sectionsCount === 1 ? 'section' : 'sections'} • {tr.fullPanelsDirect} full + {tr.cutPanelsRequired} cut
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {tr.totalPanelsRequired} Panels
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Louver Type Wise Cutting & Allocation Schedule (Showing both Full Panels & Cut Panels) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Panel Allocations (Louver Type Wise)
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500">
                {results.totalPanelsRequired} Total Panels
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {results.typesResults.map((tr) => (
                <div
                  key={tr.typeId}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3"
                >
                  {/* Type Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{tr.name}</span>
                      <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {tr.totalPanelsRequired} Panels
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {tr.fullPanelsDirect} Full • {tr.cutPanelsRequired} Cut
                    </span>
                  </div>

                  {/* 1. Full Panels for this Type */}
                  {tr.fullPanelsDirect > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Full Panels (Uncut 2400 mm) — {tr.fullPanelsDirect} Panels:
                      </span>
                      <div className="space-y-1.5 pl-1">
                        {tr.fullPanelsSchedule.map((bar) => {
                          const cut = bar.cuts[0];
                          return (
                            <div
                              key={bar.barNumber}
                              className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col gap-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-slate-800">
                                  Full Panel #{bar.barNumber} ({cut?.sectionName || 'Section'})
                                </span>
                                <span className="font-mono text-emerald-700 font-semibold text-[10px]">
                                  2400 mm (100% Used)
                                </span>
                              </div>
                              <div className="w-full h-3.5 rounded bg-emerald-500 border border-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">
                                2400 mm Full Panel
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Cut Panels for this Type */}
                  {tr.cutPanelsRequired > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-amber-600" />
                        Cut Panels (300×2400 mm) — {tr.cutPanelsRequired} Panels:
                      </span>
                      <div className="space-y-2 pl-1">
                        {tr.cutPanelsSchedule.map((bar) => {
                          const leftPct = (bar.remainingHeightMm / STANDARD_LOUVER_HEIGHT_MM) * 100;

                          return (
                            <div
                              key={bar.barNumber}
                              className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-800 text-[11px]">
                                  Cut Panel #{bar.barNumber}
                                </span>
                                <div className="flex items-center gap-2 text-[10px]">
                                  <span className="text-emerald-700 font-semibold">
                                    Used: {bar.usedHeightMm} mm
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500 font-medium">
                                    Offcut: {bar.remainingHeightMm} mm
                                  </span>
                                </div>
                              </div>

                              {/* Visual Segments */}
                              <div className="w-full h-4 rounded bg-slate-200/80 border border-slate-200 flex overflow-hidden">
                                {bar.cuts.map((cut, cIdx) => {
                                  const cutPct = (cut.lengthMm / STANDARD_LOUVER_HEIGHT_MM) * 100;
                                  const colorClass = BAR_COLORS[cIdx % BAR_COLORS.length];

                                  return (
                                    <div
                                      key={cIdx}
                                      className={`h-full ${colorClass} text-[8px] font-bold flex items-center justify-center px-1 truncate border-r border-white/20`}
                                      style={{ width: `${cutPct}%` }}
                                      title={`${cut.sectionName} (#${cut.stripIndex}): ${cut.lengthMm} mm`}
                                    >
                                      {cut.lengthMm}mm
                                    </div>
                                  );
                                })}

                                {bar.remainingHeightMm > 0 && (
                                  <div
                                    className="h-full bg-slate-200 text-slate-500 text-[8px] font-medium flex items-center justify-center px-1 truncate"
                                    style={{ width: `${leftPct}%` }}
                                    title={`Remaining Offcut: ${bar.remainingHeightMm} mm`}
                                  >
                                    {bar.remainingHeightMm > 150 ? `${bar.remainingHeightMm}mm offcut` : ''}
                                  </div>
                                )}
                              </div>

                              {/* Cut Pieces Tags */}
                              <div className="flex flex-wrap gap-1">
                                {bar.cuts.map((cut, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700"
                                  >
                                    {cut.sectionName} (#{cut.stripIndex}): <strong>{cut.lengthMm}mm</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {tr.totalPanelsRequired === 0 && (
                    <div className="text-center py-2 text-xs text-slate-400">
                      No sections configured for this Louver Type.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
