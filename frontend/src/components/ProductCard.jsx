import { useState } from 'react';
import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function ProductCard({ product, onAddToCart, user, onFavoriteToggle }) {
  const [isFavorited, setIsFavorited] = useState(
    user?.favorites?.some(fav => fav.id === product.id) || false
  );
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Bitte logge dich ein, um Favoriten zu speichern!');
      return;
    }

    setLoadingFavorite(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/auth/favorites/${product.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
        onFavoriteToggle?.();
      }
    } catch (err) {
      console.error('Fehler beim Favorit-Toggle:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };
  return (
    <Card>
      {/* Image Section */}
      <div style={{
        background: `linear-gradient(to bottom right, ${colors.cream}, #f9f7f2)`,
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '1rem',
        marginTop: '-1.5rem',
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
        borderRadius: '1rem 1rem 0 0',
      }}>
        <div style={{ fontSize: '5rem', opacity: 0.3 }}>📦</div>

        {/* Favoriten Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFavorite}
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'none',
            border: 'none',
            fontSize: '1.75rem',
            cursor: loadingFavorite ? 'not-allowed' : 'pointer',
            opacity: loadingFavorite ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => !loadingFavorite && (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => !loadingFavorite && (e.currentTarget.style.transform = 'scale(1)')}
          title={isFavorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
        {product.category_id === 1 && (
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: colors.logoGreen,
            color: colors.cream,
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontWeight: '600',
          }}>
            Frank-Achse
          </div>
        )}
        {product.category_id === 2 && (
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: colors.dark,
            color: colors.cream,
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontWeight: '600',
          }}>
            Sven-Achse
          </div>
        )}
      </div>

      {/* Product Name */}
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        color: colors.dark,
        marginBottom: '0.5rem',
      }}>
        {product.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.875rem',
        color: colors.textOlive,
        marginBottom: '1rem',
        lineHeight: 1.6,
      }}>
        {product.description}
      </p>

      {/* Persona Tags */}
      {product.persona_tags && product.persona_tags.length > 0 && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {product.persona_tags.map(persona => (
            <span
              key={persona}
              style={{
                backgroundColor: colors.cream,
                color: colors.logoGreen,
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontWeight: '600',
                border: `1px solid ${colors.light}`,
              }}
            >
              {persona}
            </span>
          ))}
        </div>
      )}

      {/* Availability */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
        {product.online_available && (
          <span style={{ color: colors.logoGreen, fontWeight: '600' }}>✓ Online</span>
        )}
        {product.offline_available && (
          <span style={{ color: colors.logoGreen, fontWeight: '600' }}>✓ Im Shop</span>
        )}
      </div>

      {/* Stock */}
      <p style={{
        fontSize: '0.75rem',
        color: colors.textOlive,
        marginBottom: '1.25rem',
        fontWeight: '600',
      }}>
        Verfügbar: <span style={{ color: colors.logoGreen }}>{product.stock} Stück</span>
      </p>

      {/* Price & Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: `1px solid ${colors.cream}`,
      }}>
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: colors.textOlive,
            fontWeight: '600',
          }}>
            Preis
          </p>
          <p style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            color: colors.logoGreen,
          }}>
            {product.price.toFixed(2)}€
          </p>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            backgroundColor: product.stock === 0 ? '#9ca3af' : colors.logoGreen,
            color: product.stock === 0 ? '#6b7280' : colors.cream,
            borderRadius: '0.5rem',
            border: 'none',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s',
            opacity: product.stock === 0 ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.backgroundColor = colors.dark;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 58, 42, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.backgroundColor = colors.logoGreen;
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {product.stock === 0 ? '✕ Ausverkauft' : '→ Hinzufügen'}
        </button>
      </div>
    </Card>
  );
}
