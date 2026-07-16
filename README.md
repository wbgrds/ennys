# Enny's Lounge Online-Shop 6.0

Dein Online-Shop zum selbst programmieren und verstehen. **React Frontend + Express Backend + JSON-Datenbank (LowDB)** ✨

## 📁 Projektstruktur

```
ennys-online-shop/
├── frontend/                    # React App (Vite)
│   ├── src/
│   │   ├── App.jsx              # Multi-Page Navigation (Home, Shop, Cart, Checkout)
│   │   ├── components/
│   │   │   ├── Header.jsx       # Navigation & Logo
│   │   │   ├── Hero.jsx         # Hero Section mit CTAs
│   │   │   ├── Card.jsx         # Reusable Card Component
│   │   │   ├── ProductCard.jsx  # Produkt-Anzeige
│   │   │   ├── ProductGrid.jsx  # Produkt-Grid mit Filterung
│   │   │   ├── Cart.jsx         # Warenkorb
│   │   │   ├── Checkout.jsx     # 3-Schritt Checkout (Warenkorb → Versand → Zahlung)
│   │   │   └── Footer.jsx       # Footer mit Links
│   │   ├── public/
│   │   │   ├── logo.png         # 🎯 Husky Logo (mit Cream-Hintergrund)
│   │   │   └── index.html
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                     # Node.js + Express Server
│   ├── src/
│   │   └── server.js            # Express API Server
│   ├── db.json                  # 🎯 JSON-Datenbank (Products, Categories)
│   ├── .env                     # Konfiguration (PORT, NODE_ENV)
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Schnelleinstieg

### 1️⃣ Backend starten (Terminal 1)

```bash
cd backend
npm install
npm start
```

Server läuft auf: **http://localhost:3001**

### 2️⃣ Frontend starten (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

App läuft auf: **http://localhost:5173**

Das wars! 🎉

## 🎨 Farbsystem (aus echtem Husky-Logo)

```javascript
cream: '#D9CCBA'       // Papier-Creme (Card-Hintergrund)
logoGreen: '#4B5A3C'   // Husky-Grün (Buttons, Hervorhebung)
dark: '#1a3a2a'        // Dunkelgrün (Hintergrund, Text)
gold: '#C9A961'        // Gold-Akzent (CTAs, Text auf dunkel)
textOlive: '#6D4E2E'   // Olive (Sekundär-Text)
```

## 📄 Die Datenbank: `backend/db.json`

Das ist deine ganze Datenbank! **Eine einfache JSON-Datei.**

```json
{
  "categories": [
    { "id": 1, "name": "Frank-Achse", "description": "..." },
    { "id": 2, "name": "Sven-Achse", "description": "..." }
  ],
  "products": [
    {
      "id": 1,
      "name": "Griptape XL",
      "description": "Hochwertiges Griptape",
      "price": 4.99,
      "stock": 25,
      "category_id": 1,
      "online_available": true,
      "offline_available": true,
      "persona_tags": ["Anfänger", "Premium"]
    }
  ],
  "users": [],
  "orders": [],
  "cartItems": [],
  "orderItems": []
}
```

**Vorteil**: Du kannst sie mit jedem Editor öffnen und direkt sehen/ändern! 👀

## 📱 Frontend Features

### 🏠 **Home Page**
- Hero Section mit Headline: "Anbauen, wie du es willst."
- CTA Buttons: "Sortiment ansehen" (Gold) & "Anbau-Rezepte" (Outlined)
- Trust Section mit 5 Core Values (Loyalität, Naturverbundenheit, etc.)
- Husky Logo im Cream-Card

### 🛍️ **Shop Page**
- Produkt-Grid mit Kategorien-Filter (Frank-Achse / Sven-Achse)
- Produkt-Cards mit Bild, Preis, Stock-Info
- Persona-Tags (z.B. "Anfänger", "Premium")
- "In den Korb" Button

### 🛒 **Warenkorb**
- Sticky Sidebar mit aktuellem Korb
- Menge anpassen (+/- Buttons)
- Produkte entfernen
- Versandkosten-Berechnung (kostenlos ab 35€)
- "Zur Kasse" Button

### 💳 **Checkout (3 Schritte)**
1. **Warenkorb Review** – Letzte Kontrolle
2. **Versand & Adresse** – Lieferadresse eingeben
3. **Zahlung** – Zahlungsart wählen

### 🎯 **All Inline CSS Styles**
- Kein Tailwind! Alle Farben aus dem echten Logo
- Responsive Design mit Flexbox/Grid
- Hover-Effekte auf Buttons

## 🔄 API-Endpoints

### Kategorien
```
GET    /api/categories              # Alle Kategorien
```

### Produkte
```
GET    /api/products                # Alle Produkte
GET    /api/products/:id            # Ein Produkt
POST   /api/products                # Neues Produkt
PUT    /api/products/:id            # Produkt ändern
DELETE /api/products/:id            # Produkt löschen
```

## 💻 Beispiele

### Alle Produkte abrufen
```bash
curl http://localhost:3001/api/products
```

### Neues Produkt hinzufügen
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wasserpfeife Classic",
    "description": "Hochwertige Wasserpfeife",
    "price": 29.99,
    "stock": 15,
    "category_id": 1,
    "online_available": true,
    "persona_tags": ["Anfänger"]
  }'
```

