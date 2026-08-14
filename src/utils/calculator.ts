import { 
  PrimaryCeilingInputs, 
  ExtraItem, 
  CeilingCalculationResults,
  ItemBreakdown,
  ExtraCategory
} from '../types';

export const mmToFt = (mm: number): number => {
  if (!mm || isNaN(mm)) return 0;
  return mm / 300;
};

export const formatFt = (mm: number): string => {
  const ft = mmToFt(mm);
  return ft.toFixed(2);
};

export const DEFAULT_PRIMARY_INPUTS: PrimaryCeilingInputs = {
  category: 'PERIPHERAL',
  peripheralSubOption: 'ONLY_PERIPHERAL_DROP',
  islandSubOption: 'WITH_COVE',
  lengthMm: 4800,
  widthMm: 3600,
  peripheralWidthMm: 600,
};

export const EMPTY_PRIMARY_INPUTS: PrimaryCeilingInputs = {
  category: 'PERIPHERAL',
  peripheralSubOption: 'ONLY_PERIPHERAL_DROP',
  islandSubOption: 'WITH_COVE',
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

export function calculateCeilingWithExtras(
  primary: PrimaryCeilingInputs,
  extras: ExtraItem[]
): CeilingCalculationResults {
  // 1. Primary ceiling calculation
  const pL_ft = mmToFt(primary.lengthMm);
  const pW_ft = mmToFt(primary.widthMm);
  const pPW_ft = mmToFt(primary.peripheralWidthMm);

  let primarySurfaceSqft = 0;
  let primaryEdgeRft = 0;
  let primaryEdgeMultiplier = 0;
  let primaryEdgeSqft = 0;
  let primaryCoveRft = 0;
  let primaryCategoryLabel = '';
  let primaryDimensionsLabel = '';
  let primaryNotes = '';

  if (primary.category === 'PERIPHERAL') {
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm (PW: ${primary.peripheralWidthMm} mm) [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;
    
    if (primary.peripheralSubOption === 'FULL_AREA_COVERED') {
      primaryCategoryLabel = 'Peripheral (Drop with center area covered)';
    } else {
      primaryCategoryLabel = 'Peripheral (Only peripheral drop)';
    }

    if (pL_ft > 0 && pW_ft > 0 && pPW_ft > 0) {
      const innerL = Math.max(0, pL_ft - 2 * pPW_ft);
      const innerW = Math.max(0, pW_ft - 2 * pPW_ft);
      const innerPerimeter = 2 * (innerL + innerW);

      primaryEdgeRft = innerPerimeter;
      primaryEdgeMultiplier = 2; // Peripheral cove drop is ×2
      primaryEdgeSqft = innerPerimeter * 2;
      primaryCoveRft = innerPerimeter;

      if (primary.peripheralSubOption === 'FULL_AREA_COVERED') {
        primarySurfaceSqft = pL_ft * pW_ft;
        primaryNotes = 'Full ceiling surface + inner cove perimeter (×2)';
      } else {
        primarySurfaceSqft = Math.max(0, pL_ft * pW_ft - innerL * innerW);
        primaryNotes = 'Peripheral band surface + inner cove perimeter (×2)';
      }
    }
  } else if (primary.category === 'ISLAND') {
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;
    
    if (pL_ft > 0 && pW_ft > 0) {
      primarySurfaceSqft = pL_ft * pW_ft;
      const perimeter = 2 * (pL_ft + pW_ft);
      primaryEdgeRft = perimeter;

      if (primary.islandSubOption === 'WITH_COVE') {
        primaryCategoryLabel = 'Island Ceiling (With cove)';
        primaryEdgeMultiplier = 2; // With cove is ×2
        primaryEdgeSqft = perimeter * 2;
        primaryCoveRft = perimeter;
        primaryNotes = 'Surface area + perimeter (×2)';
      } else {
        primaryCategoryLabel = 'Island Ceiling (Without cove)';
        primaryEdgeMultiplier = 1; // Without cove is ×1
        primaryEdgeSqft = perimeter * 1;
        primaryCoveRft = 0;
        primaryNotes = 'Surface area + perimeter (×1)';
      }
    } else {
      primaryCategoryLabel = primary.islandSubOption === 'WITH_COVE' ? 'Island Ceiling (With cove)' : 'Island Ceiling (Without cove)';
    }
  } else if (primary.category === 'L_SHAPE') {
    primaryCategoryLabel = 'L-Shape Ceiling';
    primaryDimensionsLabel = `${primary.lengthMm} × ${primary.widthMm} mm (PW: ${primary.peripheralWidthMm} mm) [${formatFt(primary.lengthMm)} × ${formatFt(primary.widthMm)} ft]`;

    if (pL_ft > 0 && pW_ft > 0 && pPW_ft > 0) {
      const innerL = Math.max(0, pL_ft - pPW_ft);
      const innerW = Math.max(0, pW_ft - pPW_ft);
      primarySurfaceSqft = pL_ft * pPW_ft + innerW * pPW_ft;
      const coveLen = innerL + innerW;
      primaryEdgeRft = coveLen;
      primaryEdgeMultiplier = 2;
      primaryEdgeSqft = coveLen * 2;
      primaryCoveRft = coveLen;
      primaryNotes = 'L-Shape band surface + inner cove step (×2)';
    }
  }

  const primaryFcSqft = primarySurfaceSqft + primaryEdgeSqft;
  const primaryAdaptors = primaryCoveRft > 0 ? Math.ceil(primaryCoveRft / 15) : 0;

  const primaryBreakdown: ItemBreakdown = {
    name: 'Primary Ceiling',
    categoryLabel: primaryCategoryLabel,
    dimensionsLabel: primaryDimensionsLabel,
    surfaceAreaSqft: Number(primarySurfaceSqft.toFixed(2)),
    edgeRft: Number(primaryEdgeRft.toFixed(2)),
    edgeMultiplier: primaryEdgeMultiplier,
    edgeSqft: Number(primaryEdgeSqft.toFixed(2)),
    fcSqft: Number(primaryFcSqft.toFixed(2)),
    coveRft: Number(primaryCoveRft.toFixed(2)),
    adaptors: primaryAdaptors,
    notes: primaryNotes,
  };

  // 2. Extra items calculation
  const extrasBreakdown: ItemBreakdown[] = [];

  extras.forEach((item, index) => {
    const itemL_ft = mmToFt(item.lengthMm);
    const itemW_ft = mmToFt(item.widthMm);

    let itemSurfaceSqft = 0;
    let itemEdgeRft = 0;
    let itemEdgeMultiplier = 0;
    let itemEdgeSqft = 0;
    let itemCoveRft = 0;
    let itemCategoryLabel = '';
    let itemDimensionsLabel = '';
    let itemNotes = '';

    if (item.category === 'ISLAND') {
      itemDimensionsLabel = `${item.lengthMm} × ${item.widthMm} mm [${formatFt(item.lengthMm)} × ${formatFt(item.widthMm)} ft]`;

      if (itemL_ft > 0 && itemW_ft > 0) {
        itemSurfaceSqft = itemL_ft * itemW_ft;
        const perimeter = 2 * (itemL_ft + itemW_ft);
        itemEdgeRft = perimeter;

        if (item.islandSubOption === 'WITH_COVE') {
          itemCategoryLabel = 'Island (With cove)';
          itemEdgeMultiplier = 2;
          itemEdgeSqft = perimeter * 2;
          itemCoveRft = perimeter;
          itemNotes = 'Surface area + perimeter (×2)';
        } else {
          itemCategoryLabel = 'Island (Without cove)';
          itemEdgeMultiplier = 1;
          itemEdgeSqft = perimeter * 1;
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
        itemCoveRft = 0;
        itemNotes = 'Flat extra area surface extension (no edge/cove)';
      }
    }

    const itemFcSqft = itemSurfaceSqft + itemEdgeSqft;
    const itemAdaptors = itemCoveRft > 0 ? Math.ceil(itemCoveRft / 15) : 0;

    extrasBreakdown.push({
      name: `Extra #${index + 1}`,
      categoryLabel: itemCategoryLabel,
      dimensionsLabel: itemDimensionsLabel,
      surfaceAreaSqft: Number(itemSurfaceSqft.toFixed(2)),
      edgeRft: Number(itemEdgeRft.toFixed(2)),
      edgeMultiplier: itemEdgeMultiplier,
      edgeSqft: Number(itemEdgeSqft.toFixed(2)),
      fcSqft: Number(itemFcSqft.toFixed(2)),
      coveRft: Number(itemCoveRft.toFixed(2)),
      adaptors: itemAdaptors,
      notes: itemNotes,
    });
  });

  // Cumulative Totals
  const totalSurfaceAreaSqft = primaryBreakdown.surfaceAreaSqft + 
    extrasBreakdown.reduce((sum, item) => sum + item.surfaceAreaSqft, 0);

  const totalCoveRft = primaryBreakdown.coveRft + 
    extrasBreakdown.reduce((sum, item) => sum + item.coveRft, 0);

  const totalEdgeSqft = primaryBreakdown.edgeSqft + 
    extrasBreakdown.reduce((sum, item) => sum + item.edgeSqft, 0);

  const totalFcSqft = primaryBreakdown.fcSqft + 
    extrasBreakdown.reduce((sum, item) => sum + item.fcSqft, 0);

  const totalStripLightRft = totalCoveRft;
  // Electrical calculation: For every continuous strip light there is 1 adaptor required for every 15' (e.g. 35' peripheral = 3, 20' island = 2 => 3 + 2 = 5)
  const totalAdaptors = primaryBreakdown.adaptors + 
    extrasBreakdown.reduce((sum, item) => sum + item.adaptors, 0);

  return {
    totalSurfaceAreaSqft: Number(totalSurfaceAreaSqft.toFixed(2)),
    totalCoveRft: Number(totalCoveRft.toFixed(2)),
    totalEdgeSqft: Number(totalEdgeSqft.toFixed(2)),
    totalFcSqft: Number(totalFcSqft.toFixed(2)),
    totalStripLightRft: Number(totalStripLightRft.toFixed(2)),
    totalAdaptors,
    primaryBreakdown,
    extrasBreakdown,
  };
}
