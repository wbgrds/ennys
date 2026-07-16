import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ backgroundColor: 'transparent', color: colors.cream, marginTop: '5rem' }}>
      {/* Info Section */}
      <div style={{ backgroundColor: 'transparent', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            marginBottom: '1rem',
          }}>
            Verbrauchsmaterial im Abo.
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '1.5rem',
            maxWidth: '42rem',
            lineHeight: 1.6,
          }}>
            Wir halten zu deinem Setup. Jede Lieferung kommt verlässlich — alle 8, 12 oder 16 Wochen,
            jederzeit pausierbar. 10 % Mengenrabatt plus 5 % Abo-Vorteil. Wenn etwas anders sein
            soll, sag es uns.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.gold,
              color: colors.dark,
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Frank-Abo ansehen
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {/* Logo & About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.875rem' }}>🐺</div>
              <div>
                <h3 style={{ fontWeight: 'bold', color: colors.cream }}>Enny's</h3>
                <p style={{ fontSize: '0.75rem', color: colors.gold }}>LOUNGE & GROW STORE</p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: colors.gold, lineHeight: 1.6 }}>
              Headshop & Growshop für Eigenversorger — ruhig, sachlich, diskret.
            </p>
          </div>

          {/* Sortiment Card */}
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: colors.cream }}>SORTIMENT</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {['Glas & Rauchgeräte', 'Grinder', 'Vaporizer', 'Bundles & Sets', 'Anbau-Rezepte'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('shop')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.gold,
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      textAlign: 'left',
                      fontSize: 'inherit',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.cream}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.logoGreen}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Service Card */}
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: colors.cream }}>SERVICE</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {['Wiederbestellung', 'Versand & Lieferung', 'Diskretion', 'Account', 'Kontakt'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    style={{
                      color: colors.gold,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.cream}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.logoGreen}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          {/* Marke Card */}
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: colors.cream }}>MARKE</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {['Über Enny\'s', 'Werte', 'Wertversprechen', 'CanG & Recht', 'Impressum'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    style={{
                      color: colors.gold,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.cream}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.logoGreen}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bottom Info */}
        <div style={{
          borderTop: `1px solid ${colors.logoGreen}`,
          paddingTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.875rem',
          color: colors.logoGreen,
          marginBottom: '2rem',
        }}>
          <div>✓ Kostenloser Versand ab 35 €</div>
          <div>✓ Diskreter Versand</div>
          <div>✓ CanG-konform - Altersüberprüfung ab 18</div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: colors.logoGreen,
          paddingTop: '2rem',
          borderTop: `1px solid ${colors.logoGreen}`,
        }}>
          <p>© 2026 ENNY'S LOUNGE & GROW STORE · ENTWURF SOFT-LAUNCH PHASE 2.0</p>
        </div>
      </div>
    </footer>
  );
}
