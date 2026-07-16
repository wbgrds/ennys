import Card from './Card';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function CategoryModal({ category, categories, onCategorySelect, onClose }) {
  const subcategories = categories.filter(c => c.parentId === category.id);

  // Teile Unterkategorien in 4 Spalten auf
  const cols = 4;
  const itemsPerCol = Math.ceil(subcategories.length / cols);
  const columns = [];
  for (let i = 0; i < cols; i++) {
    columns.push(subcategories.slice(i * itemsPerCol, (i + 1) * itemsPerCol));
  }

  return (
    <>
      {/* Overlay Hintergrund */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          backgroundColor: colors.cream,
          border: `2px solid ${colors.logoGreen}`,
          zIndex: 1000,
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
              color: colors.dark,
              margin: 0,
            }}>
              {category.icon} {category.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: colors.logoGreen,
              }}
            >
              ×
            </button>
          </div>

          {/* 4-spaltige Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
          }}>
            {columns.map((col, colIndex) => (
              <div key={colIndex}>
                {col.map(subcat => (
                  <button
                    key={subcat.id}
                    onClick={() => {
                      onCategorySelect(subcat.id);
                      onClose();
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 0',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: colors.dark,
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s',
                      marginBottom: '0.5rem',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.logoGreen}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.dark}
                  >
                    → {subcat.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
