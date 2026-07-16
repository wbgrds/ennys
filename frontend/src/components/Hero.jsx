import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Hero({ onShopClick }) {
  return (
    <section style={{ backgroundColor: 'transparent', color: colors.cream, padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Main Hero - Two Column (Mobile: One Column) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1.2fr 0.8fr',
          gap: window.innerWidth < 768 ? '2rem' : '4rem',
          alignItems: 'center',
          marginBottom: '6rem'
        }}>

          {/* Left: Text & CTA */}
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '0.1em', color: colors.gold }}>
              EIGENVERSORGUNG · HEADSHOP & GROWSHOP
            </p>

            <h1 style={{
              fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
            }}>
              Anbauen, wie du es willst.
            </h1>

            <p style={{
              fontSize: '1.125rem',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              color: colors.cream,
            }}>
              Kurierte Bundles, Anbau-Rezepte in einem Klick und Verbrauchsmaterial im Abo. Ehrlich bepreist, diskret versendet — vom ersten Indoor bis zum Profi-Setup.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={onShopClick}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: colors.gold,
                  color: colors.dark,
                  fontWeight: 'bold',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(201, 169, 97, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(201, 169, 97, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 169, 97, 0.3)';
                }}
              >
                Sortiment ansehen
              </button>

              <button
                style={{
                  padding: '1rem 2rem',
                  border: `2px solid ${colors.cream}`,
                  color: colors.cream,
                  fontWeight: 'bold',
                  borderRadius: '0.75rem',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cream;
                  e.currentTarget.style.color = colors.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.cream;
                }}
              >
                Anbau-Rezepte
              </button>
            </div>
          </div>

          {/* Right: Logo Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: colors.cream,
              width: window.innerWidth < 768 ? '200px' : '280px',
              height: window.innerWidth < 768 ? '200px' : '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                src="/logo.png"
                alt="Husky Logo"
                style={{ width: '200px', height: '200px', objectFit: 'contain', marginBottom: '1rem' }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: colors.logoGreen }}>
                Enny's
              </h2>
              <p style={{ fontSize: '0.75rem', color: colors.textOlive, fontWeight: '600' }}>
                LOUNGE & GROW STORE
              </p>
            </Card>
          </div>
        </div>

        {/* Trust/Values Section */}
        <div style={{
          borderTop: `1px solid rgba(217, 204, 186, 0.3)`,
          paddingTop: '4rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
            gap: window.innerWidth < 768 ? '1rem' : '2rem',
          }}>
            {[
              { icon: '✓', title: 'LOYALITÄT', desc: 'Dauerhaft fair bepreist' },
              { icon: '🌿', title: 'NATUR', desc: 'Nachhaltig & organisch' },
              { icon: '🔓', title: 'FREIHEIT', desc: 'Selbstbestimmtes Wachstum' },
              { icon: '🤝', title: 'EHRLICHKEIT', desc: 'Transparente Kommunikation' },
              { icon: '🌍', title: 'SOUVERÄNITÄT', desc: 'Eigenversorgung fördern' },
            ].map((item, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '1.5rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '0.5rem', color: colors.cream }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: colors.gold, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
