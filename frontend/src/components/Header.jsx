import { useState } from 'react';
import Card from './Card';
import CategoryModal from './CategoryModal';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Header({ cartCount, onNavigate, currentPage, onLogoClick, user, onCategorySelect, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const mainCategories = categories.filter(c => c.parentId === null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubcategorySelect = (categoryId) => {
    onCategorySelect?.(categoryId);
    onNavigate('shop');
    setSelectedCategory(null);
  };
  return (
    <header style={{
      backgroundColor: 'transparent',
      borderBottom: 'none',
      boxShadow: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      paddingBottom: '3rem',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.5rem 1.5rem' }}>

        {/* Top Row: Logo + Account + Warenkorb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>

          {/* Logo in Card */}
          <Card style={{ padding: '0.5rem 0.75rem', backgroundColor: colors.cream }}>
            <button
              onClick={onLogoClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.9,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Enny's Logo"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: colors.logoGreen }}>
                  Enny's
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.textOlive }}>
                  LOUNGE & GROW STORE
                </div>
              </div>
            </button>
          </Card>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <button
                onClick={() => onNavigate('account')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.logoGreen,
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.dark}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.logoGreen}
              >
                👤 {user.name}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.dark,
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.dark}
              >
                🔐 Login
              </button>
            )}

            <button
              onClick={() => onNavigate('cart')}
              style={{
                position: 'relative',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                border: 'none',
                backgroundColor: colors.logoGreen,
                color: colors.cream,
              }}
            >
              🛒 Warenkorb
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ea580c',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Row - Flat Categories */}
        <nav style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {mainCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.dark,
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(201, 169, 97, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {cat.icon} {cat.name}
            </button>
          ))}

          <button
            onClick={() => onNavigate('shop')}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: colors.logoGreen,
              color: colors.gold,
              fontWeight: '600',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
              marginLeft: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.textOlive;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(75, 90, 60, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.logoGreen;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            📚 Bundles & Anbauanleitungen
          </button>
        </nav>

        {/* Search Bar - Fixed unter Header */}
        <div style={{
          position: 'fixed',
          top: '277px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 40,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          backgroundColor: 'transparent',
        }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="🔍 Marke, Produkt oder Kategorie suchen..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#D9CCBA',
                border: `1px solid #4B5A3C`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#1a3a2a',
              }}
            />
          </div>
        </div>

        {/* Category Modal */}
        {selectedCategory && (
          <CategoryModal
            category={selectedCategory}
            categories={categories}
            onCategorySelect={handleSubcategorySelect}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </header>
  );
}
