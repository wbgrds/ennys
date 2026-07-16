import { useState, useEffect } from 'react';
import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Account({ user, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('profile'); // profile, favorites, orders

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        setError('Profil konnte nicht geladen werden');
        return;
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError('Fehler beim Abrufen des Profils: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p style={{ color: colors.textOlive }}>Profil wird geladen...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem' }}>
        <p style={{ color: colors.textOlive }}>{error || 'Profil nicht verfügbar'}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
      }}>
        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            color: colors.dark,
            marginBottom: '0.5rem',
          }}>
            Willkommen, {profile.name}! 👋
          </h1>
          <p style={{ color: colors.textOlive }}>
            {profile.isAdmin && '🔑 Admin-Konto'}
            {!profile.isAdmin && 'Kundenkonto'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#dc2626',
            color: colors.cream,
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#991b1b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
        >
          Abmelden
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: `2px solid ${colors.cream}`,
        paddingBottom: '1rem',
      }}>
        {['profile', 'favorites', 'orders'].map(tabName => (
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (tab !== tabName) e.currentTarget.style.backgroundColor = 'rgba(75, 90, 60, 0.1)';
            }}
            onMouseLeave={(e) => {
              if (tab !== tabName) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {tabName === 'profile' && '👤 Profil'}
            {tabName === 'favorites' && '❤️ Favoriten'}
            {tabName === 'orders' && '📦 Bestellungen'}
          </button>
        ))}
      </div>

      {/* Profil Tab */}
      {tab === 'profile' && (
        <Card>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: colors.dark,
          }}>
            Profilinformationen
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                color: colors.textOlive,
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Name
              </label>
              <p style={{ color: colors.dark, fontSize: '1.125rem' }}>{profile.name}</p>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                color: colors.textOlive,
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Email
              </label>
              <p style={{ color: colors.dark, fontSize: '1.125rem' }}>{profile.email}</p>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                color: colors.textOlive,
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                Registriert seit
              </label>
              <p style={{ color: colors.dark, fontSize: '1.125rem' }}>
                {new Date(profile.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>

            {profile.isAdmin && (
              <div style={{
                backgroundColor: 'rgba(201, 169, 97, 0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.gold}`,
              }}>
                <p style={{ color: colors.gold, fontWeight: '600', marginBottom: '1rem' }}>
                  🔑 Admin-Funktionen verfügbar
                </p>
                <button
                  onClick={() => onNavigate('admin')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.gold,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🔧 Zum Admin Panel
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Favoriten Tab */}
      {tab === 'favorites' && (
        <Card>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: colors.dark,
          }}>
            Meine Favoriten
          </h2>

          {profile.favorites && profile.favorites.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {profile.favorites.map(fav => (
                <div key={fav.id} style={{
                  padding: '1rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                }}>
                  <p style={{ fontWeight: '600', color: colors.dark }}>{fav.name}</p>
                  <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>{fav.price.toFixed(2)}€</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: colors.textOlive, textAlign: 'center', paddingY: '2rem' }}>
              Keine Favoriten gespeichert
            </p>
          )}
        </Card>
      )}

      {/* Bestellungen Tab */}
      {tab === 'orders' && (
        <Card>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: colors.dark,
          }}>
            Meine Bestellungen
          </h2>

          {profile.orders && profile.orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.orders.map(order => (
                <div key={order.id} style={{
                  padding: '1.5rem',
                  border: `1px solid ${colors.cream}`,
                  borderRadius: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600', color: colors.dark }}>
                      Bestellung #{order.id}
                    </h4>
                    <span style={{
                      backgroundColor: colors.logoGreen,
                      color: colors.cream,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: colors.textOlive }}>
                    {new Date(order.createdAt).toLocaleDateString('de-DE')} · {order.total.toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: colors.textOlive, textAlign: 'center', paddingY: '2rem' }}>
              Noch keine Bestellungen
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
