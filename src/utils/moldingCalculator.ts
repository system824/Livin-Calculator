import { 
  MoldingFrameItem, 
  MoldingCalculationResults, 
  MoldingProfileSize,
  ProfileSizeSummary,
  StockBar, 
  CutPiece 
} from '../types';

export const PVC_STOCK_BAR_LENGTH_MM = 2400; // 8 feet = 2400 mm (standard 300 mm = 1 ft)
export const PVC_STOCK_BAR_LENGTH_FT = 8;
export const FIXED_WASTAGE_FACTOR = 0.10; // Fixed 10% wastage

export const STANDARD_MOLDING_SIZES: MoldingProfileSize[] = [
  { id: 'w101', name: '22 mm | W101', widthMm: 22 },
  { id: 'w102', name: '22 mm | W102', widthMm: 22 },
  { id: 'w201', name: '30 mm | W201', widthMm: 30 },
  { id: 'w202', name: '30 mm | W202', widthMm: 30 },
];

export function getProfileSizeById(id?: string): MoldingProfileSize {
  const found = STANDARD_MOLDING_SIZES.find((s) => s.id === id);
  return found || STANDARD_MOLDING_SIZES[0];
}

export const DEFAULT_MOLDING_ITEMS: MoldingFrameItem[] = [
  {
    id: 'm_1',
    label: 'Design 1',
    type: 'DOUBLE_FRAME',
    widthMm: 1200,
    heightMm: 1800,
    quantity: 1,
    innerOffsetMm: 75,
    outerProfileSizeId: 'w201', // 30 mm | W201
    innerProfileSizeId: 'w101', // 22 mm | W101
  },
  {
    id: 'm_2',
    label: 'Design 2',
    type: 'DOUBLE_FRAME',
    widthMm: 800,
    heightMm: 1800,
    quantity: 2,
    innerOffsetMm: 75,
    outerProfileSizeId: 'w201', // 30 mm | W201
    innerProfileSizeId: 'w101', // 22 mm | W101
  },
  {
    id: 'm_3',
    label: 'Design 3',
    type: 'HORIZONTAL_SLAT',
    widthMm: 3000,
    heightMm: 0,
    quantity: 1,
    profileSizeId: 'w201', // 30 mm | W201
  },
];

export function createNewMoldingFrame(
  type: MoldingFrameItem['type'] = 'DOUBLE_FRAME',
  index: number = 1
): MoldingFrameItem {
  return {
    id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    label: `Design ${index}`,
    type,
    widthMm: type === 'HORIZONTAL_SLAT' ? 3000 : (type === 'VERTICAL_SLAT' ? 0 : 1000),
    heightMm: type === 'VERTICAL_SLAT' ? 2400 : (type === 'HORIZONTAL_SLAT' ? 0 : 1500),
    quantity: 1,
    innerOffsetMm: type === 'DOUBLE_FRAME' ? 75 : undefined,
    outerProfileSizeId: 'w201',
    innerProfileSizeId: 'w101',
    profileSizeId: 'w201',
  };
}

interface InternalCutPiece {
  itemId: string;
  label: string;
  lengthMm: number;
  profileSizeId: string;
}

