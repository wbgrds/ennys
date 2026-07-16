import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function ShopSidebar({ categories, selectedCategory, onCategorySelect, sortBy, onSortChange }) {
  const mainCategories = categories.filter(c => c.parentId === null);

  const getSubcategories = (parentId) => categories.filter(c => c.parentId === parentId);

  return (
    <aside style={{
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    }}>
      {/* Kategorien */}
      <Card>
        <h3 style={{
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: colors.dark,
          fontSize: '1rem',
        }}>
          📂 Kategorien
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mainCategories.map(parent => (
            <div key={parent.id}>
              {/* Hauptkategorie */}
              <button
                onClick={() => onCategorySelect(parent.id)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: selectedCategory === parent.id ? '700' : '600',
                  color: selectedCategory === parent.id ? colors.logoGreen : colors.dark,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => !selectedCategory && (e.currentTarget.style.color = colors.logoGreen)}
                onMouseLeave={(e) => !selectedCategory && (e.currentTarget.style.color = colors.dark)}
              >
                {parent.icon} {parent.name}
              </button>

              {/* Unterkategorien */}
              <div style={{ marginLeft: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {getSubcategories(parent.id).map(subcat => (
                  <button
                    key={subcat.id}
                    onClick={() => onCategorySelect(subcat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.4rem 0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: selectedCategory === subcat.id ? colors.logoGreen : colors.textOlive,
                      fontWeight: selectedCategory === subcat.id ? '600' : '400',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.logoGreen}
                    onMouseLeave={(e) => e.currentTarget.style.color = selectedCategory === subcat.id ? colors.logoGreen : colors.textOlive}
                  >
                    → {subcat.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Alle Kategorien */}
          {selectedCategory && (
            <button
              onClick={() => onCategorySelect(null)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: colors.cream,
                color: colors.logoGreen,
                border: `1px solid ${colors.logoGreen}`,
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.logoGreen;
                e.currentTarget.style.color = colors.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.cream;
                e.currentTarget.style.color = colors.logoGreen;
              }}
            >
              ✕ Filter zurücksetzen
            </button>
          )}
        </div>
      </Card>

      {/* Sortierung */}
      <Card>
        <h3 style={{
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: colors.dark,
          fontSize: '1rem',
        }}>
          ⬍ Sortierung
        </h3>

        <select
          value={sortBy || 'default'}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${colors.cream}`,
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            color: colors.dark,
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <option value="default">Standard</option>
          <option value="price-asc">Preis: Niedrig → Hoch</option>
          <option value="price-desc">Preis: Hoch → Niedrig</option>
          <option value="name">Name A-Z</option>
          <option value="newest">Neu hinzugefügt</option>
        </select>
      </Card>

      {/* Info */}
      <Card style={{ backgroundColor: 'rgba(75, 90, 60, 0.1)', borderColor: colors.logoGreen }}>
        <p style={{
          fontSize: '0.875rem',
          color: colors.textOlive,
          margin: 0,
          lineHeight: 1.6,
        }}>
          💡 <strong>Tipp:</strong> Klick auf eine Kategorie oben um zu filtern. Wir haben jetzt {categories.filter(c => c.parentId).length} verschiedene Unterkategorien!
        </p>
      </Card>
    </aside>
  );
}
