export type WarehouseCategory =
  | "offset_digitale"
  | "editoria_legatoria"
  | "immagine_coordinata"
  | "cerimonie"
  | "dtf_abbigliamento"
  | "allestimenti_vetrofanie"
  | "consumabili_tecnici";

export interface CategoryInfo {
  id: WarehouseCategory;
  name: string;
  icon: string;
  description: string;
  badgeColor: string;
}

export const WAREHOUSE_CATEGORIES: CategoryInfo[] = [
  {
    id: "offset_digitale",
    name: "Stampa Offset & Digitale",
    icon: "Printer",
    description: "Patinate lucide/opache, usomano, cartoncini, formati stesi SRA3, 70x100, 64x88",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
  },
  {
    id: "editoria_legatoria",
    name: "Editoria & Legatoria",
    icon: "BookOpen",
    description: "Carte editoriali, colla brossura PUR/Hot-melt, filo refe, film plastificazione",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "immagine_coordinata",
    name: "Immagine Coordinata & Foil",
    icon: "CreditCard",
    description: "Carte speciali martellate/vergate, buste intestate, foil stampa a caldo oro/argento",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: "cerimonie",
    name: "Cerimonie & Partecipazioni",
    icon: "Heart",
    description: "Carta a mano d'Amalfi 100% cotone, buste nozze, ceralacca, nastri organza",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "dtf_abbigliamento",
    name: "Abbigliamento & DTF",
    icon: "Shirt",
    description: "T-shirt neutre, felpe, cappellini, film DTF in bobina, polvere hot-melt, inchiostri DTF",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "allestimenti_vetrofanie",
    name: "Allestimenti & Vetrofanie",
    icon: "Layers",
    description: "Vinili adesivi, pellicole sabbiate, banner PVC, strutture roll-up, Forex, Plexiglass",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "consumabili_tecnici",
    name: "Consumabili Tecnici",
    icon: "Cpu",
    description: "Lastre CTP, inchiostri CMYK offset, toner digitali, solventi e prodotti di lavaggio",
    badgeColor: "bg-stone-100 text-stone-800 border-stone-300",
  },
];

export type StockStatus = "CRITICAL" | "WARNING" | "OPTIMAL";

export function getItemStatus(item: WarehouseItem): StockStatus {
  if (item.quantity <= item.minStockAlert) {
    return "CRITICAL";
  }
  if (item.quantity <= item.minStockAlert * 1.5) {
    return "WARNING";
  }
  return "OPTIMAL";
}

export interface WarehouseItem {
  id: string;
  code: string;
  name: string;
  category: WarehouseCategory;
  subcategory: string;
  unit: string;
  quantity: number;
  minStockAlert: number;
  optimalStock: number;
  supplier: string;
  location: string;
  unitCost?: number;
  notes?: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  category: WarehouseCategory;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  operator: string;
  timestamp: string;
}

export interface DdtParsedItem {
  rawDescription: string;
  matchedItemId?: string;
  matchedItemName?: string;
  quantity: number;
  unit: string;
  suggestedAction: "MATCHED" | "NEW_ITEM";
  confidence: number;
  categoryGuess?: WarehouseCategory;
  notes?: string;
}

export interface DdtScanResult {
  supplierName: string;
  documentNumber?: string;
  documentDate?: string;
  rawTextPreview?: string;
  items: DdtParsedItem[];
}

export interface JobCalculationInput {
  jobType: string;
  jobName: string;
  runQuantity: number;
  pagesCount?: number;
  targetFormat?: string;
  paperType?: string;
  paperGrammage?: number;
  coverPaperType?: string;
  coverGrammage?: number;
  finishing?: string[];
  notes?: string;
}

export interface JobCalculationResult {
  jobName: string;
  sheetsNeeded: number;
  wastePercentage: number;
  wasteSheets: number;
  totalGrossSheets: number;
  packsNeeded: number;
  primaryMaterial?: {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
    requiredQuantity: number;
    isAvailable: boolean;
    missingQuantity: number;
  };
  secondaryMaterials: Array<{
    name: string;
    required: string;
    availableDescription: string;
    isAvailable: boolean;
  }>;
  technicalAdvice: string[];
}
