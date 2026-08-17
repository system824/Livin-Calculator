import React, { useState } from 'react';
import { 
  Layers, 
  Zap, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { PrimaryCeilingInputs, ExtraItem, CeilingCalculationResults } from '../types';
import { formatFt } from '../utils/calculator';

interface CeilingVisualizerProps {
  primaryInputs: PrimaryCeilingInputs;
  extraItems: ExtraItem[];
  results: CeilingCalculationResults;
}

export const CeilingVisualizer: React.FC<CeilingVisualizerProps> = ({
  primaryInputs,
  extraItems,
  results,
}) => {
  const [showLights, setShowLights] = useState(true);

  // Scaled dimensions calculation for SVG Plan View
  const roomL = Math.max(primaryInputs.lengthMm || 3000, 800);
  const roomW = Math.max(primaryInputs.widthMm || 2400, 800);
  const pw = Math.min(primaryInputs.peripheralWidthMm || 600, Math.min(roomL, roomW) / 2.2);

  // Check if there are side extra areas to accommodate in canvas bounds
  const extraAreaItems = extraItems.filter((e) => e.category === 'EXTRA_AREA' && e.lengthMm > 0 && e.widthMm > 0);
  const maxExtraAreaW = extraAreaItems.reduce((max, e) => Math.max(max, e.widthMm), 0);

  const svgWidth = 640;
  const svgHeight = 420;
  const paddingLeft = 55;
  const paddingRight = extraAreaItems.length > 0 ? 110 : 55;
  const paddingTop = 50;
  const paddingBottom = 45;

  const drawWidth = svgWidth - paddingLeft - paddingRight;
  const drawHeight = svgHeight - paddingTop - paddingBottom;

  const totalEffectiveL = roomL + (extraAreaItems.length > 0 ? Math.min(maxExtraAreaW, roomL * 0.4) : 0);
  const scale = Math.min(drawWidth / totalEffectiveL, drawHeight / roomW);

  const scaledL = roomL * scale;
  const scaledW = roomW * scale;

  // Primary room origin
  const startX = paddingLeft + 10;
  const startY = paddingTop + (drawHeight - scaledW) / 2;
  const scaledPW = pw * scale;

  // Inner peripheral hole
  const innerX = startX + scaledPW;
  const innerY = startY + scaledPW;
  const innerL = Math.max(0, scaledL - 2 * scaledPW);
  const innerW = Math.max(0, scaledW - 2 * scaledPW);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Ceiling 2D Plan & Layout
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time dimensioned schematic with cove lighting and addon overlays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLights(!showLights)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-sm ${
              showLights 
                ? 'bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Toggle Strip Light / Cove Glow"
          >
            <Zap className={`w-3.5 h-3.5 ${showLights ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
            <span>{showLights ? 'Cove Lights: ON' : 'Cove Lights: OFF'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden shadow-inner flex flex-col items-center justify-center">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-h-[390px] h-auto select-none"
        >
          <defs>
            {/* Glow filter for cove light */}
            <filter id="cove-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Hatch pattern for extra area */}
            <pattern id="extra-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
            </pattern>
          </defs>

          {/* Room Base Outline */}
          <rect
            x={startX}
            y={startY}
            width={scaledL}
            height={scaledW}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
            rx="4"
          />

          {/* Render Based on Primary Ceiling Category */}
          {primaryInputs.category === 'PERIPHERAL' && (
            <>
              {/* Peripheral Drop Band Area */}
              <path
                d={`
                  M ${startX} ${startY}
                  L ${startX + scaledL} ${startY}
                  L ${startX + scaledL} ${startY + scaledW}
                  L ${startX} ${startY + scaledW}
                  Z
                  M ${innerX} ${innerY}
                  L ${innerX} ${innerY + innerW}
                  L ${innerX + innerL} ${innerY + innerW}
                  L ${innerX + innerL} ${innerY}
                  Z
                `}
                fill="#1e293b"
                fillRule="evenodd"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Center Area */}
              <rect
                x={innerX}
                y={innerY}
                width={innerL}
                height={innerW}
                fill={primaryInputs.peripheralSubOption === 'FULL_AREA_COVERED' ? '#334155' : '#090d16'}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Inner Cove Light Border & Glow */}
              {showLights && results.primaryBreakdown.coveRft > 0 && (
                <>
                  <rect
                    x={innerX}
                    y={innerY}
                    width={innerL}
                    height={innerW}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    filter="url(#cove-glow)"
                    className="transition-all animate-pulse"
                  />
                  <text
                    x={innerX + innerL / 2}
                    y={innerY + 16}
                    fill="#fef08a"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="0.5"
                  >
                    COVE STRIP LIGHT ({results.primaryBreakdown.coveRft} RFT)
                  </text>
                </>
              )}

              {/* Peripheral Width Indicator */}
              {primaryInputs.peripheralWidthMm > 0 && (
                <g>
                  <line
                    x1={startX}
                    y1={startY + scaledW / 2}
                    x2={innerX}
                    y2={startY + scaledW / 2}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <circle cx={startX} cy={startY + scaledW / 2} r="2" fill="#94a3b8" />
                  <circle cx={innerX} cy={startY + scaledW / 2} r="2" fill="#94a3b8" />
                  <text
                    x={startX + scaledPW / 2}
                    y={startY + scaledW / 2 - 5}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    PW: {primaryInputs.peripheralWidthMm}mm ({formatFt(primaryInputs.peripheralWidthMm)}ft)
                  </text>
                </g>
              )}

              {/* Center Label */}
              <text
                x={innerX + innerL / 2}
                y={innerY + innerW / 2}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {primaryInputs.peripheralSubOption === 'FULL_AREA_COVERED'
                  ? 'Center Level Covered (Drop)'
                  : 'Recessed Ceiling / Slab'}
              </text>
            </>
          )}

          {primaryInputs.category === 'ISLAND' && (
            <>
              {/* Ceiling Base Area */}
              <rect
                x={startX}
                y={startY}
                width={scaledL}
                height={scaledW}
                fill="#090d16"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Centered Island Box */}
              {(() => {
                const islandL = Math.max(80, scaledL * 0.75);
                const islandW = Math.max(60, scaledW * 0.75);
                const islandX = startX + (scaledL - islandL) / 2;
                const islandY = startY + (scaledW - islandW) / 2;

                return (
                  <>
                    <rect
                      x={islandX}
                      y={islandY}
                      width={islandL}
                      height={islandW}
                      fill="#1e293b"
                      stroke="#64748b"
                      strokeWidth="2"
                      rx="4"
                    />

                    {/* Island Cove Light Glow */}
                    {primaryInputs.islandSubOption === 'WITH_COVE' && showLights && (
                      <rect
                        x={islandX - 3}
                        y={islandY - 3}
                        width={islandL + 6}
                        height={islandW + 6}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        filter="url(#cove-glow)"
                        rx="6"
                      />
                    )}

                    <text
                      x={islandX + islandL / 2}
                      y={islandY + islandW / 2 - 6}
                      fill="#f8fafc"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Island Ceiling
                    </text>
                    <text
                      x={islandX + islandL / 2}
                      y={islandY + islandW / 2 + 10}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {primaryInputs.lengthMm} × {primaryInputs.widthMm} mm ({primaryInputs.islandSubOption === 'WITH_COVE' ? 'With Cove' : 'Without Cove'})
                    </text>
                  </>
                );
              })()}
            </>
          )}

          {primaryInputs.category === 'L_SHAPE' && (
            <>
              {/* L Shape Band */}
              <path
                d={`
                  M ${startX} ${startY}
                  L ${startX + scaledL} ${startY}
                  L ${startX + scaledL} ${startY + scaledPW}
                  L ${startX + scaledPW} ${startY + scaledPW}
                  L ${startX + scaledPW} ${startY + scaledW}
                  L ${startX} ${startY + scaledW}
                  Z
                `}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Inner Cove Light Glow for L-Shape */}
              {showLights && (
                <path
                  d={`
                    M ${startX + scaledL} ${startY + scaledPW}
                    L ${startX + scaledPW} ${startY + scaledPW}
                    L ${startX + scaledPW} ${startY + scaledW}
                  `}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  filter="url(#cove-glow)"
                />
              )}

              <text
                x={startX + scaledPW + (scaledL - scaledPW) / 2}
                y={startY + scaledPW + (scaledW - scaledPW) / 2}
                fill="#64748b"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Ceiling Base / Slab
              </text>
            </>
          )}

          {/* ================= RENDER EXTRAS: ISLANDS, EDGES, EXTRA AREAS ================= */}
          {extraItems.map((extra, idx) => {
            // 1. Extra: Island
            if (extra.category === 'ISLAND') {
              const exL = Math.max(50, (extra.lengthMm / 300) * scale * 300);
              const exW = Math.max(35, (extra.widthMm / 300) * scale * 300);
              const exX = startX + (scaledL - exL) / 2 + (idx % 2 === 0 ? 0 : 20);
              const exY = startY + (scaledW - exW) / 2 + (idx % 2 === 0 ? 0 : 15);

              return (
                <g key={extra.id}>
                  <rect
                    x={exX}
                    y={exY}
                    width={exL}
                    height={exW}
                    fill="#334155"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    rx="3"
                  />
                  {extra.islandSubOption === 'WITH_COVE' && showLights && (
                    <rect
                      x={exX - 2}
                      y={exY - 2}
                      width={exL + 4}
                      height={exW + 4}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      filter="url(#cove-glow)"
                      rx="4"
                    />
                  )}
                  <text
                    x={exX + exL / 2}
                    y={exY + exW / 2 - 3}
                    fill="#f1f5f9"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Extra #{idx + 1}: Island
                  </text>
                  <text
                    x={exX + exL / 2}
                    y={exY + exW / 2 + 8}
                    fill="#cbd5e1"
                    fontSize="7.5"
                    textAnchor="middle"
                  >
                    {extra.lengthMm}×{extra.widthMm}mm ({extra.islandSubOption === 'WITH_COVE' ? 'Cove' : 'No Cove'})
                  </text>
                </g>
              );
            }

            // 2. Extra: Edge (Matched precisely with the input size)
            if (extra.category === 'EDGE') {
              // Precise scale match
              const edgeLen = Math.min(scaledL, (extra.lengthMm / 300) * scale * 300);
              const isCove = extra.edgeSubOption === 'WITH_COVE';
              
              // Place edges along walls or stepped inside
              const edgeX = startX + (scaledL - edgeLen) / 2;
              const edgeY = startY + scaledW - 14 - (idx * 16);

              return (
                <g key={extra.id}>
                  {/* Background track line */}
                  <line
                    x1={edgeX}
                    y1={edgeY}
                    x2={edgeX + edgeLen}
                    y2={edgeY}
                    stroke={isCove ? '#f59e0b' : '#38bdf8'}
                    strokeWidth={isCove ? '3.5' : '2.5'}
                    strokeDasharray={isCove ? '6 3' : undefined}
                    filter={isCove && showLights ? 'url(#cove-glow)' : undefined}
                  />
                  {/* End caps */}
                  <circle cx={edgeX} cy={edgeY} r="2.5" fill={isCove ? '#fbbf24' : '#38bdf8'} />
                  <circle cx={edgeX + edgeLen} cy={edgeY} r="2.5" fill={isCove ? '#fbbf24' : '#38bdf8'} />

                  <text
                    x={edgeX + edgeLen / 2}
                    y={edgeY - 5}
                    fill={isCove ? '#fef08a' : '#7dd3fc'}
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Extra #{idx + 1}: Edge ({isCove ? 'With Cove' : 'No Cove'}) — {extra.lengthMm}mm [{formatFt(extra.lengthMm)}ft]
                  </text>
                </g>
              );
            }

            // 3. Extra: Extra Area (Shown on side/extension of the layout)
            if (extra.category === 'EXTRA_AREA') {
              const areaL = Math.min(scaledW * 0.9, (extra.lengthMm / 300) * scale * 300);
              const areaW = Math.max(30, (extra.widthMm / 300) * scale * 300);
              
              // Attached to the right side of the main room
              const areaX = startX + scaledL + 8;
              const areaY = startY + (scaledW - areaL) / 2;

              return (
                <g key={extra.id}>
                  {/* Side Extension Box */}
                  <rect
                    x={areaX}
                    y={areaY}
                    width={areaW}
                    height={areaL}
                    fill="#0369a1"
                    fillOpacity="0.25"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    rx="3"
                  />
                  {/* Hatch overlay */}
                  <rect
                    x={areaX}
                    y={areaY}
                    width={areaW}
                    height={areaL}
                    fill="url(#extra-hatch)"
                  />

                  {/* Connector dashes */}
                  <line
                    x1={startX + scaledL}
                    y1={areaY + areaL / 2}
                    x2={areaX}
                    y2={areaY + areaL / 2}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  <text
                    x={areaX + areaW / 2}
                    y={areaY + areaL / 2 - 4}
                    fill="#7dd3fc"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Extra Area #{idx + 1}
                  </text>
                  <text
                    x={areaX + areaW / 2}
                    y={areaY + areaL / 2 + 7}
                    fill="#e0f2fe"
                    fontSize="7.5"
                    textAnchor="middle"
                  >
                    {extra.lengthMm}×{extra.widthMm}mm
                  </text>
                </g>
              );
            }

            return null;
          })}

          {/* Dimension Lines (Outer Length L) */}
          {primaryInputs.lengthMm > 0 && (
            <g>
              <line
                x1={startX}
                y1={startY - 18}
                x2={startX + scaledL}
                y2={startY - 18}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line x1={startX} y1={startY - 24} x2={startX} y2={startY - 12} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={startX + scaledL} y1={startY - 24} x2={startX + scaledL} y2={startY - 12} stroke="#94a3b8" strokeWidth="1.5" />
              <text
                x={startX + scaledL / 2}
                y={startY - 24}
                fill="#f8fafc"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                Length (L): {primaryInputs.lengthMm} mm [{formatFt(primaryInputs.lengthMm)} ft]
              </text>
            </g>
          )}

          {/* Dimension Lines (Outer Width W) */}
          {primaryInputs.widthMm > 0 && (
            <g>
              <line
                x1={startX - 18}
                y1={startY}
                x2={startX - 18}
                y2={startY + scaledW}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line x1={startX - 24} y1={startY} x2={startX - 12} y2={startY} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={startX - 24} y1={startY + scaledW} x2={startX - 12} y2={startY + scaledW} stroke="#94a3b8" strokeWidth="1.5" />
              <text
                x={startX - 26}
                y={startY + scaledW / 2}
                fill="#f8fafc"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 ${startX - 26} ${startY + scaledW / 2})`}
              >
                Width (W): {primaryInputs.widthMm} mm [{formatFt(primaryInputs.widthMm)} ft]
              </text>
            </g>
          )}
        </svg>

        {/* Canvas Bottom Legend */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 px-2 text-[11px] text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-600"></span>
              <span>Gypsum Drop Surface</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-amber-400 rounded-sm shadow-[0_0_6px_#fbbf24]"></span>
              <span className="text-amber-300 font-medium">Cove Light Run</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-950 border border-sky-400 border-dashed"></span>
              <span className="text-sky-300">Side Extra Area</span>
            </span>
          </div>

          <span className="font-mono text-slate-300 font-medium">
            300 mm = 1.0 ft
          </span>
        </div>

      </div>
    </div>
  );
};
