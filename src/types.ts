// ==========================================
// 1. FALSE CEILING CALCULATOR TYPES
// ==========================================
export type CeilingCategory = 'PERIPHERAL' | 'ISLAND' | 'L_SHAPE';
export type PeripheralSubOption = 'ONLY_PERIPHERAL_DROP' | 'FULL_AREA_COVERED';
export type CoveOption = 'WITH_COVE' | 'WITHOUT_COVE';
export type IslandSubOption = 'WITH_COVE' | 'WITHOUT_COVE';
export type EdgeSubOption = 'WITH_COVE' | 'WITHOUT_COVE';
export type ExtraCategory = 'ISLAND' | 'EDGE' | 'EXTRA_AREA';
export type ReductionCategory = 'EXEMPTED_AREA' | 'EDGE';

export interface PrimaryCeilingInputs {
  category: CeilingCategory;
  peripheralSubOption: PeripheralSubOption;
  peripheralCoveOption: CoveOption;
  islandSubOption: IslandSubOption;
  lShapeCoveOption: CoveOption;
  lengthMm: number;
  widthMm: number;
  peripheralWidthMm: number; // Drop width for Peripheral & L-Shape
}

export interface ExtraItem {
  id: string;
  category: ExtraCategory;
  islandSubOption: IslandSubOption;
  edgeSubOption: EdgeSubOption;
  lengthMm: number;
  widthMm: number;
}

export interface ReductionItem {
  id: string;
  category: ReductionCategory; // 'EXEMPTED_AREA' | 'EDGE'
  edgeSubOption: EdgeSubOption;
  lengthMm: number;
  widthMm: number;
}

export interface ItemBreakdown {
  name: string;
  categoryLabel: string;
  dimensionsLabel: string;
  surfaceAreaSqft: number;
  edgeRft: number;
  edgeMultiplier: number;
  edgeSqft: number;
  fcSqft: number;
  coveMtr: number;
  coveRft: number;
  adaptors: number;
  isReduction?: boolean;
  notes?: string;
}

export interface CeilingCalculationResults {
  totalSurfaceAreaSqft: number;
  totalCoveMtr: number;
  totalCoveRft: number;
  totalEdgeSqft: number;
  totalReductionSqft: number;
  totalFcSqft: number;
  totalStripLightMtr: number;
  totalStripLightRft: number;
  totalAdaptors: number;
  primaryBreakdown: ItemBreakdown;
  extrasBreakdown: ItemBreakdown[];
  reductionsBreakdown: ItemBreakdown[];
}

// ==========================================
// 2. ALUMINIUM STRIP CALCULATOR TYPES
// ==========================================
export interface AluminiumStripPlacement {
  id: string;
  label: string; // e.g. "Door 1 & 2 Horizontal", "Door 3 Vertical"
  lengthMm: number;
  quantity: number;
}

export type AluminiumStripItem = AluminiumStripPlacement;

export interface AluminiumStripType {
  id: string;
  name: string; // e.g. "Strip Type 1", "Strip Type 2"
  placements: AluminiumStripPlacement[];
}

export interface CutPiece {
  itemId: string;
  label: string;
  lengthMm: number;
  pieceIndex: number;
}

export interface StockBar {
  barNumber: number;
  stockLengthMm: number;
  usedLengthMm: number;
  remainingLengthMm: number;
  cuts: CutPiece[];
}

export interface AluminiumTypeResult {
  typeId: string;
  name: string;
  totalPieces: number;
  totalDesignLengthMm: number;
  totalDesignLengthFt: number;
  barsRequired: number;
  totalStockPurchasedMm: number;
  totalStockPurchasedFt: number;
  totalWastageMm: number;
  totalWastageFt: number;
  wastagePercentage: number;
  stockBars: StockBar[];
  oversizedPieces: { label: string; lengthMm: number; count: number }[];
}

export interface AluminiumCalculationResults {
  stockLengthMm: number; // 3000 mm (10 ft)
  stockLengthFt: number; // 10 ft
  totalDesignPieces: number;
  totalDesignLengthMm: number;
  totalDesignLengthFt: number;
  barsRequired: number;
  totalStockPurchasedMm: number;
  totalStockPurchasedFt: number;
  totalWastageMm: number;
  totalWastageFt: number;
  wastagePercentage: number;
  typesResults: AluminiumTypeResult[];
  stockBars: StockBar[]; // Aggregate stock bars across all types
  oversizedPieces: { label: string; lengthMm: number; count: number }[];
}

