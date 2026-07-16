export default function Card({ children, style = {}, className = '' }) {
  const cardStyle = {
    backgroundColor: '#D9CCBA',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(75, 90, 60, 0.12)',
    padding: '1.5rem',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div style={cardStyle} className={className}>
      {children}
    </div>
  );
}
