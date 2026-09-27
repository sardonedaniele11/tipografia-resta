import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  WarehouseItem,
  StockMovement,
  StockStatus,
  WarehouseCategory,
  getItemStatus,
} from "./types";
export { getItemStatus };
import { INITIAL_WAREHOUSE_ITEMS } from "./seedData";

interface WarehouseData {
  items: WarehouseItem[];
  movements: StockMovement[];
  version: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "warehouse.json");

// Inizializzazione Client Supabase (se configurato nelle variabili d'ambiente)
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/* ==========================================================================
   METODI DI SUPPORTO PER FILE LOCALE JSON (Fallback locale)
   ========================================================================== */

function ensureLocalDbExists(): WarehouseData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: WarehouseData = {
      items: INITIAL_WAREHOUSE_ITEMS,
      movements: [
        {
          id: `mov-${Date.now()}-init`,
          itemId: "resta-pap-001",
          itemName: "Patinata Opaca 130g 70x100",
          category: "offset_digitale",
          type: "IN",
          quantity: 12,
          previousQuantity: 0,
          newQuantity: 12,
          reason: "Inizializzazione Inventario Tipografia Resta",
          operator: "Sistema",
          timestamp: new Date().toISOString(),
        },
      ],
      version: "1.0",
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as WarehouseData;
  } catch (err) {
    console.error("Error reading warehouse.json, restoring initial data", err);
    const fallback: WarehouseData = {
      items: INITIAL_WAREHOUSE_ITEMS,
      movements: [],
      version: "1.0",
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function saveLocalDb(data: WarehouseData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/* ==========================================================================
   METODI PUBBLICI ADAPTER (CLOUD SUPABASE + FALLBACK JSON)
   ========================================================================== */

export async function getItems(filters?: {
  category?: WarehouseCategory | "all";
  status?: StockStatus | "all";
  search?: string;
}): Promise<WarehouseItem[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from("warehouse_items").select("*").order("name");

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters?.search && filters.search.trim()) {
        const term = `%${filters.search.trim()}%`;
        query = query.or(`name.ilike.${term},code.ilike.${term},supplier.ilike.${term},subcategory.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      let items: WarehouseItem[] = (data || []).map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        unit: row.unit,
        quantity: Number(row.quantity),
        minStockAlert: Number(row.min_stock_alert || row.minStockAlert),
        optimalStock: Number(row.optimal_stock || row.optimalStock),
        supplier: row.supplier,
        location: row.location,
        unitCost: row.unit_cost !== undefined ? Number(row.unit_cost) : undefined,
        notes: row.notes,
        lastUpdated: row.last_updated || row.lastUpdated,
      }));

      if (filters?.status && filters.status !== "all") {
        items = items.filter((item) => getItemStatus(item) === filters.status);
      }

      return items;
    } catch (err) {
      console.warn("Supabase query failed, falling back to local file:", err);
    }
  }

  // Fallback Locale
  const data = ensureLocalDbExists();
  let results = [...data.items];

  if (filters?.category && filters.category !== "all") {
    results = results.filter((item) => item.category === filters.category);
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((item) => getItemStatus(item) === filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    const term = filters.search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term) ||
        item.subcategory.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
    );
  }

  return results;
}

export async function getItemById(id: string): Promise<WarehouseItem | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("warehouse_items").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          code: data.code,
          name: data.name,
          category: data.category,
          subcategory: data.subcategory,
          unit: data.unit,
          quantity: Number(data.quantity),
          minStockAlert: Number(data.min_stock_alert || data.minStockAlert),
          optimalStock: Number(data.optimal_stock || data.optimalStock),
          supplier: data.supplier,
          location: data.location,
          unitCost: data.unit_cost ? Number(data.unit_cost) : undefined,
          notes: data.notes,
          lastUpdated: data.last_updated,
        };
      }
    } catch (err) {
      console.warn("Supabase getItemById failed, using local:", err);
    }
  }

  const data = ensureLocalDbExists();
  return data.items.find((item) => item.id === id) || null;
}

export async function updateStock(
  itemId: string,
  params: { delta?: number; absolute?: number },
  reason: string,
  operator: string = "Operatore"
): Promise<{ item: WarehouseItem; movement: StockMovement }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const item = await getItemById(itemId);
      if (!item) throw new Error(`Articolo non trovato con id ${itemId}`);

      const prevQty = item.quantity;
      let newQty = prevQty;
      if (params.delta !== undefined) {
        newQty = Math.max(0, prevQty + params.delta);
      } else if (params.absolute !== undefined) {
        newQty = Math.max(0, params.absolute);
      }

      const movementType: "IN" | "OUT" | "ADJUST" =
        newQty > prevQty ? "IN" : newQty < prevQty ? "OUT" : "ADJUST";
      const deltaQty = Math.abs(newQty - prevQty);

      const now = new Date().toISOString();
      const { data: updatedData, error: updateError } = await supabase
        .from("warehouse_items")
        .update({
          quantity: newQty,
          last_updated: now,
        })
        .eq("id", itemId)
        .select()
        .single();

      if (updateError) throw updateError;

      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        type: movementType,
        quantity: deltaQty,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: reason || "Aggiornamento scorte",
        operator: operator || "Operatore",
        timestamp: now,
      };

      await supabase.from("warehouse_movements").insert([
        {
          id: movement.id,
          item_id: movement.itemId,
          item_name: movement.itemName,
          category: movement.category,
          type: movement.type,
          quantity: movement.quantity,
          previous_quantity: movement.previousQuantity,
          new_quantity: movement.newQuantity,
          reason: movement.reason,
          operator: movement.operator,
          timestamp: movement.timestamp,
        },
      ]);

      const updatedItem: WarehouseItem = {
        ...item,
        quantity: newQty,
        lastUpdated: now,
      };

      return { item: updatedItem, movement };
    } catch (err) {
      console.warn("Supabase updateStock error, falling back to local:", err);
    }
  }

  // Fallback Locale
  const data = ensureLocalDbExists();
  const itemIndex = data.items.findIndex((it) => it.id === itemId);
  if (itemIndex === -1) {
    throw new Error(`Articolo non trovato con id ${itemId}`);
  }

  const currentItem = data.items[itemIndex];
  const prevQty = currentItem.quantity;
  let newQty = prevQty;

  if (params.delta !== undefined) {
    newQty = Math.max(0, prevQty + params.delta);
  } else if (params.absolute !== undefined) {
    newQty = Math.max(0, params.absolute);
  }

  const movementType: "IN" | "OUT" | "ADJUST" =
    newQty > prevQty ? "IN" : newQty < prevQty ? "OUT" : "ADJUST";
  const deltaQty = Math.abs(newQty - prevQty);

  const updatedItem: WarehouseItem = {
    ...currentItem,
    quantity: newQty,
    lastUpdated: new Date().toISOString(),
  };

  const movement: StockMovement = {
    id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    itemId: currentItem.id,
    itemName: currentItem.name,
    category: currentItem.category,
    type: movementType,
    quantity: deltaQty,
    previousQuantity: prevQty,
    newQuantity: newQty,
    reason: reason || "Aggiornamento manuale scorte",
    operator: operator || "Operatore",
    timestamp: new Date().toISOString(),
  };

  data.items[itemIndex] = updatedItem;
  data.movements.unshift(movement);
  saveLocalDb(data);

  return { item: updatedItem, movement };
}

export async function createItem(
  item: Omit<WarehouseItem, "id" | "lastUpdated">
): Promise<WarehouseItem> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const newItemId = `resta-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  if (supabase) {
    try {
      const { error } = await supabase.from("warehouse_items").insert([
        {
          id: newItemId,
          code: item.code,
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          unit: item.unit,
          quantity: item.quantity,
          min_stock_alert: item.minStockAlert,
          optimal_stock: item.optimalStock,
          supplier: item.supplier,
          location: item.location,
          unit_cost: item.unitCost,
          notes: item.notes,
          last_updated: now,
        },
      ]);
      if (error) throw error;

      await supabase.from("warehouse_movements").insert([
        {
          id: `mov-${Date.now()}-new`,
          item_id: newItemId,
          item_name: item.name,
          category: item.category,
          type: "IN",
          quantity: item.quantity,
          previous_quantity: 0,
          new_quantity: item.quantity,
          reason: "Creazione nuovo articolo a magazzino",
          operator: "Amministrazione",
          timestamp: now,
        },
      ]);

      return {
        ...item,
        id: newItemId,
        lastUpdated: now,
      };
    } catch (err) {
      console.warn("Supabase createItem failed, using local:", err);
    }
  }

  // Fallback Locale
  const data = ensureLocalDbExists();
  const newItem: WarehouseItem = {
    ...item,
    id: newItemId,
    lastUpdated: now,
  };

  data.items.unshift(newItem);
  data.movements.unshift({
    id: `mov-${Date.now()}-new`,
    itemId: newItem.id,
    itemName: newItem.name,
    category: newItem.category,
    type: "IN",
    quantity: newItem.quantity,
    previousQuantity: 0,
    newQuantity: newItem.quantity,
    reason: "Creazione nuovo articolo a magazzino",
    operator: "Amministrazione",
    timestamp: now,
  });

  saveLocalDb(data);
  return newItem;
}

export async function updateItem(
  id: string,
  updates: Partial<WarehouseItem>
): Promise<WarehouseItem | null> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const payload: any = { ...updates, last_updated: now };
      if (updates.minStockAlert !== undefined) payload.min_stock_alert = updates.minStockAlert;
      if (updates.optimalStock !== undefined) payload.optimal_stock = updates.optimalStock;
      if (updates.unitCost !== undefined) payload.unit_cost = updates.unitCost;

      const { data, error } = await supabase
        .from("warehouse_items")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return getItemById(id);
      }
    } catch (err) {
      console.warn("Supabase updateItem failed, using local:", err);
    }
  }

  const data = ensureLocalDbExists();
  const index = data.items.findIndex((it) => it.id === id);
  if (index === -1) return null;

  const current = data.items[index];
  const updated: WarehouseItem = {
    ...current,
    ...updates,
    id: current.id,
    lastUpdated: now,
  };

  data.items[index] = updated;
  saveLocalDb(data);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("warehouse_items").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete failed, using local:", err);
    }
  }

  const data = ensureLocalDbExists();
  const initialLen = data.items.length;
  data.items = data.items.filter((it) => it.id !== id);
  if (data.items.length < initialLen) {
    saveLocalDb(data);
    return true;
  }
  return false;
}

