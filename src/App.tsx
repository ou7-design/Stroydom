/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Star, Mail, Phone, MapPin } from "lucide-react";
import { Header } from "@/components/ui/header-1";
import { ContactPage } from "@/components/ui/contact-page";
import { HeroSection, LogosSection } from "@/components/ui/hero-1";
import { AboutSection } from "@/components/ui/about-section";
import { ProductCard } from "@/components/ui/product-card-1";
import { NewsCards } from "@/components/ui/news-cards";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { CartProvider } from './contexts/CartContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Default building materials products shown when no backend products available
const DEFAULT_PRODUCTS = [
  {
    _id: "1",
    name: "Viega Quvur Tizimi",
    price: 450000,
    originalPrice: 550000,
    rating: 4.9,
    reviewCount: 87,
    discount: 18,
    freeShipping: true,
    isNew: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop",
    ],
    colors: ["#c0c0c0", "#ffd700", "#a0522d"],
    sizes: ["1/2\"", "3/4\"", "1\"", "1.5\""],
  },
  {
    _id: "2",
    name: "Chaffoteaux Isitish Qozoni",
    price: 3200000,
    originalPrice: 3800000,
    rating: 4.7,
    reviewCount: 54,
    discount: 15,
    freeShipping: true,
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop",
    ],
    colors: ["#f5f5f5", "#2e2e2e"],
    sizes: ["24 kW", "30 kW", "35 kW"],
  },
  {
    _id: "3",
    name: "BWT Suv Filtri",
    price: 890000,
    originalPrice: 990000,
    rating: 4.8,
    reviewCount: 121,
    discount: 10,
    freeShipping: false,
    isNew: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
    ],
    colors: ["#1a73e8", "#f5f5f5"],
    sizes: ["3/4\"", "1\""],
  },
];

const ProductsSection = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : DEFAULT_PRODUCTS;

  return (
    <section id="products" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Mahsulotlar
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight text-foreground">
            Sifatli mahsulotlar siz uchun.
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              productId={product._id || product.id || String(Math.random())}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice || product.price}
              discount={product.discount || 0}
              freeShipping={product.freeShipping ?? true}
              images={product.images?.length ? product.images : [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
              ]}
              colors={product.colors || ["#1a73e8", "#c0c0c0", "#2e2e2e"]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


const HomeLayout = () => {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-primary-foreground bg-background text-foreground transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <LogosSection />
        <AboutSection />
        <ProductsSection />
        <NewsCards />
        </main>
      <ContactPage />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<HomeLayout />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <CartDrawer />
        </AdminProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
