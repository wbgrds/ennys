import { useState, useEffect } from 'react';
import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Admin({ user, onNavigate }) {
  const [tab, setTab] = useState('products'); // products, categories, orders, guides
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState({});
  const [guideFormData, setGuideFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [productsRes, categoriesRes, ordersRes, guidesRes] = await Promise.all([
        fetch('http://localhost:3001/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/api/admin/guides', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (guidesRes.ok) setGuides(await guidesRes.json());
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Produkt wirklich löschen?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('Produkt gelöscht! ✓');
      }
    } catch (err) {
      alert('Fehler beim Löschen');
    }
  };

  const handleSaveProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      const method = editingProduct?.id ? 'PUT' : 'POST';
      const url = editingProduct?.id
        ? `http://localhost:3001/api/admin/products/${editingProduct.id}`
        : 'http://localhost:3001/api/admin/products';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingProduct?.id ? 'Produkt aktualisiert! ✓' : 'Produkt erstellt! ✓');
        setEditingProduct(null);
        setFormData({});
        fetchData();
      }
    } catch (err) {
      alert('Fehler beim Speichern');
    }
  };

  const handleDeleteGuide = async (id) => {
    if (!window.confirm('Guide wirklich löschen?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/admin/guides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setGuides(guides.filter(g => g.id !== id));
        alert('Guide gelöscht! ✓');
      }
    } catch (err) {
      alert('Fehler beim Löschen');
    }
  };

  const handleSaveGuide = async () => {
    const token = localStorage.getItem('token');
    try {
      const method = editingGuide?.id ? 'PUT' : 'POST';
      const url = editingGuide?.id
        ? `http://localhost:3001/api/admin/guides/${editingGuide.id}`
        : 'http://localhost:3001/api/admin/guides';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(guideFormData),
      });

      if (res.ok) {
        alert(editingGuide?.id ? 'Guide aktualisiert! ✓' : 'Guide erstellt! ✓');
        setEditingGuide(null);
        setGuideFormData({});
        fetchData();
      }
    } catch (err) {
      alert('Fehler beim Speichern');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: colors.textOlive, fontSize: '1.125rem' }}>
          🔐 Admin-Zugang erforderlich
        </p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Laden...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        marginBottom: '2rem',
        color: colors.dark,
      }}>
        🔧 Admin Panel
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: `2px solid ${colors.cream}`,
        paddingBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        {['products', 'categories', 'orders', 'guides'].map(tabName => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: tab === tabName ? colors.logoGreen : 'transparent',
              color: tab === tabName ? colors.cream : colors.textOlive,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: tab === tabName ? '600' : '400',
            }}
          >
            {tabName === 'products' && '📦 Produkte'}
            {tabName === 'categories' && '📂 Kategorien'}
            {tabName === 'orders' && '📋 Bestellungen'}
            {tabName === 'guides' && '📚 Guides'}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({});
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.gold,
              color: colors.dark,
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1.5rem',
            }}
          >
            + Neues Produkt
          </button>

          {editingProduct !== undefined && (
            <Card style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', color: colors.dark }}>
                {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Produktname"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Preis"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                />
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                >
                  <option value="">Kategorie wählen</option>
                  {categories.filter(c => c.parentId).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Beschreibung"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  marginTop: '1rem',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setEditingProduct(undefined)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.cream,
                    color: colors.dark,
                    border: `1px solid ${colors.logoGreen}`,
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveProduct}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.logoGreen,
                    color: colors.cream,
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Speichern
                </button>
              </div>
            </Card>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {products.map(product => (
              <Card key={product.id}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: colors.dark }}>
                  {product.name}
                </h4>
                <p style={{ fontSize: '0.875rem', color: colors.textOlive, marginBottom: '1rem' }}>
                  {product.price.toFixed(2)}€ · Stock: {product.stock}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData(product);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: colors.gold,
                      color: colors.dark,
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    ✏️ Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    🗑️ Löschen
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === 'categories' && (
        <Card>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', color: colors.dark }}>
            Kategorien ({categories.length})
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {categories.map(cat => (
              <div
                key={cat.id}
                style={{
                  padding: '1rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  backgroundColor: cat.parentId ? 'rgba(75, 90, 60, 0.05)' : 'rgba(75, 90, 60, 0.1)',
                  marginLeft: cat.parentId ? '1.5rem' : 0,
                }}
              >
                <div style={{ fontWeight: cat.parentId ? '400' : '600', color: colors.dark }}>
                  {cat.icon} {cat.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                  {cat.description}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <Card>
          <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', color: colors.dark }}>
            Bestellungen ({orders.length})
          </h3>
          {orders.length === 0 ? (
            <p style={{ color: colors.textOlive }}>Noch keine Bestellungen</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {orders.map(order => (
                <div
                  key={order.id}
                  style={{
                    padding: '1.5rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Bestellung #{order.id}</strong>
                    <span style={{
                      backgroundColor: colors.logoGreen,
                      color: colors.cream,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                    {new Date(order.createdAt).toLocaleDateString('de-DE')} · {order.total.toFixed(2)}€ · {order.items.length} Artikel
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* GUIDES TAB */}
      {tab === 'guides' && (
        <div>
          <button
            onClick={() => {
              setEditingGuide(null);
              setGuideFormData({});
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.gold,
              color: colors.dark,
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1.5rem',
            }}
          >
            + Neuer Guide
          </button>

          {editingGuide !== undefined && (
            <Card style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', color: colors.dark }}>
                {editingGuide ? 'Guide bearbeiten' : 'Neuer Guide'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Titel"
                  value={guideFormData.title || ''}
                  onChange={(e) => setGuideFormData({ ...guideFormData, title: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Kategorie"
                  value={guideFormData.category || ''}
                  onChange={(e) => setGuideFormData({ ...guideFormData, category: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <textarea
                placeholder="Content (Markdown oder HTML)"
                value={guideFormData.content || ''}
                onChange={(e) => setGuideFormData({ ...guideFormData, content: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  marginTop: '1rem',
                  minHeight: '250px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setEditingGuide(undefined)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.cream,
                    color: colors.dark,
                    border: `1px solid ${colors.logoGreen}`,
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveGuide}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.logoGreen,
                    color: colors.cream,
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Speichern
                </button>
              </div>
            </Card>
          )}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {guides.map(guide => (
              <Card key={guide.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: colors.dark }}>
                      {guide.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: colors.textOlive, marginBottom: '0.5rem' }}>
                      📁 {guide.category}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                      {guide.content.substring(0, 100)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingGuide(guide);
                        setGuideFormData(guide);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: colors.gold,
                        color: colors.dark,
                        border: 'none',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      ✏️ Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteGuide(guide.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
