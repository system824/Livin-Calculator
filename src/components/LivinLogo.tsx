import React from 'react';

interface LivinLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const LivinLogo: React.FC<LivinLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  textColor = 'text-slate-900',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Vector SVG of the uploaded Livin Interiors Geometric Triangle Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none overflow-visible"
        aria-label="Livin Interiors Logo"
      >
        {/* Teal 'L' Segment (Apex, Left Leg, and Horizontal Base) */}
        <polygon
          points="50.00,10.00 6.70,85.00 71.50,85.00 65.73,75.00 25.17,75.00 56.35,21.00"
          fill="#1B939F"
        />

        {/* Orange Rhombus / Diamond Dot ('i' dot) */}
        <polygon
          points="58.95,25.50 64.72,35.50 58.95,45.50 53.18,35.50"
          fill="#F39C24"
        />

        {/* Orange Slanted Bar / Stem ('i' stem) */}
        <polygon
          points="72.52,49.00 93.30,85.00 87.53,85.00 66.74,59.00"
          fill="#F39C24"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-sm font-black tracking-wider uppercase ${textColor}`}>
            Livin Interiors
          </span>
        </div>
      )}
    </div>
  );
};
