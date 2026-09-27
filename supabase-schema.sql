-- ==============================================================================
-- SCHEMA SUPABASE CLOUD PER MAGAZZINO NUOVA TIPOLITOGRAFIA RESTA
-- ==============================================================================
-- Esegui questo script nell'editor SQL di Supabase (https://app.supabase.com)
-- per creare le tabelle e caricare i 43 articoli tipografici iniziali.

-- 1. Tabella Articoli di Magazzino
CREATE TABLE IF NOT EXISTS warehouse_items (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT 'Generale',
  unit TEXT NOT NULL DEFAULT 'pacchi',
  quantity NUMERIC NOT NULL DEFAULT 0,
  min_stock_alert NUMERIC NOT NULL DEFAULT 5,
  optimal_stock NUMERIC NOT NULL DEFAULT 15,
  supplier TEXT DEFAULT '',
  location TEXT DEFAULT '',
  unit_cost NUMERIC,
  notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabella Movimenti e Registro Storico
CREATE TABLE IF NOT EXISTS warehouse_movements (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL, -- 'IN', 'OUT', 'ADJUST'
  quantity NUMERIC NOT NULL,
  previous_quantity NUMERIC NOT NULL,
  new_quantity NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  operator TEXT NOT NULL DEFAULT 'Operatore',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Policy di Sicurezza RLS (Accesso tramite Chiave Anon/Service)
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accesso completo warehouse_items" ON warehouse_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accesso completo warehouse_movements" ON warehouse_movements
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Indici per prestazioni
CREATE INDEX IF NOT EXISTS idx_warehouse_items_cat ON warehouse_items (category);
CREATE INDEX IF NOT EXISTS idx_warehouse_movements_time ON warehouse_movements (timestamp DESC);
