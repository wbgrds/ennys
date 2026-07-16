import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Cart({ items, onRemove, onUpdateQuantity, onCheckout, isCheckoutMode }) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 35;
  const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 5.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <Card style={{ position: isCheckoutMode ? 'relative' : 'sticky', top: isCheckoutMode ? 'auto' : '80px' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        color: colors.dark,
        marginBottom: '1.5rem',
      }}>
        {isCheckoutMode ? 'WARENKORB' : '🛒 Warenkorb'}
      </h2>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ color: colors.textOlive, fontSize: '1.125rem', fontWeight: '600' }}>
            Noch nichts im Korb?
          </p>
          <p style={{ color: colors.logoGreen, fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Wähle ein Produkt oben aus! 👆
          </p>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div style={{ marginBottom: '1.5rem', maxHeight: '384px', overflowY: 'auto' }}>
            {items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  borderBottom: `1px solid ${colors.cream}`,
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '600', color: colors.dark }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                    {item.price.toFixed(2)}€ / Stück
                  </p>

                  {/* Quantity Controls */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    alignItems: 'center',
                    backgroundColor: colors.cream,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    width: 'fit-content',
                  }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.dark,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1.125rem',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.logoGreen}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.dark}
                    >
                      −
                    </button>
                    <span style={{
                      width: '32px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: colors.dark,
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.dark,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1.125rem',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.logoGreen}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.dark}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: 'bold',
                    color: colors.logoGreen,
                    fontSize: '1.125rem',
                  }}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.textOlive,
                      fontSize: '0.875rem',
                      marginTop: '0.25rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textOlive}
                  >
                    ✕ Entfernen
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            padding: '1rem 0',
            marginBottom: '1.5rem',
            borderTop: `1px solid ${colors.cream}`,
            borderBottom: `1px solid ${colors.cream}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textOlive, marginBottom: '0.75rem' }}>
              <span>Zwischensumme:</span>
              <span style={{ fontWeight: '600' }}>{totalPrice.toFixed(2)}€</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textOlive, marginBottom: '0.75rem' }}>
              <span>
                Versand:
                {totalPrice >= freeShippingThreshold && (
                  <span style={{ color: colors.logoGreen, fontSize: '0.875rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                    ✓ KOSTENLOS!
                  </span>
                )}
              </span>
              <span style={{ fontWeight: '600' }}>{shippingCost.toFixed(2)}€</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: colors.dark,
              paddingTop: '0.5rem',
            }}>
              <span>Gesamt:</span>
              <span style={{ color: colors.logoGreen }}>{finalTotal.toFixed(2)}€</span>
            </div>
          </div>

          {/* CTA Button */}
          {isCheckoutMode && onCheckout ? (
            <button
              onClick={onCheckout}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: colors.dark,
                color: colors.cream,
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.125rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.logoGreen;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 58, 42, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.dark;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Weiter zur Kasse →
            </button>
          ) : (
            <button style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: colors.logoGreen,
              color: colors.cream,
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.dark;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 58, 42, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.logoGreen;
              e.currentTarget.style.boxShadow = 'none';
            }}>
              🛒 Zur Kasse
            </button>
          )}

          {/* Info */}
          <p style={{
            fontSize: '0.75rem',
            color: colors.logoGreen,
            textAlign: 'center',
            marginTop: '1rem',
            fontWeight: '600',
          }}>
            ✓ Ab 35€ versandfrei · Diskreter Versand
          </p>
        </>
      )}
    </Card>
  );
}
