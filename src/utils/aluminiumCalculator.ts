import { 
  AluminiumStripPlacement,
  AluminiumStripType,
  AluminiumStripItem, 
  AluminiumCalculationResults, 
  AluminiumTypeResult,
  StockBar, 
  CutPiece 
} from '../types';

export const STOCK_BAR_LENGTH_MM = 3000; // 10 feet = 3000 mm (standard 300 mm = 1 ft)
export const STOCK_BAR_LENGTH_FT = 10;

export const DEFAULT_ALUMINIUM_TYPES: AluminiumStripType[] = [
  {
    id: 'alt_1',
    name: 'Strip Type 1',
    placements: [
      { id: 'al_1', label: 'Door 1 & 2 Horizontal Strips', lengthMm: 500, quantity: 4 },
      { id: 'al_2', label: 'Door 3 Vertical Strips', lengthMm: 2000, quantity: 2 },
    ],
  },
];

export const DEFAULT_ALUMINIUM_ITEMS: AluminiumStripPlacement[] = [
  { id: 'al_1', label: 'Door 1 & 2 Horizontal Strips', lengthMm: 500, quantity: 4 },
  { id: 'al_2', label: 'Door 3 Vertical Strips', lengthMm: 2000, quantity: 2 },
];

export function createNewAluminiumPlacement(index: number = 1): AluminiumStripPlacement {
  return {
    id: `alp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    label: `Placement ${index}`,
    lengthMm: 1200,
    quantity: 2,
  };
}

export function createNewAluminiumType(index: number = 1): AluminiumStripType {
  return {
    id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: `Strip Type ${index}`,
    placements: [
      {
        id: `alp_${Date.now()}_1`,
        label: `Placement 1`,
        lengthMm: 1500,
        quantity: 2,
      },
    ],
  };
}

export function calculateSingleTypeStrips(
  typeId: string,
  typeName: string,
  items: AluminiumStripPlacement[],
  customStockLengthMm: number = STOCK_BAR_LENGTH_MM
): AluminiumTypeResult {
  const individualPieces: { itemId: string; label: string; lengthMm: number }[] = [];
  const oversizedPieces: { label: string; lengthMm: number; count: number }[] = [];

  let totalPieces = 0;
  let totalDesignLengthMm = 0;

  items.forEach((item) => {
    const qty = Math.max(0, Math.floor(item.quantity || 0));
    const len = Math.max(0, item.lengthMm || 0);

    if (qty > 0 && len > 0) {
      totalPieces += qty;
      totalDesignLengthMm += len * qty;

      if (len > customStockLengthMm) {
        oversizedPieces.push({
          label: item.label || 'Unnamed Placement',
          lengthMm: len,
          count: qty,
        });
      }

      for (let i = 0; i < qty; i++) {
        individualPieces.push({
          itemId: item.id,
          label: item.label || `Piece #${individualPieces.length + 1}`,
          lengthMm: len,
        });
      }
    }
  });

  // Sort descending by length for Best Fit Decreasing
  const sortedPieces = [...individualPieces].sort((a, b) => b.lengthMm - a.lengthMm);
  const stockBars: StockBar[] = [];

  sortedPieces.forEach((piece, pIdx) => {
    if (piece.lengthMm > customStockLengthMm) {
      stockBars.push({
        barNumber: stockBars.length + 1,
        stockLengthMm: customStockLengthMm,
        usedLengthMm: piece.lengthMm,
        remainingLengthMm: 0,
        cuts: [
          {
            itemId: piece.itemId,
            label: `${piece.label} (OVERSIZED - Requires joint)`,
            lengthMm: piece.lengthMm,
            pieceIndex: pIdx + 1,
          },
        ],
      });
      return;
    }

    let bestBarIndex = -1;
    let minRemainingSpace = Infinity;

    for (let i = 0; i < stockBars.length; i++) {
      const remaining = stockBars[i].remainingLengthMm;
      if (remaining >= piece.lengthMm && remaining - piece.lengthMm < minRemainingSpace) {
        bestBarIndex = i;
        minRemainingSpace = remaining - piece.lengthMm;
      }
    }

    if (bestBarIndex !== -1) {
      const bar = stockBars[bestBarIndex];
      bar.cuts.push({
        itemId: piece.itemId,
        label: piece.label,
        lengthMm: piece.lengthMm,
        pieceIndex: pIdx + 1,
      });
      bar.usedLengthMm += piece.lengthMm;
      bar.remainingLengthMm -= piece.lengthMm;
    } else {
      stockBars.push({
        barNumber: stockBars.length + 1,
        stockLengthMm: customStockLengthMm,
        usedLengthMm: piece.lengthMm,
        remainingLengthMm: customStockLengthMm - piece.lengthMm,
        cuts: [
          {
            itemId: piece.itemId,
            label: piece.label,
            lengthMm: piece.lengthMm,
            pieceIndex: pIdx + 1,
          },
        ],
      });
    }
  });

  const barsRequired = stockBars.length;
  const totalStockPurchasedMm = barsRequired * customStockLengthMm;
  const totalWastageMm = Math.max(0, totalStockPurchasedMm - totalDesignLengthMm);
  const wastagePercentage = totalStockPurchasedMm > 0 
    ? (totalWastageMm / totalStockPurchasedMm) * 100 
    : 0;

  const totalDesignLengthFt = totalDesignLengthMm / 300;
  const totalStockPurchasedFt = totalStockPurchasedMm / 300;
  const totalWastageFt = totalWastageMm / 300;

  return {
    typeId,
    name: typeName,
    totalPieces,
    totalDesignLengthMm,
    totalDesignLengthFt: Number(totalDesignLengthFt.toFixed(2)),
    barsRequired,
    totalStockPurchasedMm,
    totalStockPurchasedFt: Number(totalStockPurchasedFt.toFixed(2)),
    totalWastageMm,
    totalWastageFt: Number(totalWastageFt.toFixed(2)),
    wastagePercentage: Number(wastagePercentage.toFixed(1)),
    stockBars,
    oversizedPieces,
  };
}

