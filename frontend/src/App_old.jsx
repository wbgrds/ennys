import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Admin from './components/Admin';
import ShopSidebar from './components/ShopSidebar';

// Mock Data aus db.json
const MOCK_DATA = {
  categories: [
    { id: 1, name: "Headshop", description: "Raucher-Zubehör & Lifestyle", parentId: null, online_available: true, icon: "🏪" },
    { id: 11, name: "Glas & Rauchgeräte", parentId: 1 },
    { id: 12, name: "Grinder", parentId: 1 },
    { id: 13, name: "Vaporizer", parentId: 1 },
    { id: 14, name: "Premium Pfeifen", parentId: 1 },
    { id: 16, name: "Papers & Filter", parentId: 1 },
    { id: 17, name: "Feuerzeuge & Zubehör", parentId: 1 },
    { id: 18, name: "Aufbewahrung", parentId: 1 },
    { id: 19, name: "Lifestyle & Geschenke", parentId: 1 },
    { id: 2, name: "Growstore", description: "Anbau & Gartenbedarf", parentId: null, online_available: true, icon: "🌱" },
    { id: 21, name: "Beleuchtung", parentId: 2 },
    { id: 22, name: "Dünger & Substrate", parentId: 2 },
    { id: 23, name: "Seeds", parentId: 2 },
    { id: 24, name: "Growbox Equipment", parentId: 2 },
    { id: 25, name: "Lüftung & Klima", parentId: 2 },
    { id: 26, name: "Messinstrumente", parentId: 2 },
    { id: 27, name: "Bewässerung", parentId: 2 }
  ],
  products: [
    { id: 1, name: "Griptape XL", description: "Hochwertiges Griptape für Wasserpfeifen", price: 4.99, stock: 50, category_id: 11, image_url: "/images/griptape.jpg", online_available: true, offline_available: true, persona_tags: ["anfänger", "budget"] },
    { id: 2, name: "Meerschaum Pfeife Premium", description: "Handgefertigte Meerschaum-Pfeife aus Türkei", price: 49.99, stock: 12, category_id: 14, image_url: "/images/meerschaum.jpg", online_available: true, offline_available: true, persona_tags: ["premium", "sammler"] },
    { id: 3, name: "LED Grow Light 600W", description: "Vollspektrum LED für Pflanzenanbau", price: 189.99, stock: 8, category_id: 21, image_url: "/images/growlight.jpg", online_available: true, offline_available: false, persona_tags: ["profi", "setup"] }
  ]
};