// ==========================================
// 3. PVC MOLDING CALCULATOR TYPES
// ==========================================
export type MoldingFrameType = 'BOX_FRAME' | 'DOUBLE_FRAME' | 'HORIZONTAL_SLAT' | 'VERTICAL_SLAT' | 'CUSTOM_RUN';

export interface MoldingProfileSize {
  id: string;
  name: string;
  widthMm: number;
}

export interface MoldingFrameItem {
  id: string;
  label: string; // e.g. "Design 1", "Design 2"
  type: MoldingFrameType;
  widthMm: number;
  heightMm: number;
  quantity: number;
  innerOffsetMm?: number; // for DOUBLE_FRAME (e.g. 75mm inner gap)
  profileSizeId?: string; // For single box, slats, etc. e.g. 'size_1'
  outerProfileSizeId?: string; // For double frame outer box e.g. 'size_1' (30mm)
  innerProfileSizeId?: string; // For double frame inner box e.g. 'size_2' (22mm)
}

export interface ProfileSizeSummary {
  profileSizeId: string;
  profileName: string;
  profileWidthMm: number;
  totalPieces: number;
  totalLinearMm: number;
  totalLinearFt: number;
  rawBarsRequired: number;
  recommendedBarsTotal: number; // with fixed 10% wastage
  stockBars: StockBar[];
}

export interface MoldingCalculationResults {
  stockLengthMm: number; // 2400 mm (8 ft)
  stockLengthFt: number; // 8 ft
  totalMoldingPieces: number;
  netMoldingLengthMm: number;
  netMoldingLengthFt: number;
  rawBarsRequired: number;
  wastageFactor: number; // fixed 0.10 (10%)
  wastageLengthMm: number;
  wastageLengthFt: number;
  recommendedBarsTotal: number; // with 10% extra
  profileSummaries: ProfileSizeSummary[];
  stockBars: StockBar[];
  framesBreakdown: {
    label: string;
    typeLabel: string;
    dimensions: string;
    profileSizeDesc: string;
    piecesDescription: string;
    totalLinearFt: number;
  }[];
  oversizedPieces: { label: string; lengthMm: number }[];
}

// ==========================================
// 4. LOUVER PANEL CALCULATOR TYPES
// ==========================================
export interface LouverSection {
  id: string;
  name: string; // e.g. "Section 1", "Section 2"
  widthMm: number;
  heightMm: number;
}

export interface LouverType {
  id: string;
  name: string; // e.g. "Louver Type 1", "Louver Type 2"
  sections: LouverSection[];
}

export type LouverProduct = LouverType;

export interface LouverCutPiece {
  typeId: string;
  typeName: string;
  sectionId: string;
  sectionName: string;
  stripIndex: number;
  lengthMm: number; // height of the piece (width is always standard 300mm)
}

export interface LouverStockBar {
  barNumber: number;
  stockHeightMm: number; // 2400 mm
  stockWidthMm: number; // 300 mm
  isFullPanel?: boolean;
  usedHeightMm: number;
  remainingHeightMm: number;
  cuts: {
    typeId: string;
    typeName: string;
    sectionId: string;
    sectionName: string;
    stripIndex: number;
    lengthMm: number;
  }[];
}

export interface LouverSectionResult {
  sectionId: string;
  name: string;
  widthMm: number;
  heightMm: number;
  panelsAcrossWidth: number; // ceil(width / 300)
  fullHeightTiers: number; // floor(height / 2400)
  fullPanelsCount: number; // panelsAcrossWidth * fullHeightTiers
  excessHeightMm: number; // height % 2400
  effectiveCoveredAreaSqft: number;
  effectiveCoveredAreaSqm: number;
  widthTrimmingMm: number; // leftover from last panel width
  hasHeightJoint: boolean; // if height > 2400 mm
}

export interface LouverTypeResult {
  typeId: string;
  name: string;
  sectionsCount: number;
  fullPanelsDirect: number;
  cutPanelsRequired: number;
  totalPanelsRequired: number;
  fullPanelsSchedule: LouverStockBar[];
  cutPanelsSchedule: LouverStockBar[];
  sectionsResults: LouverSectionResult[];
}

export type LouverProductResult = LouverTypeResult;

export interface LouverCalculationResults {
  standardPanelWidthMm: number; // 300 mm
  standardPanelHeightMm: number; // 2400 mm
  totalFullPanelsDirect: number;
  totalCutPanelsRequired: number;
  totalPanelsRequired: number;
  typesResults: LouverTypeResult[];
  productsResults: LouverTypeResult[];
}

// ==========================================
// ACTIVE APP VIEW
// ==========================================
export type ActiveCalculatorTab = 'CEILING' | 'ALUMINIUM' | 'MOLDING' | 'LOUVER';

