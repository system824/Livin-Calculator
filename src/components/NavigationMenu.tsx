import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Calculator,
  ChevronRight,
  Check
} from 'lucide-react';
import { ActiveCalculatorTab } from '../types';
import falseCeilingImg from '../assets/images/false_ceiling_tile_1786711567839.jpg';
import aluminiumStripImg from '../assets/images/aluminium_strip_tile_1786711582120.jpg';
import pvcMoldingImg from '../assets/images/pvc_molding_tile_1786711594944.jpg';
import louverPanelImg from '../assets/images/louver_panel_tile_1786711607656.jpg';

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
    image: string;
  }[] = [
    {
      id: 'CEILING',
      label: 'False Ceiling',
      image: falseCeilingImg,
    },
    {
      id: 'ALUMINIUM',
      label: 'Aluminium Strip',
      image: aluminiumStripImg,
    },
    {
      id: 'MOLDING',
      label: 'PVC Moulding',
      image: pvcMoldingImg,
    },
    {
      id: 'LOUVER',
      label: 'Louver Panels',
      image: louverPanelImg,
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
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Open Calculators Menu"
            aria-label="Open Calculators Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900">
                Livin Material Calculator
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {currentCalc.label}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
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
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
            {/* Menu Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <Calculator className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  Livin Material Calculator
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Calculator Image Tiles (No extra annotations or descriptions) */}
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
              {calculators.map((calc) => {
                const isActive = activeTab === calc.id;
                return (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => handleSelect(calc.id)}
                    className={`group w-full rounded-2xl border text-left transition-all overflow-hidden cursor-pointer flex flex-col ${
                      isActive
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Image Box */}
                    <div className="relative w-full h-28 sm:h-32 bg-slate-100 overflow-hidden">
                      <img
                        src={calc.image}
                        alt={calc.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute top-2.5 right-2.5 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Label Bar */}
                    <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                      <span className={`text-sm font-bold ${isActive ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-600'} transition-colors`}>
                        {calc.label}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5'} transition-all`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