## 🎯 Wie der Code funktioniert

### **Frontend (React)**
- **App.jsx** – Zentrale State-Verwaltung mit `useState`
  - `page` – Aktuelle Seite (home, shop, cart, checkout)
  - `products` – Alle Produkte von API
  - `cartItems` – Warenkorb
  - `checkoutStep` – Checkout Phase (1-3)
  - Functions: `addToCart()`, `removeFromCart()`, `updateQuantity()`

- **Components** – Wiederverwendbare UI-Teile
  - Card – Basis-Component mit Cream-Hintergrund
  - ProductCard – Zeigt ein Produkt
  - ProductGrid – Grid mit Filterung
  - Cart – Warenkorb-Sidebar
  - Checkout – 3-Schritt Checkout

### **Backend (Express)**
- **server.js** – API-Server
  - Port 3001
  - LowDB Verbindung
  - REST Routes für Produkte/Kategorien
  - CORS für Frontend

- **db.json** – JSON-Datenbank
  - Enthält: categories, products, users, orders, etc.
  - Ändert sich live bei POST/PUT/DELETE

## 🧪 Datenbank direkt bearbeiten

Du kannst `backend/db.json` direkt im Editor öffnen und ändern!
(Vorsicht: Server muss neu gestartet werden)

```bash
# Backend neu starten
cd backend
npm start
```

## 🔍 Beispiel-Daten

Die Datenbank kommt mit Test-Produkten:
- **Griptape XL** (4,99€) – Frank-Achse
- **Meerschaum Pfeife** (49,99€) – Sven-Achse
- **LED Grow Light** (189,99€) – Frank-Achse

## 💭 Wie der Datenfluss funktioniert

### **User klickt "In den Korb"**
```
ProductCard (klick)
  → App.addToCart(product)
  → setState(cartItems)
  → Cart re-rendert mit neuem Item
```

### **User geht zur Kasse**
```
Cart (klick)
  → App.setState(page: 'checkout', checkoutStep: 1)
  → Checkout rendert, zeigt Produkte
  → Schritt 2: Versandadresse eingeben
  → Schritt 3: Zahlung
```

### **Backend lädt Produkte beim Start**
```
App componentDidMount
  → fetch('/api/products')
  → Backend: db.read() lädt db.json
  → Sendet Array von Produkten
  → Frontend: setState(products)
```

## 🚨 Troubleshooting

| Problem | Lösung |
|---------|--------|
| **"npm: command not found"** | Node.js installieren von nodejs.org |
| **"Port 3001 blockiert"** | `.env` ändern: `PORT=3002` |
| **"Logo wird nicht angezeigt"** | Frontend static: `frontend/public/logo.png` muss existieren |
| **"API 404 Error"** | Backend läuft? `npm start` im backend-Verzeichnis |
| **"Produkte laden nicht"** | CORS aktiviert in `server.js`? |

## 📚 Was du hier lernst

✅ **React Hooks** – useState, useEffect für State-Management  
✅ **Express APIs** – REST Endpoints, POST/PUT/DELETE  
✅ **JSON-Datenbank** – Einfach, keine SQL nötig  
✅ **Frontend-Backend Kommunikation** – fetch() & APIs  
✅ **UI/UX mit Inline CSS** – Responsive Design ohne Tailwind  
✅ **Produktkatalog** – Filterung, Kategorien, Suche  
✅ **E-Commerce Features** – Cart, Checkout, Versand  

## 🎯 Struktur verstehen

```
User öffnet App
  ↓
Frontend lädt von API
  ↓
App-State mit Produkten
  ↓
User navigiert & kauft
  ↓
Frontend sendet zu API
  ↓
Backend speichert in db.json
  ↓
Bestätigung zurück an Frontend
```

## 📈 Nächste Entwicklungs-Phasen

Wenn alles läuft:
- [ ] Benutzer-Authentifizierung (Login/Register)
- [ ] Bestellungs-Historie
- [ ] Admin-Panel (Produkte bearbeiten)
- [ ] Email-Benachrichtigungen
- [ ] Echte Zahlungsintegration (Stripe)
- [ ] Datenbankmigrierung (PostgreSQL/MongoDB)

---

**💡 Hinweis**: LowDB ist perfekt zum Lernen! Später kannst du zu einer echten Datenbank wechseln. 🚀
