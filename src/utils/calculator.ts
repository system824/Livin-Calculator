import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  ReductionItem,
  CeilingCalculationResults,
  ItemBreakdown,
  ExtraCategory,
  ReductionCategory
} from '../types';

export const mmToFt = (mm: number): number => {
  if (!mm || isNaN(mm)) return 0;
  return mm / 300;
};

export const formatFt = (mm: number): string => {
  const ft = mmToFt(mm);
  return ft.toFixed(2);
};

export const mmToMtr = (mm: number): number => {
  if (!mm || isNaN(mm)) return 0;
  return mm / 1000;
};

export const DEFAULT_PRIMARY_INPUTS: PrimaryCeilingInputs = {
  category: 'PERIPHERAL',
  peripheralSubOption: 'ONLY_PERIPHERAL_DROP',
  peripheralCoveOption: 'WITH_COVE',
  islandSubOption: 'WITH_COVE',
  lShapeCoveOption: 'WITH_COVE',
  lengthMm: 4800,
  widthMm: 3600,
  peripheralWidthMm: 600,
};

export const EMPTY_PRIMARY_INPUTS: PrimaryCeilingInputs = {
  category: 'PERIPHERAL',
  peripheralSubOption: 'ONLY_PERIPHERAL_DROP',
  peripheralCoveOption: 'WITH_COVE',
  islandSubOption: 'WITH_COVE',
  lShapeCoveOption: 'WITH_COVE',
  lengthMm: 0,
  widthMm: 0,
  peripheralWidthMm: 0,
};

export function createNewExtraItem(type: ExtraCategory = 'ISLAND'): ExtraItem {
  return {
    id: `extra_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: type,
    islandSubOption: 'WITH_COVE',
    edgeSubOption: 'WITH_COVE',
    lengthMm: type === 'EDGE' ? 2400 : (type === 'EXTRA_AREA' ? 1800 : 1800),
    widthMm: type === 'EXTRA_AREA' ? 1200 : (type === 'ISLAND' ? 1200 : 0),
  };
}

export function createNewReductionItem(type: ReductionCategory = 'EXEMPTED_AREA'): ReductionItem {
  return {
    id: `reduct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: type,
    edgeSubOption: 'WITH_COVE',
    lengthMm: type === 'EDGE' ? 1200 : 1200,
    widthMm: type === 'EXEMPTED_AREA' ? 900 : 0,
  };
}

