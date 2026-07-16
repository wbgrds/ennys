import { useState } from 'react';
import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Checkout({ step, onBack, onNext, cartItems, total, user }) {
  const [formData, setFormData] = useState({
    firstname: user?.name?.split(' ')[0] || '',
    lastname: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 3) {
      // Bestellung speichern
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems,
            total: total,
            shippingCost: total >= 35 ? 0 : 5.99,
            shippingAddress: {
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
              phone: formData.phone,
              street: formData.street,
              city: formData.city,
              zip: formData.zip,
            },
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Bestellung konnte nicht erstellt werden');
          return;
        }

        onNext();
      } catch (err) {
        setError('Fehler beim Erstellen der Bestellung: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      onNext();
    }
  };

  return (
    <Card>
      {step === 2 && (
        <div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            marginBottom: '1.5rem',
            color: colors.dark,
          }}>
            📦 Versand & Adresse
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
            {/* Persönliche Daten */}
            <div>
              <h3 style={{
                fontWeight: 'bold',
                color: colors.dark,
                marginBottom: '1rem',
                fontSize: '1rem',
              }}>
                Persönliche Daten
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Vorname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Nachname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Kontaktdaten */}
            <div>
              <h3 style={{
                fontWeight: 'bold',
                color: colors.dark,
                marginBottom: '1rem',
                fontSize: '1rem',
              }}>
                Kontaktdaten
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 style={{
                fontWeight: 'bold',
                color: colors.dark,
                marginBottom: '1rem',
                fontSize: '1rem',
              }}>
                Lieferadresse
              </h3>
              <input
                type="text"
                name="street"
                placeholder="Straße & Hausnummer"
                value={formData.street}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text"
                  name="zip"
                  placeholder="PLZ"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Stadt"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: colors.cream,
                  color: colors.dark,
                  border: `1px solid ${colors.logoGreen}`,
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.logoGreen}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.cream}
              >
                ← Zurück
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.75rem 2rem',
                  backgroundColor: colors.logoGreen,
                  color: colors.cream,
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.dark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.logoGreen}
              >
                Weiter zur Zahlung →
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            marginBottom: '1.5rem',
            color: colors.dark,
          }}>
            💳 Zahlung
          </h2>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: colors.dark,
              }}>
                Karteninhaber
              </label>
              <input
                type="text"
                name="cardName"
                placeholder="Name auf Karte"
                value={formData.cardName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: colors.dark,
              }}>
                Kartennummer
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: colors.dark,
                }}>
                  Gültig bis
                </label>
                <input
                  type="text"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: colors.dark,
                }}>
                  CVC
                </label>
                <input
                  type="text"
                  name="cardCvc"
                  placeholder="123"
                  value={formData.cardCvc}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${colors.cream}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(201, 169, 97, 0.1)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${colors.gold}`,
              marginTop: '1rem',
            }}>
              <p style={{ color: colors.gold, fontWeight: '600', marginBottom: '0.5rem' }}>
                ℹ️ Test-Kartendaten
              </p>
              <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                Nummer: 4111111111111111<br />
                Datum: 12/25<br />
                CVC: 123
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: colors.cream,
                  color: colors.dark,
                  border: `1px solid ${colors.logoGreen}`,
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                ← Zurück
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 2rem',
                  backgroundColor: colors.logoGreen,
                  color: colors.cream,
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.dark)}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.logoGreen)}
              >
                {loading ? 'Bestellung wird erstellt...' : '✓ Bestellung abschließen'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}
