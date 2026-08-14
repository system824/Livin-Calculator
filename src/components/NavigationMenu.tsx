import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Layers, 
  Ruler, 
  Frame, 
  AlignJustify,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { ActiveCalculatorTab } from '../types';

interface NavigationMenuProps {
  activeTab: ActiveCalculatorTab;
  onSelectTab: (tab: ActiveCalculatorTab) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const calculators: {
    id: ActiveCalculatorTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'CEILING',
      label: 'False Ceiling',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'ALUMINIUM',
      label: 'Aluminium Strip',
      icon: <Ruler className="w-4 h-4" />,
    },
    {
      id: 'MOLDING',
      label: 'PVC Moulding',
      icon: <Frame className="w-4 h-4" />,
    },
    {
      id: 'LOUVER',
      label: 'Louver Panels',
      icon: <AlignJustify className="w-4 h-4" />,
    },
  ];

  const currentCalc = calculators.find((c) => c.id === activeTab) || calculators[0];

  const handleSelect = (tab: ActiveCalculatorTab) => {
    onSelectTab(tab);
    setIsOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Header Bar with 3-line button on top left */}
      <header className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* 3-line hamburger button */}
          <button
            type="button"
            id="main-nav-toggle-btn"
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center"
            title="Open Calculators Menu"
            aria-label="Open Calculators Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Interior Calculators
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {currentCalc.label}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
        >
          <span>Switch Calculator</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </header>

      {/* Drawer Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
            {/* Menu Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <Calculator className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">
                  Calculators
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Calculators (No descriptions, no annotations) */}
            <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
              {calculators.map((calc) => {
                const isActive = activeTab === calc.id;
                return (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => handleSelect(calc.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all font-semibold text-sm ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {calc.icon}
                      </div>
                      <span>{calc.label}</span>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                Click any calculator to open
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
