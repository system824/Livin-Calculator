import { 
  AluminiumStripItem, 
  AluminiumCalculationResults, 
  StockBar, 
  CutPiece 
} from '../types';

export const STOCK_BAR_LENGTH_MM = 3000; // 10 feet = 3000 mm (standard 300 mm = 1 ft)
export const STOCK_BAR_LENGTH_FT = 10;

export const DEFAULT_ALUMINIUM_ITEMS: AluminiumStripItem[] = [
  { id: 'al_1', label: 'Module 1', lengthMm: 2400, quantity: 4 },
  { id: 'al_2', label: 'Module 2', lengthMm: 1200, quantity: 3 },
  { id: 'al_3', label: 'Module 3', lengthMm: 900, quantity: 6 },
];

export function calculateAluminiumStrips(
  items: AluminiumStripItem[],
  customStockLengthMm: number = STOCK_BAR_LENGTH_MM
): AluminiumCalculationResults {
  // 1. Expand all items into individual required cut pieces
  const individualPieces: { itemId: string; label: string; lengthMm: number }[] = [];
  const oversizedPieces: { label: string; lengthMm: number; count: number }[] = [];

  let totalDesignPieces = 0;
  let totalDesignLengthMm = 0;

  items.forEach((item) => {
    const qty = Math.max(0, Math.floor(item.quantity || 0));
    const len = Math.max(0, item.lengthMm || 0);

    if (qty > 0 && len > 0) {
      totalDesignPieces += qty;
      totalDesignLengthMm += len * qty;

      if (len > customStockLengthMm) {
        oversizedPieces.push({
          label: item.label || 'Unnamed Piece',
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

  // 2. Perform 1D Bin Packing (Best Fit / First Fit Decreasing) without joints
  // Sort descending by length for optimal stock usage
  const sortedPieces = [...individualPieces].sort((a, b) => b.lengthMm - a.lengthMm);

  const stockBars: StockBar[] = [];

  sortedPieces.forEach((piece, pIdx) => {
    // If piece exceeds stock bar length, it takes its own oversized bar / requires note
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

    // Try to find the best fitting existing bar (Best Fit Decreasing)
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
      // Place piece in best fitting bar
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
      // Open a new 10' stock bar
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
    stockLengthMm: customStockLengthMm,
    stockLengthFt: customStockLengthMm / 300,
    totalDesignPieces,
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

export function createNewAluminiumItem(index: number = 1): AluminiumStripItem {
  return {
    id: `al_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    label: `Module ${index}`,
    lengthMm: 1500,
    quantity: 1,
  };
}
