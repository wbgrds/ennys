-- Dieser SQL-Code erstellt die Datenbanktabellen
-- Basiert auf den Anforderungen aus deinen Dokumentationen

-- 1. KATEGORIEN (aus "online_sortimentsabgrenzung.docx")
-- Frank-Achse (Verbrauchsmaterial) und Sven-Achse (Premium)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  axis VARCHAR(50),  -- 'frank' oder 'sven'
  online_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. PRODUKTE (aus "produktdarstellung.docx")
-- Mit Feldern für beide Shop-Achsen (Kategorie-Pfad + Anbau-Rezept-Pfad)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  detailed_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),

  -- Produktdarstellung (aus den Anforderungen)
  image_url VARCHAR(500),
  sku VARCHAR(100) UNIQUE,

  -- Online/Offline Unterscheidung
  online_available BOOLEAN DEFAULT true,
  offline_available BOOLEAN DEFAULT true,

  -- Personas & Tonalität (aus Zielgruppen-Dokumentation)
  persona_tags JSON,  -- z.B. ["tobias", "sven", "nico"]

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. BENUTZER (für die verschiedenen Rollen)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),

  -- Rollen aus "6_1_4_online_offline_rolle.pdf"
  role VARCHAR(50) DEFAULT 'customer',  -- customer, admin, supplier

  -- Online-Shop spezifisch
  persona VARCHAR(50),  -- einer der 7 Personas

  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. BESTELLUNGEN (für Kaufarten: Sofortkauf, Vorkasse, Click&Collect)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),

  -- Kaufart (aus "Kaufarten Online-Shop v1.0.docx")
  purchase_type VARCHAR(50),  -- 'immediate', 'prepaid', 'click_and_collect', 'dropship'

  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, paid, shipped, delivered

  -- Versandinfo (ab 35€ versandfrei)
  shipping_cost DECIMAL(10, 2),
  shipping_address TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. BESTELLUNGSPOSITIONEN (was in der Bestellung drin ist)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. WARENKORB (aktueller, nicht abgeschlossener)
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_online ON products(online_available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
