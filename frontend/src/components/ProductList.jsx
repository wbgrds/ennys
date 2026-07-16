import ProductCard from './ProductCard';

export default function ProductList({ products, onAddToCart, user, onFavoriteToggle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          user={user}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
