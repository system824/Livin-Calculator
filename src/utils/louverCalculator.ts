import { 
  LouverType,
  LouverProduct,
  LouverSection, 
  LouverCutPiece,
  LouverStockBar,
  LouverSectionResult, 
  LouverTypeResult,
  LouverCalculationResults 
} from '../types';

export const STANDARD_LOUVER_WIDTH_MM = 300; // 300 mm (approx 1 ft)
export const STANDARD_LOUVER_HEIGHT_MM = 2400; // 2400 mm (8 ft)

export const DEFAULT_LOUVER_TYPES: LouverType[] = [
  {
    id: 'lt_1',
    name: 'Louver Type 1',
    sections: [
      {
        id: 'sec_1_1',
        name: 'Section 1',
        widthMm: 1200,
        heightMm: 2400,
      },
      {
        id: 'sec_1_2',
        name: 'Section 2',
        widthMm: 1200,
        heightMm: 600,
      },
    ],
  },
  {
    id: 'lt_2',
    name: 'Louver Type 2',
    sections: [
      {
        id: 'sec_2_1',
        name: 'Section 1',
        widthMm: 600,
        heightMm: 1800,
      },
      {
        id: 'sec_2_2',
        name: 'Section 2',
        widthMm: 600,
        heightMm: 600,
      },
    ],
  },
];

export const DEFAULT_LOUVER_PRODUCTS = DEFAULT_LOUVER_TYPES;

