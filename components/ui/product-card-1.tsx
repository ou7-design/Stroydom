import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/contexts/CartContext";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";

// ----------- Inline Card primitives (avoids conflict with card.tsx) -----------

const CardRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);
CardRoot.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// ----------- Inline Badge -----------

const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold text-white",
      className
    )}
  >
    {children}
  </span>
);

// ----------- ProductCard -----------

export interface ProductCardProps {
  key?: React.Key;
  productId?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  colors?: string[];
  discount?: number;
  freeShipping?: boolean;
}

export function ProductCard({
  productId = "product",
  name = "Premium Mahsulot",
  price = 89990,
  originalPrice = 129990,
  images = ["/logo.svg"],
  colors = ["#1e293b", "#a855f7", "#0ea5e9", "#84cc16"],
  discount = 30,
  freeShipping = true,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (isAddedToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart({
        productId,
        name,
        price,
        image: images[0] || '',
        color: selectedColor || undefined,
      });
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 500);
  };

  return (
    <CardRoot className="w-full max-w-sm overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-lg transition-all duration-300 rounded-md">
      {/* Image carousel */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`${name} - View ${currentImageIndex + 1}`}
          loading="lazy"
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-primary w-4" : "bg-primary/30 w-1.5"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Discount badge only */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-rose-500">-{discount}%</Badge>
          </div>
        )}


      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium line-clamp-1">{name}</h3>
            {freeShipping && (
              <span className="text-xs text-emerald-600 mt-1 block">
                Bepul yetkazish
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{price.toLocaleString()} so'm</span>
            {originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toLocaleString()} so'm
              </span>
            )}
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Rang</div>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-primary ring-offset-2"
                        : "ring-1 ring-muted hover:ring-primary"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAddingToCart || isAddedToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Qo'shilmoqda...
            </>
          ) : isAddedToCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Savatga qo'shildi
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Savatga qo'shish
            </>
          )}
        </Button>
      </CardFooter>
    </CardRoot>
  );
}