export async function getMovements(limit: number = 50): Promise<StockMovement[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("warehouse_movements")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          itemId: row.item_id || row.itemId,
          itemName: row.item_name || row.itemName,
          category: row.category,
          type: row.type,
          quantity: Number(row.quantity),
          previousQuantity: Number(row.previous_quantity || row.previousQuantity || 0),
          newQuantity: Number(row.new_quantity || row.newQuantity || 0),
          reason: row.reason,
          operator: row.operator,
          timestamp: row.timestamp,
        }));
      }
    } catch (err) {
      console.warn("Supabase getMovements failed, using local:", err);
    }
  }

  const data = ensureLocalDbExists();
  return data.movements.slice(0, limit);
}

export async function getWarehouseSummary() {
  const items = await getItems();
  const movements = await getMovements(8);

  const critical: WarehouseItem[] = [];
  const warning: WarehouseItem[] = [];
  const optimal: WarehouseItem[] = [];
  let totalEstimatedValue = 0;

  for (const item of items) {
    const status = getItemStatus(item);
    if (status === "CRITICAL") critical.push(item);
    else if (status === "WARNING") warning.push(item);
    else optimal.push(item);

    if (item.unitCost) {
      totalEstimatedValue += item.quantity * item.unitCost;
    }
  }

  return {
    totalItemsCount: items.length,
    critical,
    warning,
    optimal,
    criticalCount: critical.length,
    warningCount: warning.length,
    optimalCount: optimal.length,
    totalEstimatedValue: Math.round(totalEstimatedValue * 100) / 100,
    recentMovements: movements,
  };
}

