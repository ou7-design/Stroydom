import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Send } from 'lucide-react';
import { useCart } from '@/src/contexts/CartContext';

function buildTelegramMessage(items: ReturnType<typeof useCart>['items'], total: number): string {
  const lines: string[] = [
    '🛒 *Yangi buyurtma — STROYDOM*',
    '',
    ...items.map((item, i) => {
      const colorLine = item.color ? `   🎨 Rang: ${item.color}` : '';
      return [
        `${i + 1}. *${item.name}*`,
        `   💰 Narx: ${item.price.toLocaleString()} so'm`,
        `   📦 Miqdor: ${item.quantity} ta`,
        colorLine,
        `   🔢 Jami: ${(item.price * item.quantity).toLocaleString()} so'm`,
      ].filter(Boolean).join('\n');
    }),
    '',
    `━━━━━━━━━━━━━━━━━`,
    `💵 *Umumiy summa: ${total.toLocaleString()} so'm*`,
  ];
  return lines.join('\n');
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice } = useCart();

  const handleOrder = () => {
    const message = buildTelegramMessage(items, totalPrice);
    const encoded = encodeURIComponent(message);
    window.open(`https://t.me/Stroydom_Sales?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Savatcha</h2>
                {totalCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-semibold">
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium">Savatcha bo'sh</p>
                  <p className="text-sm text-muted-foreground">Mahsulotlarni qo'shing va buyurtma bering</p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Xarid qilishni boshlash
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3 bg-muted/40 rounded-xl p-3 border border-border/50"
                    >
                      {/* Image */}
                      <div className="w-18 h-18 flex-shrink-0 rounded-lg overflow-hidden bg-muted w-[72px] h-[72px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        {item.color && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-muted-foreground font-mono">{item.color}</span>
                          </div>
                        )}
                        <p className="text-sm font-bold text-primary mt-1">
                          {(item.price * item.quantity).toLocaleString()} so'm
                        </p>

                        {/* Quantity + remove */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto w-7 h-7 rounded-lg text-destructive border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="flex-shrink-0 px-5 py-5 border-t border-border bg-muted/20 space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jami summa</span>
                  <span className="text-xl font-bold">{totalPrice.toLocaleString()} so'm</span>
                </div>

                {/* Telegram order button */}
                <button
                  onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2AABEE] hover:bg-[#229ED9] text-white rounded-xl font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-[#2AABEE]/25"
                >
                  <Send className="w-5 h-5" />
                  Telegram orqali buyurtma berish
                </button>

                {/* Clear cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center"
                >
                  Savatchani tozalash
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