export function calculateAllAluminiumTypes(
  types: AluminiumStripType[],
  customStockLengthMm: number = STOCK_BAR_LENGTH_MM
): AluminiumCalculationResults {
  const typesResults: AluminiumTypeResult[] = [];
  const allStockBars: StockBar[] = [];
  const allOversized: { label: string; lengthMm: number; count: number }[] = [];

  let totalDesignPieces = 0;
  let totalDesignLengthMm = 0;
  let totalBarsRequired = 0;
  let totalStockPurchasedMm = 0;
  let totalWastageMm = 0;
  let barCounter = 1;

  types.forEach((type) => {
    const res = calculateSingleTypeStrips(type.id, type.name, type.placements, customStockLengthMm);
    typesResults.push(res);

    totalDesignPieces += res.totalPieces;
    totalDesignLengthMm += res.totalDesignLengthMm;
    totalBarsRequired += res.barsRequired;
    totalStockPurchasedMm += res.totalStockPurchasedMm;
    totalWastageMm += res.totalWastageMm;

    res.stockBars.forEach((bar) => {
      allStockBars.push({
        ...bar,
        barNumber: barCounter++,
      });
    });

    res.oversizedPieces.forEach((op) => {
      allOversized.push(op);
    });
  });

  const totalDesignLengthFt = totalDesignLengthMm / 300;
  const totalStockPurchasedFt = totalStockPurchasedMm / 300;
  const totalWastageFt = totalWastageMm / 300;
  const wastagePercentage = totalStockPurchasedMm > 0 
    ? (totalWastageMm / totalStockPurchasedMm) * 100 
    : 0;

  return {
    stockLengthMm: customStockLengthMm,
    stockLengthFt: customStockLengthMm / 300,
    totalDesignPieces,
    totalDesignLengthMm,
    totalDesignLengthFt: Number(totalDesignLengthFt.toFixed(2)),
    barsRequired: totalBarsRequired,
    totalStockPurchasedMm,
    totalStockPurchasedFt: Number(totalStockPurchasedFt.toFixed(2)),
    totalWastageMm,
    totalWastageFt: Number(totalWastageFt.toFixed(2)),
    wastagePercentage: Number(wastagePercentage.toFixed(1)),
    typesResults,
    stockBars: allStockBars,
    oversizedPieces: allOversized,
  };
}

export function calculateAluminiumStrips(
  items: AluminiumStripItem[],
  customStockLengthMm: number = STOCK_BAR_LENGTH_MM
): AluminiumCalculationResults {
  const dummyType: AluminiumStripType = {
    id: 'single_type',
    name: 'Strip Type 1',
    placements: items,
  };
  return calculateAllAluminiumTypes([dummyType], customStockLengthMm);
}

export function createNewAluminiumItem(index: number = 1): AluminiumStripItem {
  return createNewAluminiumPlacement(index);
}