export function calculateMoldingQuantity(
  items: MoldingFrameItem[],
  stockLengthMm: number = PVC_STOCK_BAR_LENGTH_MM,
  wastageFactor: number = FIXED_WASTAGE_FACTOR
): MoldingCalculationResults {
  const allCutPieces: InternalCutPiece[] = [];
  const framesBreakdown: MoldingCalculationResults['framesBreakdown'] = [];
  const oversizedPieces: { label: string; lengthMm: number }[] = [];

  let overallTotalPieces = 0;
  let overallNetLinearMm = 0;

  items.forEach((item, idx) => {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const w = Math.max(0, item.widthMm || 0);
    const h = Math.max(0, item.heightMm || 0);

    let typeLabel = '';
    let piecesDesc = '';
    let profileSizeDesc = '';
    let itemTotalLinearMm = 0;

    if (item.type === 'BOX_FRAME') {
      typeLabel = 'Single Box Frame';
      const prof = getProfileSizeById(item.profileSizeId);
      profileSizeDesc = prof.name;

      // 4 mitered sides: 2 width + 2 height without joints
      piecesDesc = `${qty} frame(s) × (2 sides @ ${w}mm + 2 sides @ ${h}mm) = ${qty * 4} pcs (No joints permitted)`;

      for (let q = 0; q < qty; q++) {
        const frameNum = qty > 1 ? ` #${q + 1}` : '';
        // Top & Bottom
        if (w > 0) {
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${frameNum} Top/Bot`,
            lengthMm: w,
            profileSizeId: prof.id,
          });
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${frameNum} Top/Bot`,
            lengthMm: w,
            profileSizeId: prof.id,
          });
          itemTotalLinearMm += w * 2;
          overallTotalPieces += 2;
        }
        // Left & Right
        if (h > 0) {
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${frameNum} Side`,
            lengthMm: h,
            profileSizeId: prof.id,
          });
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${frameNum} Side`,
            lengthMm: h,
            profileSizeId: prof.id,
          });
          itemTotalLinearMm += h * 2;
          overallTotalPieces += 2;
        }
      }
    } else if (item.type === 'DOUBLE_FRAME') {
      typeLabel = 'Double Box Frame (Outer + Inner)';
      const outerProf = getProfileSizeById(item.outerProfileSizeId || 'size_1');
      const innerProf = getProfileSizeById(item.innerProfileSizeId || 'size_2');
      profileSizeDesc = `Outer: ${outerProf.name} | Inner: ${innerProf.name}`;

      const offset = Math.max(20, item.innerOffsetMm || 75);
      const innerW = Math.max(0, w - 2 * offset);
      const innerH = Math.max(0, h - 2 * offset);

      piecesDesc = `${qty} set(s) × [Outer: 2@${w}mm + 2@${h}mm (${outerProf.name}) | Inner: 2@${innerW}mm + 2@${innerH}mm (${innerProf.name})] = ${qty * 8} pcs`;

      for (let q = 0; q < qty; q++) {
        const frameNum = qty > 1 ? ` #${q + 1}` : '';
        // Outer Box (4 pieces)
        if (w > 0) {
          allCutPieces.push(
            { itemId: item.id, label: `${item.label}${frameNum} Outer-Top`, lengthMm: w, profileSizeId: outerProf.id },
            { itemId: item.id, label: `${item.label}${frameNum} Outer-Bot`, lengthMm: w, profileSizeId: outerProf.id }
          );
          itemTotalLinearMm += w * 2;
          overallTotalPieces += 2;
        }
        if (h > 0) {
          allCutPieces.push(
            { itemId: item.id, label: `${item.label}${frameNum} Outer-Left`, lengthMm: h, profileSizeId: outerProf.id },
            { itemId: item.id, label: `${item.label}${frameNum} Outer-Right`, lengthMm: h, profileSizeId: outerProf.id }
          );
          itemTotalLinearMm += h * 2;
          overallTotalPieces += 2;
        }

        // Inner Box (4 pieces)
        if (innerW > 0) {
          allCutPieces.push(
            { itemId: item.id, label: `${item.label}${frameNum} Inner-Top`, lengthMm: innerW, profileSizeId: innerProf.id },
            { itemId: item.id, label: `${item.label}${frameNum} Inner-Bot`, lengthMm: innerW, profileSizeId: innerProf.id }
          );
          itemTotalLinearMm += innerW * 2;
          overallTotalPieces += 2;
        }
        if (innerH > 0) {
          allCutPieces.push(
            { itemId: item.id, label: `${item.label}${frameNum} Inner-Left`, lengthMm: innerH, profileSizeId: innerProf.id },
            { itemId: item.id, label: `${item.label}${frameNum} Inner-Right`, lengthMm: innerH, profileSizeId: innerProf.id }
          );
          itemTotalLinearMm += innerH * 2;
          overallTotalPieces += 2;
        }
      }
    } else if (item.type === 'HORIZONTAL_SLAT') {
      typeLabel = 'Horizontal Slat/Batten';
      const prof = getProfileSizeById(item.profileSizeId);
      profileSizeDesc = prof.name;

      const len = w > 0 ? w : h;
      const hasJoints = len > stockLengthMm;
      const jointNote = hasJoints 
        ? `(${Math.floor(len / stockLengthMm)} full 2400mm bar(s) + ${len % stockLengthMm}mm tail cut)`
        : `(Continuous single cut, no joints)`;

      piecesDesc = `${qty} horizontal slat(s) @ ${len}mm ${jointNote}`;

      for (let q = 0; q < qty; q++) {
        const slatNum = qty > 1 ? ` #${q + 1}` : '';
        itemTotalLinearMm += len;

        if (len <= stockLengthMm) {
          // No joints within piece
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${slatNum}`,
            lengthMm: len,
            profileSizeId: prof.id,
          });
          overallTotalPieces++;
        } else {
          // Slat > 2400mm: Full 2400mm segments + remainder tail piece
          const fullCount = Math.floor(len / stockLengthMm);
          const remainderMm = len % stockLengthMm;

          for (let f = 0; f < fullCount; f++) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${slatNum} (2400mm Bar Segment)`,
              lengthMm: stockLengthMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
          if (remainderMm > 0) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${slatNum} (${remainderMm}mm Tail Cut)`,
              lengthMm: remainderMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
        }
      }
    } else if (item.type === 'VERTICAL_SLAT') {
      typeLabel = 'Vertical Slat/Batten';
      const prof = getProfileSizeById(item.profileSizeId);
      profileSizeDesc = prof.name;

      const len = h > 0 ? h : w;
      const hasJoints = len > stockLengthMm;
      const jointNote = hasJoints 
        ? `(${Math.floor(len / stockLengthMm)} full 2400mm bar(s) + ${len % stockLengthMm}mm tail cut)`
        : `(Continuous single cut, no joints)`;

      piecesDesc = `${qty} vertical slat(s) @ ${len}mm ${jointNote}`;

      for (let q = 0; q < qty; q++) {
        const slatNum = qty > 1 ? ` #${q + 1}` : '';
        itemTotalLinearMm += len;

        if (len <= stockLengthMm) {
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${slatNum}`,
            lengthMm: len,
            profileSizeId: prof.id,
          });
          overallTotalPieces++;
        } else {
          const fullCount = Math.floor(len / stockLengthMm);
          const remainderMm = len % stockLengthMm;

          for (let f = 0; f < fullCount; f++) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${slatNum} (2400mm Bar Segment)`,
              lengthMm: stockLengthMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
          if (remainderMm > 0) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${slatNum} (${remainderMm}mm Tail Cut)`,
              lengthMm: remainderMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
        }
      }
    } else {
      typeLabel = 'Custom Linear Run';
      const prof = getProfileSizeById(item.profileSizeId);
      profileSizeDesc = prof.name;
      const len = w > 0 ? w : h;
      piecesDesc = `${qty} run(s) @ ${len}mm`;

      for (let q = 0; q < qty; q++) {
        const runNum = qty > 1 ? ` #${q + 1}` : '';
        itemTotalLinearMm += len;

        if (len <= stockLengthMm) {
          allCutPieces.push({
            itemId: item.id,
            label: `${item.label}${runNum}`,
            lengthMm: len,
            profileSizeId: prof.id,
          });
          overallTotalPieces++;
        } else {
          const fullCount = Math.floor(len / stockLengthMm);
          const remainderMm = len % stockLengthMm;
          for (let f = 0; f < fullCount; f++) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${runNum} (2400mm Bar Segment)`,
              lengthMm: stockLengthMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
          if (remainderMm > 0) {
            allCutPieces.push({
              itemId: item.id,
              label: `${item.label}${runNum} (${remainderMm}mm Tail Cut)`,
              lengthMm: remainderMm,
              profileSizeId: prof.id,
            });
            overallTotalPieces++;
          }
        }
      }
    }

    overallNetLinearMm += itemTotalLinearMm;

    framesBreakdown.push({
      label: item.label || `Design ${idx + 1}`,
      typeLabel,
      dimensions: item.type === 'HORIZONTAL_SLAT' 
        ? `${w || h} mm Linear`
        : (item.type === 'VERTICAL_SLAT' ? `${h || w} mm Linear` : `${w} × ${h} mm`),
      profileSizeDesc,
      piecesDescription: piecesDesc,
      totalLinearFt: Number((itemTotalLinearMm / 300).toFixed(2)),
    });
  });

  // Group pieces by profile size and compute cutting schedule for each
  const profileGroups: Record<string, InternalCutPiece[]> = {};
  allCutPieces.forEach((p) => {
    if (!profileGroups[p.profileSizeId]) {
      profileGroups[p.profileSizeId] = [];
    }
    profileGroups[p.profileSizeId].push(p);
  });

  const profileSummaries: ProfileSizeSummary[] = [];
  const allStockBarsCombined: StockBar[] = [];

  let overallRawBars = 0;
  let overallRecommendedBars = 0;
  let globalBarIndex = 1;

  STANDARD_MOLDING_SIZES.forEach((sizeSpec) => {
    const pieces = profileGroups[sizeSpec.id];
    if (!pieces || pieces.length === 0) return;

    const sorted = [...pieces].sort((a, b) => b.lengthMm - a.lengthMm);
    const sizeStockBars: StockBar[] = [];

    sorted.forEach((p, pIdx) => {
      if (p.lengthMm > stockLengthMm) {
        oversizedPieces.push({ label: p.label, lengthMm: p.lengthMm });
      }

      let bestBarIdx = -1;
      let minRemaining = Infinity;

      for (let i = 0; i < sizeStockBars.length; i++) {
        const rem = sizeStockBars[i].remainingLengthMm;
        if (rem >= p.lengthMm && rem - p.lengthMm < minRemaining) {
          bestBarIdx = i;
          minRemaining = rem - p.lengthMm;
        }
      }

      if (bestBarIdx !== -1) {
        const bar = sizeStockBars[bestBarIdx];
        bar.cuts.push({
          itemId: p.itemId,
          label: p.label,
          lengthMm: p.lengthMm,
          pieceIndex: pIdx + 1,
        });
        bar.usedLengthMm += p.lengthMm;
        bar.remainingLengthMm -= p.lengthMm;
      } else {
        const newBar: StockBar = {
          barNumber: sizeStockBars.length + 1,
          stockLengthMm,
          usedLengthMm: p.lengthMm,
          remainingLengthMm: Math.max(0, stockLengthMm - p.lengthMm),
          cuts: [
            {
              itemId: p.itemId,
              label: p.label,
              lengthMm: p.lengthMm,
              pieceIndex: pIdx + 1,
            },
          ],
        };
        sizeStockBars.push(newBar);
      }
    });

    const rawBars = sizeStockBars.length;
    // Standard fixed 10% wastage allowance: extra bars = ceil(rawBars * 0.10)
    const extraWastage = Math.ceil(rawBars * wastageFactor);
    const recBars = rawBars + extraWastage;

    const sizeTotalMm = pieces.reduce((sum, p) => sum + p.lengthMm, 0);

    profileSummaries.push({
      profileSizeId: sizeSpec.id,
      profileName: sizeSpec.name,
      profileWidthMm: sizeSpec.widthMm,
      totalPieces: pieces.length,
      totalLinearMm: sizeTotalMm,
      totalLinearFt: Number((sizeTotalMm / 300).toFixed(2)),
      rawBarsRequired: rawBars,
      recommendedBarsTotal: recBars,
      stockBars: sizeStockBars,
    });

    overallRawBars += rawBars;
    overallRecommendedBars += recBars;

    sizeStockBars.forEach((b) => {
      allStockBarsCombined.push({
        ...b,
        barNumber: globalBarIndex++,
      });
    });
  });

  const netMoldingLengthFt = overallNetLinearMm / 300;
  const wastageLengthMm = overallNetLinearMm * wastageFactor;
  const wastageLengthFt = wastageLengthMm / 300;

  return {
    stockLengthMm,
    stockLengthFt: stockLengthMm / 300,
    totalMoldingPieces: overallTotalPieces,
    netMoldingLengthMm: overallNetLinearMm,
    netMoldingLengthFt: Number(netMoldingLengthFt.toFixed(2)),
    rawBarsRequired: overallRawBars,
    wastageFactor,
    wastageLengthMm: Math.round(wastageLengthMm),
    wastageLengthFt: Number(wastageLengthFt.toFixed(2)),
    recommendedBarsTotal: overallRecommendedBars,
    profileSummaries,
    stockBars: allStockBarsCombined,
    framesBreakdown,
    oversizedPieces,
  };
}