export function createNewLouverType(index: number = 1): LouverType {
  return {
    id: `lt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: `Louver Type ${index}`,
    sections: [
      {
        id: `sec_${Date.now()}_1`,
        name: 'Section 1',
        widthMm: 900,
        heightMm: 2400,
      },
    ],
  };
}

export const createNewLouverProduct = createNewLouverType;

export function createNewLouverSection(typeIndex: number = 1, sectionIndex: number = 1): LouverSection {
  return {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: `Section ${sectionIndex}`,
    widthMm: 600,
    heightMm: 1200,
  };
}

export function calculateAllLouverTypes(
  types: LouverType[]
): LouverCalculationResults {
  const panelW = STANDARD_LOUVER_WIDTH_MM;
  const panelH = STANDARD_LOUVER_HEIGHT_MM;

  let totalFullPanelsDirect = 0;
  let totalCutPanelsRequired = 0;

  const typesResults: LouverTypeResult[] = [];

  types.forEach((louverType) => {
    let typeFullPanelsCount = 0;
    const typeCutPieces: LouverCutPiece[] = [];
    const sectionsResults: LouverSectionResult[] = [];
    const fullPanelsSchedule: LouverStockBar[] = [];

    louverType.sections.forEach((section) => {
      const w = Math.max(0, section.widthMm || 0);
      const h = Math.max(0, section.heightMm || 0);

      // Number of 300mm columns required across width
      const panelsAcrossWidth = w > 0 ? Math.ceil(w / panelW) : 0;

      // Full 2400mm tiers
      const fullHeightTiers = h > 0 ? Math.floor(h / panelH) : 0;
      const fullPanelsCount = panelsAcrossWidth * fullHeightTiers;

      typeFullPanelsCount += fullPanelsCount;

      // Add full uncut panels to fullPanelsSchedule for this section
      for (let p = 1; p <= fullPanelsCount; p++) {
        fullPanelsSchedule.push({
          barNumber: fullPanelsSchedule.length + 1,
          stockHeightMm: panelH,
          stockWidthMm: panelW,
          isFullPanel: true,
          usedHeightMm: panelH,
          remainingHeightMm: 0,
          cuts: [
            {
              typeId: louverType.id,
              typeName: louverType.name || 'Louver Type',
              sectionId: section.id,
              sectionName: section.name || 'Section',
              stripIndex: p,
              lengthMm: panelH,
            },
          ],
        });
      }

      // Excess height per column (if any)
      const excessHeightMm = h > 0 ? h % panelH : 0;

      if (excessHeightMm > 0 && panelsAcrossWidth > 0) {
        for (let col = 1; col <= panelsAcrossWidth; col++) {
          typeCutPieces.push({
            typeId: louverType.id,
            typeName: louverType.name || 'Louver Type',
            sectionId: section.id,
            sectionName: section.name || 'Section',
            stripIndex: col,
            lengthMm: excessHeightMm,
          });
        }
      }

      // Trimming on last column if width is not multiple of 300mm
      const totalWidthSupplied = panelsAcrossWidth * panelW;
      const widthTrimmingMm = Math.max(0, totalWidthSupplied - w);

      // Area calculations (300mm = 1ft, 2400mm = 8ft)
      const coveredAreaSqft = (w / 300) * (h / 300);
      const coveredAreaSqm = (w * h) / 1_000_000;

      sectionsResults.push({
        sectionId: section.id,
        name: section.name || 'Section',
        widthMm: w,
        heightMm: h,
        panelsAcrossWidth,
        fullHeightTiers,
        fullPanelsCount,
        excessHeightMm,
        effectiveCoveredAreaSqft: Number(coveredAreaSqft.toFixed(2)),
        effectiveCoveredAreaSqm: Number(coveredAreaSqm.toFixed(2)),
        widthTrimmingMm,
        hasHeightJoint: h > panelH,
      });
    });

    // Optimize cut pieces ONLY within this Louver Type (no cross-type scrap sharing)
    const sortedPieces = [...typeCutPieces].sort((a, b) => b.lengthMm - a.lengthMm);
    const cutPanelsSchedule: LouverStockBar[] = [];

    sortedPieces.forEach((piece) => {
      let bestBarIdx = -1;
      let minRemaining = Infinity;

      for (let i = 0; i < cutPanelsSchedule.length; i++) {
        const rem = cutPanelsSchedule[i].remainingHeightMm;
        if (rem >= piece.lengthMm && rem - piece.lengthMm < minRemaining) {
          bestBarIdx = i;
          minRemaining = rem - piece.lengthMm;
        }
      }

      if (bestBarIdx !== -1) {
        const bar = cutPanelsSchedule[bestBarIdx];
        bar.cuts.push({
          typeId: piece.typeId,
          typeName: piece.typeName,
          sectionId: piece.sectionId,
          sectionName: piece.sectionName,
          stripIndex: piece.stripIndex,
          lengthMm: piece.lengthMm,
        });
        bar.usedHeightMm += piece.lengthMm;
        bar.remainingHeightMm -= piece.lengthMm;
      } else {
        const newBar: LouverStockBar = {
          barNumber: cutPanelsSchedule.length + 1,
          stockHeightMm: panelH,
          stockWidthMm: panelW,
          isFullPanel: false,
          usedHeightMm: piece.lengthMm,
          remainingHeightMm: Math.max(0, panelH - piece.lengthMm),
          cuts: [
            {
              typeId: piece.typeId,
              typeName: piece.typeName,
              sectionId: piece.sectionId,
              sectionName: piece.sectionName,
              stripIndex: piece.stripIndex,
              lengthMm: piece.lengthMm,
            },
          ],
        };
        cutPanelsSchedule.push(newBar);
      }
    });

    const typeCutPanelsCount = cutPanelsSchedule.length;
    const typeTotalPanels = typeFullPanelsCount + typeCutPanelsCount;

    totalFullPanelsDirect += typeFullPanelsCount;
    totalCutPanelsRequired += typeCutPanelsCount;

    typesResults.push({
      typeId: louverType.id,
      name: louverType.name || 'Louver Type',
      sectionsCount: louverType.sections.length,
      fullPanelsDirect: typeFullPanelsCount,
      cutPanelsRequired: typeCutPanelsCount,
      totalPanelsRequired: typeTotalPanels,
      fullPanelsSchedule,
      cutPanelsSchedule,
      sectionsResults,
    });
  });

  const totalPanelsRequired = totalFullPanelsDirect + totalCutPanelsRequired;

  return {
    standardPanelWidthMm: panelW,
    standardPanelHeightMm: panelH,
    totalFullPanelsDirect,
    totalCutPanelsRequired,
    totalPanelsRequired,
    typesResults,
    productsResults: typesResults,
  };
}

export const calculateAllLouverProducts = calculateAllLouverTypes;
