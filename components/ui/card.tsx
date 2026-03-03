import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Sun, Moon } from 'lucide-react';

const ProductCard = ({ 
  product, 
  isDark = false,
  onAddToCart,
  onToggleWishlist 
}: any) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product.id, !isWishlisted);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  // Theme classes
  const cardClasses = 'bg-card text-card-foreground border-border';
  
  const textSecondary = 'text-muted-foreground';
  const textMuted = 'text-muted-foreground';
  const buttonPrimary = 'bg-primary text-primary-foreground hover:bg-primary/90';
  const wishlistButton = 'bg-background hover:bg-muted';

  return (
    <div className={`
      max-w-sm mx-auto rounded-xl border shadow-lg hover:shadow-xl 
      transition-all duration-300 overflow-hidden group transform hover:scale-[1.02]
      ${cardClasses}
    `}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`
            absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 
            ${wishlistButton} ${isWishlisted ? 'text-red-500' : textMuted} 
            hover:scale-110 shadow-lg backdrop-blur-sm
          `}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? 'currentColor' : 'none'} 
          />
        </button>

        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
          </div>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold">
              Sotuvda mavjud emas
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${textMuted}`}>
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="font-bold text-xl mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className={`text-sm mb-4 line-clamp-2 ${textSecondary}`}>
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-500">
                  ${product.salePrice}
                </span>
                <span className={`text-lg line-through ${textMuted}`}>
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                ${product.price}
              </span>
            )}
          </div>
          
          {product.inStock && (
            <span className="text-sm font-semibold bg-primary/20 text-foreground px-2 py-1 rounded-full">
              Sotuvda mavjud
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`
            w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 
            flex items-center justify-center space-x-2
            ${product.inStock
              ? `${buttonPrimary} hover:shadow-lg active:scale-95 transform`
              : `bg-muted text-muted-foreground cursor-not-allowed`
            }
          `}
        >
          <ShoppingCart size={20} />
          <span>{product.inStock ? "Savatchaga qo'shish" : 'Sotuvda mavjud emas'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
