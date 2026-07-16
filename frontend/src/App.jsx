import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

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
    { id: 3, name: "LED Grow Light 600W", description: "Vollspektrum LED für Pflanzenanbau", price: 189.99, stock: 8, category_id: 21, image_url: "/images/growlight.jpg", online_available: true, offline_available: false, persona_tags: ["profi", "setup"] },
    { id: 4, name: "Grinder 4-teilig", description: "Professioneller Grinder mit Kief-Auffänger", price: 34.99, stock: 25, category_id: 12, online_available: true, offline_available: true, persona_tags: ["anfänger"] },
    { id: 5, name: "Klima-Sensor", description: "Digitaler Hygrometer + Thermometer", price: 19.99, stock: 15, category_id: 26, online_available: true, offline_available: true, persona_tags: ["anfänger", "setup"] },
    { id: 6, name: "Hochwertige Papers", description: "Bio-Hemp Papers 100 Blatt", price: 2.99, stock: 100, category_id: 16, online_available: true, offline_available: true, persona_tags: ["budget"] }
  ]
};

export default function App() {
  const [page, setPage] = useState('home');
  const [products] = useState(MOCK_DATA.products);
  const [categories] = useState(MOCK_DATA.categories);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleShopClick = () => setPage('shop');
  const handleLogoClick = () => setPage('home');
  const handleNavigate = (newPage) => setPage(newPage);
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Gefilterte Produkte
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div style={{ backgroundColor: '#1a3a2a', color: '#D9CCBA', minHeight: '100vh' }}>
      <Header 
        cartCount={cartCount} 
        onNavigate={handleNavigate}
        currentPage={page}
        onLogoClick={handleLogoClick}
        categories={categories}
        onCategorySelect={handleCategorySelect}
      />

      {page === 'home' && (
        <>
          <Hero onShopClick={handleShopClick} />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {page === 'shop' && (
        <div style={{ display: 'flex', maxWidth: '1280px', margin: '0 auto', gap: '2rem', padding: '2rem' }}>
          <ProductList 
            products={filteredProducts}
            onAddToCart={addToCart}
            selectedCategory={selectedCategory}
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
          <Cart 
            items={cartItems}
            total={cartTotal}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={() => setPage('checkout')}
          />
        </div>
      )}

      {page === 'checkout' && (
        <Checkout 
          cartItems={cartItems}
          cartTotal={cartTotal}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          onBack={() => setPage('shop')}
          onComplete={() => {
            setCartItems([]);
            setPage('home');
            alert('Bestellung erfolgreich! (Demo)');
          }}
        />
      )}
    </div>
  );
}