export async function resetToDefaultWarehouse(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("warehouse_movements").delete().neq("id", "none");
      await supabase.from("warehouse_items").delete().neq("id", "none");

      const rows = INITIAL_WAREHOUSE_ITEMS.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        unit: item.unit,
        quantity: item.quantity,
        min_stock_alert: item.minStockAlert,
        optimal_stock: item.optimalStock,
        supplier: item.supplier,
        location: item.location,
        unit_cost: item.unitCost,
        notes: item.notes,
        last_updated: new Date().toISOString(),
      }));

      await supabase.from("warehouse_items").insert(rows);
    } catch (err) {
      console.warn("Supabase reset failed, resetting local:", err);
    }
  }

  const initialData: WarehouseData = {
    items: INITIAL_WAREHOUSE_ITEMS,
    movements: [
      {
        id: `mov-${Date.now()}-reset`,
        itemId: "resta-pap-001",
        itemName: "Patinata Opaca 130g 70x100",
        category: "offset_digitale",
        type: "IN",
        quantity: 12,
        previousQuantity: 0,
        newQuantity: 12,
        reason: "Reset e caricamento catalogo predefinito Tipografia Resta",
        operator: "Sistema",
        timestamp: new Date().toISOString(),
      },
    ],
    version: "1.0",
  };
  saveLocalDb(initialData);
}
