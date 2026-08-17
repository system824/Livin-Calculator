/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  ExtraCategory,
  ReductionItem,
  ReductionCategory,
  AluminiumStripType,
  MoldingFrameItem,
  LouverProduct,
  ActiveCalculatorTab
} from './types';
import { 
  DEFAULT_PRIMARY_INPUTS, 
  EMPTY_PRIMARY_INPUTS,
  createNewExtraItem, 
  createNewReductionItem,
  calculateCeilingWithExtras 
} from './utils/calculator';
import { DEFAULT_ALUMINIUM_TYPES } from './utils/aluminiumCalculator';
import { DEFAULT_MOLDING_ITEMS } from './utils/moldingCalculator';
import { DEFAULT_LOUVER_PRODUCTS } from './utils/louverCalculator';

import { NavigationMenu } from './components/NavigationMenu';
import { MinimalCeilingCalculator } from './components/MinimalCeilingCalculator';
import { AluminiumStripCalculator } from './components/AluminiumStripCalculator';
import { MoldingCalculator } from './components/MoldingCalculator';
import { LouverPanelCalculator } from './components/LouverPanelCalculator';
import { CeilingManualModal } from './components/CeilingManualModal';
import { AluminiumManualModal } from './components/AluminiumManualModal';
import { MoldingManualModal } from './components/MoldingManualModal';
import { LouverManualModal } from './components/LouverManualModal';
import { LivinLogo } from './components/LivinLogo';