export function calculateCeilingWithExtras(
  primary: PrimaryCeilingInputs,
  extras: ExtraItem[],
  reductions: ReductionItem[] = []
): CeilingCalculationResults {
  // 1. Primary ceiling calculation
  const pL_ft = mmToFt(primary.lengthMm);
  const pW_ft = mmToFt(primary.widthMm);
  const pPW_ft = mmToFt(primary.peripheralWidthMm);

  let primarySurfaceSqft = 0;
  let primaryEdgeRft = 0;
  let primaryEdgeMultiplier = 0;
  let primaryEdgeSqft = 0;
  let primaryCoveMtr = 0;
  let primaryCoveRft = 0;
  let primaryCategoryLabel = '';
  let primaryDimensionsLabel = '';
  let primaryNotes = '';

  if (primary.category === 'PERIPHERAL') {
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm (Drop: ${primary.peripheralWidthMm} mm) [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;
    
    const coveText = primary.peripheralCoveOption === 'WITH_COVE' ? 'With Cove' : 'Without Cove';
    if (primary.peripheralSubOption === 'FULL_AREA_COVERED') {
      primaryCategoryLabel = `Peripheral (${coveText} • Center Covered)`;
    } else {
      primaryCategoryLabel = `Peripheral (${coveText} • Only Drop)`;
    }

    if (pL_ft > 0 && pW_ft > 0 && pPW_ft > 0) {
      const innerL_ft = Math.max(0, pL_ft - 2 * pPW_ft);
      const innerW_ft = Math.max(0, pW_ft - 2 * pPW_ft);
      const innerPerimeter_ft = 2 * (innerL_ft + innerW_ft);

      const innerL_mm = Math.max(0, primary.lengthMm - 2 * primary.peripheralWidthMm);
      const innerW_mm = Math.max(0, primary.widthMm - 2 * primary.peripheralWidthMm);
      const innerPerimeter_mm = 2 * (innerL_mm + innerW_mm);

      primaryEdgeRft = innerPerimeter_ft;

      if (primary.peripheralCoveOption === 'WITH_COVE') {
        primaryEdgeMultiplier = 2; // Cove is ×2
        primaryEdgeSqft = innerPerimeter_ft * 2;
        primaryCoveMtr = innerPerimeter_mm / 1000;
        primaryCoveRft = innerPerimeter_ft;
      } else {
        primaryEdgeMultiplier = 1; // Fascia drop without cove is ×1
        primaryEdgeSqft = innerPerimeter_ft * 1;
        primaryCoveMtr = 0;
        primaryCoveRft = 0;
      }

      if (primary.peripheralSubOption === 'FULL_AREA_COVERED') {
        primarySurfaceSqft = pL_ft * pW_ft;
        primaryNotes = primary.peripheralCoveOption === 'WITH_COVE'
          ? 'Full ceiling surface + inner perimeter cove (×2)'
          : 'Full ceiling surface + inner perimeter drop (×1)';
      } else {
        primarySurfaceSqft = Math.max(0, pL_ft * pW_ft - innerL_ft * innerW_ft);
        primaryNotes = primary.peripheralCoveOption === 'WITH_COVE'
          ? 'Peripheral band surface + inner perimeter cove (×2)'
          : 'Peripheral band surface + inner perimeter drop (×1)';
      }
    }
  } else if (primary.category === 'ISLAND') {
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;
    
    if (pL_ft > 0 && pW_ft > 0) {
      primarySurfaceSqft = pL_ft * pW_ft;
      const perimeter_ft = 2 * (pL_ft + pW_ft);
      const perimeter_mm = 2 * (primary.lengthMm + primary.widthMm);
      primaryEdgeRft = perimeter_ft;

      if (primary.islandSubOption === 'WITH_COVE') {
        primaryCategoryLabel = 'Island Ceiling (With cove)';
        primaryEdgeMultiplier = 2;
        primaryEdgeSqft = perimeter_ft * 2;
        primaryCoveMtr = perimeter_mm / 1000;
        primaryCoveRft = perimeter_ft;
        primaryNotes = 'Surface area + perimeter (×2)';
      } else {
        primaryCategoryLabel = 'Island Ceiling (Without cove)';
        primaryEdgeMultiplier = 1;
        primaryEdgeSqft = perimeter_ft * 1;
        primaryCoveMtr = 0;
        primaryCoveRft = 0;
        primaryNotes = 'Surface area + perimeter (×1)';
      }
    } else {
      primaryCategoryLabel = primary.islandSubOption === 'WITH_COVE' ? 'Island Ceiling (With cove)' : 'Island Ceiling (Without cove)';
    }
  } else if (primary.category === 'L_SHAPE') {
    const coveText = primary.lShapeCoveOption === 'WITH_COVE' ? 'With Cove' : 'Without Cove';
    primaryCategoryLabel = `L-Shape Ceiling (${coveText})`;
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm (Drop Width: ${primary.peripheralWidthMm} mm) [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;

    if (pL_ft > 0 && pW_ft > 0 && pPW_ft > 0) {
      const innerL_ft = Math.max(0, pL_ft - pPW_ft);
      const innerW_ft = Math.max(0, pW_ft - pPW_ft);
      primarySurfaceSqft = pL_ft * pPW_ft + innerW_ft * pPW_ft;
      const coveLen_ft = innerL_ft + innerW_ft;
      const coveLen_mm = Math.max(0, primary.lengthMm - primary.peripheralWidthMm) + Math.max(0, primary.widthMm - primary.peripheralWidthMm);

      primaryEdgeRft = coveLen_ft;

      if (primary.lShapeCoveOption === 'WITH_COVE') {
        primaryEdgeMultiplier = 2;
        primaryEdgeSqft = coveLen_ft * 2;
        primaryCoveMtr = coveLen_mm / 1000;
        primaryCoveRft = coveLen_ft;
        primaryNotes = 'L-Shape band surface + inner cove step (×2)';
      } else {
        primaryEdgeMultiplier = 1;
        primaryEdgeSqft = coveLen_ft * 1;
        primaryCoveMtr = 0;
        primaryCoveRft = 0;
        primaryNotes = 'L-Shape band surface + inner fascia step (×1)';
      }
    }
  }

  const primaryFcSqft = primarySurfaceSqft + primaryEdgeSqft;
  // Electrical rule: 1 adaptor per 15 meters
  const primaryAdaptors = primaryCoveMtr > 0 ? Math.ceil(primaryCoveMtr / 15) : 0;

  const primaryBreakdown: ItemBreakdown = {
    name: 'Primary Ceiling',
    categoryLabel: primaryCategoryLabel,
    dimensionsLabel: primaryDimensionsLabel,
    surfaceAreaSqft: Number(primarySurfaceSqft.toFixed(2)),
    edgeRft: Number(primaryEdgeRft.toFixed(2)),
    edgeMultiplier: primaryEdgeMultiplier,
    edgeSqft: Number(primaryEdgeSqft.toFixed(2)),
    fcSqft: Number(primaryFcSqft.toFixed(2)),
    coveMtr: Number(primaryCoveMtr.toFixed(2)),
    coveRft: Number(primaryCoveRft.toFixed(2)),
    adaptors: primaryAdaptors,
    notes: primaryNotes,
  };

  // 2. Extra items calculation (Addons)
  const extrasBreakdown: ItemBreakdown[] = [];

  extras.forEach((item, index) => {
    const itemL_ft = mmToFt(item.lengthMm);
    const itemW_ft = mmToFt(item.widthMm);

    let itemSurfaceSqft = 0;
    let itemEdgeRft = 0;
    let itemEdgeMultiplier = 0;
    let itemEdgeSqft = 0;
    let itemCoveMtr = 0;
    let itemCoveRft = 0;
    let itemCategoryLabel = '';
    let itemDimensionsLabel = '';
    let itemNotes = '';

    if (item.category === 'ISLAND') {
      itemDimensionsLabel = `${item.lengthMm} × ${item.widthMm} mm [${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft]`;

      if (itemL_ft > 0 && itemW_ft > 0) {
        itemSurfaceSqft = itemL_ft * itemW_ft;
        const perimeter_ft = 2 * (itemL_ft + itemW_ft);
        const perimeter_mm = 2 * (item.lengthMm + item.widthMm);
        itemEdgeRft = perimeter_ft;

        if (item.islandSubOption === 'WITH_COVE') {
          itemCategoryLabel = 'Island (With cove)';
          itemEdgeMultiplier = 2;
          itemEdgeSqft = perimeter_ft * 2;
          itemCoveMtr = perimeter_mm / 1000;
          itemCoveRft = perimeter_ft;
          itemNotes = 'Surface area + perimeter (×2)';
        } else {
          itemCategoryLabel = 'Island (Without cove)';
          itemEdgeMultiplier = 1;
          itemEdgeSqft = perimeter_ft * 1;
          itemCoveMtr = 0;
          itemCoveRft = 0;
          itemNotes = 'Surface area + perimeter (×1)';
        }
      } else {
        itemCategoryLabel = item.islandSubOption === 'WITH_COVE' ? 'Island (With cove)' : 'Island (Without cove)';
      }
    } else if (item.category === 'EDGE') {
      if (item.edgeSubOption === 'WITH_COVE') {
        itemCategoryLabel = 'Edge (With cove)';
        itemDimensionsLabel = `Length ${item.lengthMm} mm [${formatFt(item.lengthMm)} ft]`;
        if (itemL_ft > 0) {
          itemSurfaceSqft = 0;
          itemEdgeRft = itemL_ft;
          itemEdgeMultiplier = 2; // Edge with cove = ×2
          itemEdgeSqft = itemL_ft * 2;
          itemCoveMtr = item.lengthMm / 1000;
          itemCoveRft = itemL_ft;
          itemNotes = 'Curtain pocket / indirect cove edge (×2)';
        }
      } else {
        itemCategoryLabel = 'Edge (Without cove)';
        itemDimensionsLabel = `Length ${item.lengthMm} mm [${formatFt(item.lengthMm)} ft]`;
        if (itemL_ft > 0) {
          itemSurfaceSqft = 0;
          itemEdgeRft = itemL_ft;
          itemEdgeMultiplier = 1; // Edge without cove = ×1
          itemEdgeSqft = itemL_ft * 1;
          itemCoveMtr = 0;
          itemCoveRft = 0;
          itemNotes = 'Pelmet / step fascia drop without cove (×1)';
        }
      }
    } else if (item.category === 'EXTRA_AREA') {
      itemCategoryLabel = 'Extra Area';
      itemDimensionsLabel = `${item.lengthMm} × ${item.widthMm} mm [${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft]`;
      if (itemL_ft > 0 && itemW_ft > 0) {
        itemSurfaceSqft = itemL_ft * itemW_ft;
        itemEdgeRft = 0;
        itemEdgeMultiplier = 0;
        itemEdgeSqft = 0;
        itemCoveMtr = 0;
        itemCoveRft = 0;
        itemNotes = 'Flat extra area surface extension (no edge/cove)';
      }
    }

    const itemFcSqft = itemSurfaceSqft + itemEdgeSqft;
    // Electrical rule: 1 adaptor per 15 meters
    const itemAdaptors = itemCoveMtr > 0 ? Math.ceil(itemCoveMtr / 15) : 0;

    extrasBreakdown.push({
      name: `Addon #${index + 1}`,
      categoryLabel: itemCategoryLabel,
      dimensionsLabel: itemDimensionsLabel,
      surfaceAreaSqft: Number(itemSurfaceSqft.toFixed(2)),
      edgeRft: Number(itemEdgeRft.toFixed(2)),
      edgeMultiplier: itemEdgeMultiplier,
      edgeSqft: Number(itemEdgeSqft.toFixed(2)),
      fcSqft: Number(itemFcSqft.toFixed(2)),
      coveMtr: Number(itemCoveMtr.toFixed(2)),
      coveRft: Number(itemCoveRft.toFixed(2)),
      adaptors: itemAdaptors,
      notes: itemNotes,
    });
  });

  // 3. Reduction items calculation (Deductions: Exempted Area & Edge)
  const reductionsBreakdown: ItemBreakdown[] = [];

  reductions.forEach((item, index) => {
    const itemL_ft = mmToFt(item.lengthMm);
    const itemW_ft = mmToFt(item.widthMm);

    let itemSurfaceSqft = 0;
    let itemEdgeRft = 0;
    let itemEdgeMultiplier = 0;
    let itemEdgeSqft = 0;
    let itemCoveMtr = 0;
    let itemCoveRft = 0;
    let itemCategoryLabel = '';
    let itemDimensionsLabel = '';
    let itemNotes = '';

    if (item.category === 'EXEMPTED_AREA') {
      itemCategoryLabel = 'Exempted Area (Deduction)';
      itemDimensionsLabel = `${item.lengthMm} × ${item.widthMm} mm [${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft]`;
      if (itemL_ft > 0 && itemW_ft > 0) {
        itemSurfaceSqft = itemL_ft * itemW_ft;
        itemNotes = 'Cutout / exempted area deducted from surface area';
      }
    } else if (item.category === 'EDGE') {
      if (item.edgeSubOption === 'WITH_COVE') {
        itemCategoryLabel = 'Edge Reduction (With cove)';
        itemDimensionsLabel = `Length ${item.lengthMm} mm [${formatFt(item.lengthMm)} ft]`;
        if (itemL_ft > 0) {
          itemEdgeRft = itemL_ft;
          itemEdgeMultiplier = 2;
          itemEdgeSqft = itemL_ft * 2;
          itemCoveMtr = item.lengthMm / 1000;
          itemCoveRft = itemL_ft;
          itemNotes = 'Cove edge deducted (×2)';
        }
      } else {
        itemCategoryLabel = 'Edge Reduction (Without cove)';
        itemDimensionsLabel = `Length ${item.lengthMm} mm [${formatFt(item.lengthMm)} ft]`;
        if (itemL_ft > 0) {
          itemEdgeRft = itemL_ft;
          itemEdgeMultiplier = 1;
          itemEdgeSqft = itemL_ft * 1;
          itemCoveMtr = 0;
          itemCoveRft = 0;
          itemNotes = 'Fascia drop edge deducted (×1)';
        }
      }
    }

    const itemFcSqft = itemSurfaceSqft + itemEdgeSqft;
    const itemAdaptors = itemCoveMtr > 0 ? Math.ceil(itemCoveMtr / 15) : 0;

    reductionsBreakdown.push({
      name: `Reduction #${index + 1}`,
      categoryLabel: itemCategoryLabel,
      dimensionsLabel: itemDimensionsLabel,
      surfaceAreaSqft: Number(itemSurfaceSqft.toFixed(2)),
      edgeRft: Number(itemEdgeRft.toFixed(2)),
      edgeMultiplier: itemEdgeMultiplier,
      edgeSqft: Number(itemEdgeSqft.toFixed(2)),
      fcSqft: Number(itemFcSqft.toFixed(2)),
      coveMtr: Number(itemCoveMtr.toFixed(2)),
      coveRft: Number(itemCoveRft.toFixed(2)),
      adaptors: itemAdaptors,
      isReduction: true,
      notes: itemNotes,
    });
  });

  // Cumulative Totals
  const totalAddonSurface = extrasBreakdown.reduce((sum, item) => sum + item.surfaceAreaSqft, 0);
  const totalReductionSurface = reductionsBreakdown.reduce((sum, item) => sum + item.surfaceAreaSqft, 0);
  const rawTotalSurfaceArea = Math.max(0, primarySurfaceSqft + totalAddonSurface - totalReductionSurface);

  const totalAddonEdge = extrasBreakdown.reduce((sum, item) => sum + item.edgeSqft, 0);
  const totalReductionEdge = reductionsBreakdown.reduce((sum, item) => sum + item.edgeSqft, 0);
  const rawTotalEdge = Math.max(0, primaryEdgeSqft + totalAddonEdge - totalReductionEdge);

  const totalAddonCoveMtr = extrasBreakdown.reduce((sum, item) => sum + item.coveMtr, 0);
  const totalReductionCoveMtr = reductionsBreakdown.reduce((sum, item) => sum + item.coveMtr, 0);
  const rawTotalCoveMtr = Math.max(0, primaryCoveMtr + totalAddonCoveMtr - totalReductionCoveMtr);

  const totalAddonCoveRft = extrasBreakdown.reduce((sum, item) => sum + item.coveRft, 0);
  const totalReductionCoveRft = reductionsBreakdown.reduce((sum, item) => sum + item.coveRft, 0);
  const rawTotalCoveRft = Math.max(0, primaryCoveRft + totalAddonCoveRft - totalReductionCoveRft);

  const rawTotalReductionSqft = totalReductionSurface + totalReductionEdge;
  const rawTotalFc = Math.max(0, rawTotalSurfaceArea + rawTotalEdge);

  const totalSurfaceAreaSqft = Number(rawTotalSurfaceArea.toFixed(2));
  const totalCoveMtr = Number(rawTotalCoveMtr.toFixed(2));
  const totalCoveRft = Number(rawTotalCoveRft.toFixed(2));
  const totalEdgeSqft = Number(rawTotalEdge.toFixed(2));
  const totalReductionSqft = Number(rawTotalReductionSqft.toFixed(2));
  const totalFcSqft = Number(rawTotalFc.toFixed(2));

  const totalStripLightMtr = totalCoveMtr;
  const totalStripLightRft = totalCoveRft;

  // Electrical calculation: 1 adaptor per 15 meters
  const totalAdaptors = primaryBreakdown.adaptors + 
    extrasBreakdown.reduce((sum, item) => sum + item.adaptors, 0);

  return {
    totalSurfaceAreaSqft,
    totalCoveMtr,
    totalCoveRft,
    totalEdgeSqft,
    totalReductionSqft,
    totalFcSqft,
    totalStripLightMtr,
    totalStripLightRft,
    totalAdaptors,
    primaryBreakdown,
    extrasBreakdown,
    reductionsBreakdown,
  };
}

