import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dein-geheimer-schlussel-hier';

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// HELPER FUNKTIONEN
// ==========================================

// Passwort hashen (einfaches Hashing mit crypto)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// JWT Token generieren
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Token verifizieren (Middleware)
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token erforderlich' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
}

// Admin-Check Middleware
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin-Rechte erforderlich' });
    }
    next();
  });
}

// ==========================================
// DATENBANK INITIALISIEREN (beim Start)
// ==========================================
async function start() {
  await db.init();

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1️⃣ HEALTH CHECK (Server läuft?)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'Server läuft! ✓', timestamp: new Date() });
  });

  // ==========================================
  // 🔐 AUTHENTIFIZIERUNG
  // ==========================================

  // Register - Neuen User erstellen
  app.post('/api/auth/register', async (req, res) => {
    try {
      await db.read();
      const { email, password, name } = req.body;

      // Validierung
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, Passwort und Name erforderlich' });
      }

      // Prüfe ob User bereits existiert
      if (db.data.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email bereits registriert' });
      }

      // Neuen User erstellen
      const newUser = {
        id: Math.max(...db.data.users.map(u => u.id), 0) + 1,
        email,
        name,
        password: hashPassword(password), // Passwort hashen!
        isAdmin: false,
        favorites: [],
        orders: [],
        createdAt: new Date(),
      };

      db.data.users.push(newUser);
      await db.write();

      const token = generateToken(newUser);
      res.status(201).json({
        message: 'User registriert!',
        user: { id: newUser.id, email: newUser.email, name: newUser.name, isAdmin: newUser.isAdmin },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Registrieren' });
    }
  });

  // Login - Benutzer authentifizieren
  app.post('/api/auth/login', async (req, res) => {
    try {
      await db.read();
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email und Passwort erforderlich' });
      }

      const user = db.data.users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Ungültige Credentials' });
      }

      // Passwort überprüfen
      if (user.password !== hashPassword(password)) {
        return res.status(401).json({ error: 'Ungültige Credentials' });
      }

      const token = generateToken(user);
      res.json({
        message: 'Login erfolgreich!',
        user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Login' });
    }
  });

  // Get Profile - Aktuellen User abrufen (benötigt Token)
  app.get('/api/auth/profile', verifyToken, async (req, res) => {
    try {
      await db.read();
      const user = db.data.users.find(u => u.id === req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User nicht gefunden' });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        favorites: user.favorites || [],
        orders: user.orders || [],
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen des Profils' });
    }
  });

  // Favoriten hinzufügen/entfernen
  app.post('/api/auth/favorites/:productId', verifyToken, async (req, res) => {
    try {
      await db.read();
      const user = db.data.users.find(u => u.id === req.user.id);
      const product = db.data.products.find(p => p.id === parseInt(req.params.productId));

      if (!user || !product) {
        return res.status(404).json({ error: 'User oder Produkt nicht gefunden' });
      }

      if (!user.favorites) {
        user.favorites = [];
      }

      const isFavorite = user.favorites.some(fav => fav.id === product.id);

      if (isFavorite) {
        // Aus Favoriten entfernen
        user.favorites = user.favorites.filter(fav => fav.id !== product.id);
      } else {
        // Zu Favoriten hinzufügen
        user.favorites.push({
          id: product.id,
          name: product.name,
          price: product.price,
        });
      }

      await db.write();
      res.json({
        message: isFavorite ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt',
        favorites: user.favorites,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Aktualisieren der Favoriten' });
    }
  });

  // Bestellung erstellen (nach Checkout)
  app.post('/api/orders', verifyToken, async (req, res) => {
    try {
      await db.read();
      const user = db.data.users.find(u => u.id === req.user.id);
      const { items, total, shippingAddress, shippingCost } = req.body;

      if (!user) {
        return res.status(404).json({ error: 'User nicht gefunden' });
      }

      const newOrder = {
        id: Math.max(...(db.data.orders?.map(o => o.id) || [0]), 0) + 1,
        userId: user.id,
        items,
        total,
        shippingCost,
        shippingAddress,
        status: 'processing',
        createdAt: new Date(),
      };

      if (!db.data.orders) {
        db.data.orders = [];
      }

      db.data.orders.push(newOrder);

      // Bestellung zum User hinzufügen
      if (!user.orders) {
        user.orders = [];
      }

      user.orders.push({
        id: newOrder.id,
        items,
        total,
        status: 'processing',
        createdAt: newOrder.createdAt,
      });

      await db.write();

      res.status(201).json({
        message: 'Bestellung erstellt!',
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Erstellen der Bestellung' });
    }
  });

  // 2️⃣ KATEGORIEN
  app.get('/api/categories', async (req, res) => {
    try {
      await db.read();
      res.json(db.data.categories);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien' });
    }
  });

  // 3️⃣ PRODUKTE
  app.get('/api/products', async (req, res) => {
    try {
      await db.read();
      const { online_only, category_id } = req.query;

      let products = db.data.products;

      // Filter: Nur Online-Produkte?
      if (online_only === 'true') {
        products = products.filter(p => p.online_available);
      }

      // Filter: Nach Kategorie?
      if (category_id) {
        products = products.filter(p => p.category_id === parseInt(category_id));
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
    }
  });

  // 4️⃣ EINZELNES PRODUKT
  app.get('/api/products/:id', async (req, res) => {
    try {
      await db.read();
      const product = db.data.products.find(p => p.id === parseInt(req.params.id));

      if (!product) {
        return res.status(404).json({ error: 'Produkt nicht gefunden' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen des Produkts' });
    }
  });

  // 5️⃣ NEUES PRODUKT HINZUFÜGEN
  app.post('/api/products', async (req, res) => {
    try {
      await db.read();

      const newProduct = {
        id: Math.max(...db.data.products.map(p => p.id), 0) + 1,
        name: req.body.name,
        description: req.body.description || '',
        price: parseFloat(req.body.price),
        stock: req.body.stock || 0,
        category_id: req.body.category_id || null,
        online_available: req.body.online_available !== false,
        offline_available: req.body.offline_available !== false,
        persona_tags: req.body.persona_tags || [],
      };

      db.data.products.push(newProduct);
      await db.write();

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Erstellen des Produkts' });
    }
  });

  // 6️⃣ PRODUKT AKTUALISIEREN
  app.put('/api/products/:id', async (req, res) => {
    try {
      await db.read();
      const productIndex = db.data.products.findIndex(p => p.id === parseInt(req.params.id));

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produkt nicht gefunden' });
      }

      // Nur die Felder updaten, die geschickt wurden
      db.data.products[productIndex] = {
        ...db.data.products[productIndex],
        ...req.body,
        id: parseInt(req.params.id), // ID nicht ändern!
      };

      await db.write();
      res.json(db.data.products[productIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Aktualisieren des Produkts' });
    }
  });

  // 7️⃣ PRODUKT LÖSCHEN
  app.delete('/api/products/:id', async (req, res) => {
    try {
      await db.read();
      const productIndex = db.data.products.findIndex(p => p.id === parseInt(req.params.id));

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produkt nicht gefunden' });
      }

      const deleted = db.data.products.splice(productIndex, 1);
      await db.write();

      res.json({ message: 'Produkt gelöscht', deleted: deleted[0] });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Löschen des Produkts' });
    }
  });

  // ==========================================
  // 🔐 ADMIN PANEL - PRODUKT-VERWALTUNG
  // ==========================================

  // Admin: Alle Produkte (mit Details)
  app.get('/api/admin/products', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      res.json(db.data.products);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
    }
  });

  // Admin: Produkt erstellen
  app.post('/api/admin/products', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const newProduct = {
        id: Math.max(...db.data.products.map(p => p.id), 0) + 1,
        name: req.body.name,
        description: req.body.description || '',
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock) || 0,
        category_id: parseInt(req.body.category_id),
        image_url: req.body.image_url || '/images/placeholder.jpg',
        online_available: req.body.online_available !== false,
        offline_available: req.body.offline_available !== false,
        persona_tags: req.body.persona_tags || [],
      };

      db.data.products.push(newProduct);
      await db.write();

      res.status(201).json({
        message: 'Produkt erstellt!',
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Erstellen des Produkts' });
    }
  });

  // Admin: Produkt aktualisieren
  app.put('/api/admin/products/:id', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const product = db.data.products.find(p => p.id === parseInt(req.params.id));

      if (!product) {
        return res.status(404).json({ error: 'Produkt nicht gefunden' });
      }

      Object.assign(product, {
        name: req.body.name || product.name,
        description: req.body.description || product.description,
        price: req.body.price !== undefined ? parseFloat(req.body.price) : product.price,
        stock: req.body.stock !== undefined ? parseInt(req.body.stock) : product.stock,
        category_id: req.body.category_id || product.category_id,
        image_url: req.body.image_url || product.image_url,
        online_available: req.body.online_available !== undefined ? req.body.online_available : product.online_available,
        offline_available: req.body.offline_available !== undefined ? req.body.offline_available : product.offline_available,
        persona_tags: req.body.persona_tags || product.persona_tags,
      });

      await db.write();
      res.json({ message: 'Produkt aktualisiert!', product });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Aktualisieren des Produkts' });
    }
  });

  // Admin: Produkt löschen
  app.delete('/api/admin/products/:id', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const index = db.data.products.findIndex(p => p.id === parseInt(req.params.id));

      if (index === -1) {
        return res.status(404).json({ error: 'Produkt nicht gefunden' });
      }

      const deleted = db.data.products.splice(index, 1);
      await db.write();

      res.json({ message: 'Produkt gelöscht!', deleted: deleted[0] });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Löschen des Produkts' });
    }
  });

  // Admin: Alle Kategorien
  app.get('/api/admin/categories', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      res.json(db.data.categories);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien' });
    }
  });

  // Admin: Bestellungen anschauen
  app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const orders = db.data.orders || [];
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Bestellungen' });
    }
  });

  // ==========================================
  // 📚 GUIDES / ANBAUANLEITUNGEN
  // ==========================================

  // Öffentlich: Alle Guides abrufen
  app.get('/api/guides', async (req, res) => {
    try {
      await db.read();
      const guides = db.data.guides || [];
      res.json(guides.sort((a, b) => a.order - b.order));
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Guides' });
    }
  });

  // Admin: Alle Guides (für Admin-Panel)
  app.get('/api/admin/guides', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const guides = db.data.guides || [];
      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Guides' });
    }
  });

  // Admin: Neuen Guide erstellen
  app.post('/api/admin/guides', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const { title, category, content } = req.body;

      if (!title || !category || !content) {
        return res.status(400).json({ error: 'Titel, Kategorie und Content erforderlich' });
      }

      const newGuide = {
        id: Math.max(...(db.data.guides?.map(g => g.id) || [0]), 0) + 1,
        title,
        category,
        content,
        order: (db.data.guides?.length || 0) + 1,
        createdAt: new Date(),
      };

      if (!db.data.guides) {
        db.data.guides = [];
      }

      db.data.guides.push(newGuide);
      await db.write();

      res.status(201).json({ message: 'Guide erstellt!', guide: newGuide });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Erstellen des Guides' });
    }
  });

  // Admin: Guide aktualisieren
  app.put('/api/admin/guides/:id', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const guide = db.data.guides.find(g => g.id === parseInt(req.params.id));

      if (!guide) {
        return res.status(404).json({ error: 'Guide nicht gefunden' });
      }

      Object.assign(guide, {
        title: req.body.title || guide.title,
        category: req.body.category || guide.category,
        content: req.body.content || guide.content,
        order: req.body.order !== undefined ? req.body.order : guide.order,
      });

      await db.write();
      res.json({ message: 'Guide aktualisiert!', guide });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Aktualisieren des Guides' });
    }
  });

  // Admin: Guide löschen
  app.delete('/api/admin/guides/:id', verifyAdmin, async (req, res) => {
    try {
      await db.read();
      const index = db.data.guides.findIndex(g => g.id === parseInt(req.params.id));

      if (index === -1) {
        return res.status(404).json({ error: 'Guide nicht gefunden' });
      }

      const deleted = db.data.guides.splice(index, 1);
      await db.write();

      res.json({ message: 'Guide gelöscht!', deleted: deleted[0] });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Löschen des Guides' });
    }
  });

  // ==========================================
  // ERROR HANDLER
  // ==========================================
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server-Fehler' });
  });

  // ==========================================
  // SERVER STARTEN
  // ==========================================
  app.listen(PORT, () => {
    console.log(`\n🚀 Server läuft auf http://localhost:${PORT}`);
    console.log(`📄 Datenbank: backend/db.json`);
    console.log(`\n💡 Test mit:\n   curl http://localhost:${PORT}/api/health\n`);
  });
}

start().catch(console.error);
