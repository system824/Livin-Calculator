import React from 'react';
import { Eye, Layers, Box, Info } from 'lucide-react';
import { LouverType, LouverCalculationResults } from '../types';
import { STANDARD_LOUVER_WIDTH_MM, STANDARD_LOUVER_HEIGHT_MM } from '../utils/louverCalculator';

interface LouverVisualizerProps {
  types: LouverType[];
  results: LouverCalculationResults;
}

export const LouverVisualizer: React.FC<LouverVisualizerProps> = ({
  types,
  results,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Louver Panel Wall Elevations & Elevation Visualizer
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          300 mm Fluted Columns • 2400 mm Sheet Height
        </span>
      </div>

      {/* Grid of Louver Types and their Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((louverType, tIdx) => {
          const typeResult = results.typesResults.find((r) => r.typeId === louverType.id);

          return (
            <div
              key={louverType.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
            >
              {/* Type Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {tIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {louverType.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {louverType.sections.length} {louverType.sections.length === 1 ? 'Section' : 'Sections'}
                    </span>
                  </div>
                </div>

                {typeResult && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200">
                    {typeResult.totalPanelsRequired} Panels Total
                  </span>
                )}
              </div>

              {/* Render each section inside this Louver Type */}
              <div className="space-y-3">
                {louverType.sections.map((section, sIdx) => {
                  const w = section.widthMm || 0;
                  const h = section.heightMm || 0;
                  const columnsCount = w > 0 ? Math.ceil(w / STANDARD_LOUVER_WIDTH_MM) : 0;
                  const hasJoint = h > STANDARD_LOUVER_HEIGHT_MM;
                  const isLastTrimmed = w > 0 && w % STANDARD_LOUVER_WIDTH_MM !== 0;
                  const trimmedMm = isLastTrimmed ? (columnsCount * STANDARD_LOUVER_WIDTH_MM) - w : 0;

                  return (
                    <div key={section.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {section.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {w} × {h} mm
                        </span>
                      </div>

                      {/* Elevation Scaled Box */}
                      <div className="h-36 w-full bg-slate-900 rounded-lg p-2.5 relative flex items-center justify-center overflow-hidden shadow-inner">
                        {/* Dot Grid Background */}
                        <div 
                          className="absolute inset-0 opacity-15"
                          style={{
                            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                            backgroundSize: '10px 10px'
                          }}
                        />

                        {/* Wall Carcass Container */}
                        <div 
                          className="relative flex border-2 border-orange-500/80 bg-slate-800/90 rounded-xs overflow-hidden shadow-md max-h-28 max-w-[90%]"
                          style={{
                            width: `${Math.min(220, Math.max(60, (w / 3000) * 200))}px`,
                            height: `${Math.min(100, Math.max(40, (h / 3000) * 90))}px`,
                          }}
                        >
                          {/* Columns */}
                          {Array.from({ length: Math.min(12, Math.max(1, columnsCount)) }).map((_, cIdx) => {
                            const isLast = cIdx === columnsCount - 1;
                            return (
                              <div
                                key={cIdx}
                                className={`h-full border-r border-orange-400/40 relative flex flex-col justify-between ${
                                  isLast && isLastTrimmed ? 'bg-orange-600/30' : 'bg-orange-500/20'
                                }`}
                                style={{ flex: isLast && isLastTrimmed ? 0.7 : 1 }}
                              >
                                {/* Vertical Fluting Micro Stripes */}
                                <div className="h-full w-full flex justify-around opacity-30 py-1">
                                  <div className="w-px h-full bg-orange-300" />
                                  <div className="w-px h-full bg-orange-300" />
                                </div>

                                {/* Joint line if height > 2400 mm */}
                                {hasJoint && (
                                  <div 
                                    className="absolute left-0 right-0 h-0.5 bg-rose-500 z-10" 
                                    style={{ bottom: `${(STANDARD_LOUVER_HEIGHT_MM / h) * 100}%` }}
                                    title="2400mm Joint line"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Micro Specs */}
                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>
                          {columnsCount} Columns ({columnsCount} × 300mm)
                        </span>
                        {isLastTrimmed && (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Trim last col by {trimmedMm}mm
                          </span>
                        )}
                        {hasJoint && (
                          <span className="text-rose-600 font-semibold">
                            Joint at 2400mm
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