export default function App() {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState(MOCK_DATA.products);
  const [categories, setCategories] = useState(MOCK_DATA.categories);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Favoriten aktualisieren (Mock - keine API)
  const handleFavoriteToggle = () => {
    // Nur lokale Demo
  };

  // Produkte sind bereits aus Mock-Daten geladen

  // Produkt in Warenkorb hinzufügen
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Aus Warenkorb entfernen
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Menge ändern
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  // Gefilterte und sortierte Produkte
  let filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  // Sortierung
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].reverse();
  }

  // Paginierung
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg text-ennys-dark">Lädt...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Full-screen background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/bg-pattern.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        zIndex: -1,
      }} />

      {/* Content wrapper */}
      <div style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
      }}>
      {/* Header mit Bild im Hintergrund */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        backgroundColor: '#D9CCBA',
      }}>
        {/* Hintergrund-Bild */}
        <img
          src="/header-bg.png"
          alt="Enny's Lounge & Grow Store"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        />

        {/* Header-Navigation oben drüber */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Header
            cartCount={cartItems.length}
            onNavigate={setPage}
            currentPage={page}
            onLogoClick={() => setPage('home')}
            user={user}
            onCategorySelect={setSelectedCategory}
            categories={categories}
          />
        </div>
      </div>


      <main className="flex-grow">
        {/* HOME PAGE */}
        {page === 'home' && (
          <>
            <Hero onShopClick={() => setPage('shop')} />
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* SHOP PAGE */}
        {page === 'shop' && (
          <>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '280px 1fr',
                gap: '2rem'
              }}>
                {/* Sidebar */}
                <ShopSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(catId) => {
                    setSelectedCategory(catId);
                    setCurrentPage(1);
                  }}
                  sortBy={sortBy}
                  onSortChange={(sort) => {
                    setSortBy(sort);
                    setCurrentPage(1);
                  }}
                />

                {/* Main Content */}
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                      fontSize: '2.25rem',
                      fontWeight: 'bold',
                      fontFamily: 'Georgia, serif',
                      marginBottom: '0.5rem',
                      color: '#1a3a2a',
                    }}>
                      Sortiment
                    </h1>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#6D4E2E',
                      marginBottom: '1rem',
                    }}>
                      {filteredProducts.length} Produkte gefunden
                      {selectedCategory && ' · Kategorie gefiltert'}
                    </p>
                  </div>

                  {/* Product Grid */}
                  <ProductList
                    products={paginatedProducts}
                    onAddToCart={addToCart}
                    user={user}
                    onFavoriteToggle={handleFavoriteToggle}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '2rem',
                      flexWrap: 'wrap',
                    }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: currentPage === page ? '#4B5A3C' : '#D9CCBA',
                            color: currentPage === page ? '#D9CCBA' : '#1a3a2a',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== page) {
                              e.currentTarget.style.backgroundColor = 'rgba(75, 90, 60, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page) {
                              e.currentTarget.style.backgroundColor = '#D9CCBA';
                            }
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* LOGIN PAGE */}
        {page === 'login' && (
          <>
            <Login onLogin={setUser} onNavigate={setPage} />
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* REGISTER PAGE */}
        {page === 'register' && (
          <>
            <Register onLogin={setUser} onNavigate={setPage} />
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* ACCOUNT PAGE */}
        {page === 'account' && user && (
          <>
            <Account
              user={user}
              onNavigate={setPage}
              onLogout={() => setUser(null)}
            />
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* ADMIN PAGE */}
        {page === 'admin' && (
          <>
            <Admin user={user} onNavigate={setPage} />
            <Footer onNavigate={setPage} />
          </>
        )}

        {/* WARENKORB & CHECKOUT */}
        {(page === 'cart' || page === 'checkout') && (
          <>
            <div className="max-w-5xl mx-auto px-6 py-12">
              {/* Schritt-Indikator */}
              <div className="flex justify-between mb-12">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                        checkoutStep >= step
                          ? 'bg-ennys-green text-ennys-cream'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    <span
                      className={`font-semibold ${
                        checkoutStep >= step ? 'text-ennys-green' : 'text-gray-400'
                      }`}
                    >
                      {step === 1 ? 'WARENKORB' : step === 2 ? 'VERSAND & ADRESSE' : 'ZAHLUNG'}
                    </span>
                    {step < 3 && <div className="flex-1 h-0.5 bg-gray-300 mx-4 mt-2" />}
                  </div>
                ))}
              </div>

              {/* CHECKOUT CONTENT */}
              {checkoutStep === 1 && (
                <Cart
                  items={cartItems}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onCheckout={() => setCheckoutStep(2)}
                  isCheckoutMode={true}
                />
              )}

              {checkoutStep === 2 && (
                <Checkout
                  step={2}
                  onBack={() => setCheckoutStep(1)}
                  onNext={() => setCheckoutStep(3)}
                  cartItems={cartItems}
                  total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                  user={user}
                />
              )}

              {checkoutStep === 3 && (
                <Checkout
                  step={3}
                  onBack={() => setCheckoutStep(2)}
                  onNext={() => {
                    alert('Bestellung abgeschlossen! 🎉');
                    setCartItems([]);
                    setCheckoutStep(1);
                    setPage('home');
                  }}
                  cartItems={cartItems}
                  total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                  user={user}
                />
              )}
            </div>
            <Footer onNavigate={setPage} />
          </>
        )}
      </main>
      </div>
    </div>
  );
}