const STORAGE_ACTIVE_TAB_KEY = 'interior_calc_active_tab_v2';
const STORAGE_PRIMARY_KEY = 'fc_primary_ceiling_v9';
const STORAGE_EXTRAS_KEY = 'fc_extras_ceiling_v9';
const STORAGE_REDUCTIONS_KEY = 'fc_reductions_ceiling_v9';
const STORAGE_ALUMINIUM_TYPES_KEY = 'interior_calc_aluminium_types_v3';
const STORAGE_MOLDING_ITEMS_KEY = 'interior_calc_molding_items_v2';
const STORAGE_LOUVER_PRODUCTS_KEY = 'interior_calc_louver_products_v2';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveCalculatorTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_TAB_KEY);
      if (saved && ['CEILING', 'ALUMINIUM', 'MOLDING', 'LOUVER'].includes(saved)) {
        return saved as ActiveCalculatorTab;
      }
    } catch {
      // ignore
    }
    return 'CEILING';
  });

  const [activeManual, setActiveManual] = useState<ActiveCalculatorTab | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_TAB_KEY, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  // 1. False Ceiling State
  const [primaryInputs, setPrimaryInputs] = useState<PrimaryCeilingInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRIMARY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { ...DEFAULT_PRIMARY_INPUTS };
  });

  const [extraItems, setExtraItems] = useState<ExtraItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXTRAS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [reductions, setReductions] = useState<ReductionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REDUCTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRIMARY_KEY, JSON.stringify(primaryInputs));
    } catch {
      // ignore
    }
  }, [primaryInputs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify(extraItems));
    } catch {
      // ignore
    }
  }, [extraItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REDUCTIONS_KEY, JSON.stringify(reductions));
    } catch {
      // ignore
    }
  }, [reductions]);

  const ceilingResults = useMemo(() => {
    return calculateCeilingWithExtras(primaryInputs, extraItems, reductions);
  }, [primaryInputs, extraItems, reductions]);

  // 2. Aluminium Strip State (Strip Types 1, 2, 3...)
  const [aluminiumTypes, setAluminiumTypes] = useState<AluminiumStripType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALUMINIUM_TYPES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ALUMINIUM_TYPES;
  });

  const handleSaveAluminiumTypes = (types: AluminiumStripType[]) => {
    setAluminiumTypes(types);
    try {
      localStorage.setItem(STORAGE_ALUMINIUM_TYPES_KEY, JSON.stringify(types));
    } catch {
      // ignore
    }
  };

  // 3. PVC Molding State
  const [moldingItems, setMoldingItems] = useState<MoldingFrameItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MOLDING_ITEMS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_MOLDING_ITEMS;
  });

  const handleSaveMolding = (items: MoldingFrameItem[]) => {
    setMoldingItems(items);
    try {
      localStorage.setItem(STORAGE_MOLDING_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  // 4. Louver Panel State (Multi-Type Hierarchy)
  const [louverProducts, setLouverProducts] = useState<LouverProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOUVER_PRODUCTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_LOUVER_PRODUCTS;
  });

  const handleSaveLouver = (products: LouverProduct[]) => {
    setLouverProducts(products);
    try {
      localStorage.setItem(STORAGE_LOUVER_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  };

  // Ceiling Handlers
  const handleChangePrimary = <K extends keyof PrimaryCeilingInputs>(
    key: K, 
    value: PrimaryCeilingInputs[K]
  ) => {
    setPrimaryInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddExtra = (type: ExtraCategory = 'ISLAND') => {
    const newItem = createNewExtraItem(type);
    setExtraItems((prev) => [...prev, newItem]);
  };

  const handleUpdateExtra = (id: string, updated: Partial<ExtraItem>) => {
    setExtraItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleRemoveExtra = (id: string) => {
    setExtraItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearExtras = () => {
    setExtraItems([]);
    try {
      localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const handleAddReduction = (type: ReductionCategory = 'EXEMPTED_AREA') => {
    const newItem = createNewReductionItem(type);
    setReductions((prev) => [...prev, newItem]);
  };

  const handleUpdateReduction = (id: string, updated: Partial<ReductionItem>) => {
    setReductions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleRemoveReduction = (id: string) => {
    setReductions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearReductions = () => {
    setReductions([]);
    try {
      localStorage.setItem(STORAGE_REDUCTIONS_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const handleResetCeiling = () => {
    setPrimaryInputs({ ...EMPTY_PRIMARY_INPUTS });
    setExtraItems([]);
    setReductions([]);
    try {
      localStorage.setItem(STORAGE_PRIMARY_KEY, JSON.stringify(EMPTY_PRIMARY_INPUTS));
      localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_REDUCTIONS_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-slate-300 py-6 px-3 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Navigation Bar with 3-line hamburger menu on left and Manual on right */}
        <NavigationMenu
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenManual={() => setActiveManual(activeTab)}
        />

        {/* Main Content Area: Active Calculator */}
        <main className="w-full pb-10">
          {activeTab === 'CEILING' && (
            <MinimalCeilingCalculator
              primaryInputs={primaryInputs}
              extraItems={extraItems}
              reductions={reductions}
              results={ceilingResults}
              onChangePrimary={handleChangePrimary}
              onAddExtra={handleAddExtra}
              onUpdateExtra={handleUpdateExtra}
              onRemoveExtra={handleRemoveExtra}
              onAddReduction={handleAddReduction}
              onUpdateReduction={handleUpdateReduction}
              onRemoveReduction={handleRemoveReduction}
              onResetAll={handleResetCeiling}
              onClearExtras={handleClearExtras}
              onClearReductions={handleClearReductions}
              onOpenManual={() => setActiveManual('CEILING')}
            />
          )}

          {activeTab === 'ALUMINIUM' && (
            <AluminiumStripCalculator
              initialTypes={aluminiumTypes}
              onSaveTypes={handleSaveAluminiumTypes}
              onOpenManual={() => setActiveManual('ALUMINIUM')}
            />
          )}

          {activeTab === 'MOLDING' && (
            <MoldingCalculator
              initialItems={moldingItems}
              onSave={handleSaveMolding}
              onOpenManual={() => setActiveManual('MOLDING')}
            />
          )}

          {activeTab === 'LOUVER' && (
            <LouverPanelCalculator
              initialTypes={louverProducts}
              onSave={handleSaveLouver}
              onOpenManual={() => setActiveManual('LOUVER')}
            />
          )}
        </main>
      </div>

      {/* Global Manual Modals when triggered from navigation bar */}
      <CeilingManualModal
        isOpen={activeManual === 'CEILING'}
        onClose={() => setActiveManual(null)}
      />

      <AluminiumManualModal
        isOpen={activeManual === 'ALUMINIUM'}
        onClose={() => setActiveManual(null)}
        onLoadExample={(examplePlacements) => {
          handleSaveAluminiumTypes([
            {
              id: `alt_${Date.now()}_1`,
              name: '3-Door Wardrobe T-Profile (Example)',
              placements: examplePlacements,
            },
          ]);
        }}
      />

      <MoldingManualModal
        isOpen={activeManual === 'MOLDING'}
        onClose={() => setActiveManual(null)}
      />

      <LouverManualModal
        isOpen={activeManual === 'LOUVER'}
        onClose={() => setActiveManual(null)}
      />

      {/* Footer */}
      <footer className="mt-10 py-5 text-xs text-slate-500 border-t border-slate-200/80 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LivinLogo size={20} />
          <p className="font-semibold text-slate-700">
            Livin Interiors Material Calculator <span className="font-normal text-slate-500">• 300 mm = 1 ft Standard</span>
          </p>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          This calculator is designed and developed inhouse by the Livin R&D team
        </p>
      </footer>
    </div>
  );
}
