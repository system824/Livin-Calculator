/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  ExtraCategory,
  AluminiumStripItem,
  MoldingFrameItem,
  LouverProduct,
  ActiveCalculatorTab
} from './types';
import { 
  DEFAULT_PRIMARY_INPUTS, 
  EMPTY_PRIMARY_INPUTS,
  createNewExtraItem, 
  calculateCeilingWithExtras 
} from './utils/calculator';
import { DEFAULT_ALUMINIUM_ITEMS } from './utils/aluminiumCalculator';
import { DEFAULT_MOLDING_ITEMS } from './utils/moldingCalculator';
import { DEFAULT_LOUVER_PRODUCTS } from './utils/louverCalculator';

import { NavigationMenu } from './components/NavigationMenu';
import { MinimalCeilingCalculator } from './components/MinimalCeilingCalculator';
import { AluminiumStripCalculator } from './components/AluminiumStripCalculator';
import { MoldingCalculator } from './components/MoldingCalculator';
import { LouverPanelCalculator } from './components/LouverPanelCalculator';

const STORAGE_ACTIVE_TAB_KEY = 'interior_calc_active_tab_v2';
const STORAGE_PRIMARY_KEY = 'fc_primary_ceiling_v8';
const STORAGE_EXTRAS_KEY = 'fc_extras_ceiling_v8';
const STORAGE_ALUMINIUM_KEY = 'interior_calc_aluminium_v2';
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

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const ceilingResults = useMemo(() => {
    return calculateCeilingWithExtras(primaryInputs, extraItems);
  }, [primaryInputs, extraItems]);

  // 2. Aluminium Strip State
  const [aluminiumItems, setAluminiumItems] = useState<AluminiumStripItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALUMINIUM_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_ALUMINIUM_ITEMS;
  });

  const handleSaveAluminium = (items: AluminiumStripItem[]) => {
    setAluminiumItems(items);
    try {
      localStorage.setItem(STORAGE_ALUMINIUM_KEY, JSON.stringify(items));
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

  // 4. Louver Panel State (Multi-Product Hierarchy)
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

  const handleResetCeiling = () => {
    setPrimaryInputs({ ...EMPTY_PRIMARY_INPUTS });
    setExtraItems([]);
    try {
      localStorage.setItem(STORAGE_PRIMARY_KEY, JSON.stringify(EMPTY_PRIMARY_INPUTS));
      localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const handleClearExtras = () => {
    setExtraItems([]);
    try {
      localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-slate-300 py-6 px-3 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Navigation Menu with 3-line Hamburger on Top-Left */}
        <NavigationMenu
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Content Area: Active Calculator */}
        <main className="w-full pb-10">
          {activeTab === 'CEILING' && (
            <MinimalCeilingCalculator
              primaryInputs={primaryInputs}
              extraItems={extraItems}
              results={ceilingResults}
              onChangePrimary={handleChangePrimary}
              onAddExtra={handleAddExtra}
              onUpdateExtra={handleUpdateExtra}
              onRemoveExtra={handleRemoveExtra}
              onResetAll={handleResetCeiling}
              onClearExtras={handleClearExtras}
            />
          )}

          {activeTab === 'ALUMINIUM' && (
            <AluminiumStripCalculator
              initialItems={aluminiumItems}
              onSaveItems={handleSaveAluminium}
            />
          )}

          {activeTab === 'MOLDING' && (
            <MoldingCalculator
              initialItems={moldingItems}
              onSave={handleSaveMolding}
            />
          )}

          {activeTab === 'LOUVER' && (
            <LouverPanelCalculator
              initialTypes={louverProducts}
              onSave={handleSaveLouver}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Interior Quantity Calculators • 300 mm = 1 ft Standard Conversion</p>
        <p className="text-[11px] text-slate-400">
          False Ceiling • Aluminium Strip • PVC Moulding • Louver Panels
        </p>
      </footer>
    </div>
  );
}
