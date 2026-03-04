import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Plus, Pencil, Trash2, X, Save, Image as ImageIcon,
  Package, Search, Building2, Eye, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, Link
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  quantity?: number;
  images?: string[];
  image?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

type ToastType = 'success' | 'error';
interface Toast { id: number; message: string; type: ToastType; }

let toastId = 0;

export default function AdminDashboard() {
  const { logout, isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Image URL state (no file upload needed — just paste URLs)
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState(0);

  // Color state
  const [colorInput, setColorInput] = useState('#1e293b');
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(d => ({
        _id: d.id,
        ...d.data()
      })) as Product[];
      productsData.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt - a.createdAt;
      });
      setProducts(productsData);
    } catch {
      addToast('Mahsulotlarni yuklashda xato', 'error');
    }
  };

  const addToast = (message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData(product);
    const imgs = product.images?.length ? product.images : (product.image ? [product.image] : []);
    setImageUrls(imgs);
    setCurrentPreviewIdx(0);
    setColors(product.colors || []);
    setColorInput('#1e293b');
    setImageUrlInput('');
  };

  const openNew = () => {
    setEditingId('new');
    setFormData({ inStock: true, price: 0, quantity: 1 });
    setImageUrls([]);
    setCurrentPreviewIdx(0);
    setColors([]);
    setColorInput('#1e293b');
    setImageUrlInput('');
  };

  const closeModal = () => setEditingId(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mahsulotni o\'chirishni tasdiqlaysizmi?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      addToast('Mahsulot o\'chirildi', 'success');
      fetchProducts();
    } catch {
      addToast('O\'chirishda xato yuz berdi', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (url && imageUrls.length < 5 && !imageUrls.includes(url)) {
      setImageUrls(prev => [...prev, url]);
      setCurrentPreviewIdx(imageUrls.length);
    }
    setImageUrlInput('');
  };

  const removeImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
    setCurrentPreviewIdx(Math.max(0, currentPreviewIdx - 1));
  };

  const addColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors(prev => [...prev, colorInput]);
    }
  };

  const removeColor = (c: string) => setColors(prev => prev.filter(x => x !== c));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skip = ['_id', 'image', 'images', 'colors', 'sizes'];
      const productData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && !skip.includes(key)) {
          productData[key] = value;
        }
      });

      productData.images = imageUrls;
      productData.image = imageUrls[0] || '';
      productData.colors = colors;

      if (editingId === 'new') {
        productData.createdAt = Date.now();
        await addDoc(collection(db, 'products'), productData);
        addToast('Mahsulot qo\'shildi!', 'success');
      } else {
        await updateDoc(doc(db, 'products', editingId!), productData);
        addToast('Mahsulot yangilandi!', 'success');
      }
      closeModal();
      fetchProducts();
    } catch {
      addToast('Saqlashda xato yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const InputCls = "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm";

  if (loading || !isAuthenticated) return null;

  const getProductImage = (p: Product) => p.images?.[0] || p.image || '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            t.type === 'success' ? 'bg-green-500/90 text-white border-green-400' : 'bg-destructive/90 text-destructive-foreground border-destructive'
          }`}>
            {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm">STROYDOM</span>
              <span className="text-muted-foreground text-xs block leading-none">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
              <Eye size={14} /><span className="hidden sm:inline">Saytni ko'rish</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
              <LogOut size={14} /><span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Mahsulotlar</h2>
            <p className="text-muted-foreground text-sm mt-1">Jami <span className="font-semibold text-foreground">{products.length}</span> ta mahsulot</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm">
            <Plus size={16} /> Mahsulot qo'shish
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..." className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami', value: products.length, color: 'text-foreground' },
            { label: 'Mavjud', value: products.filter(p => p.inStock).length, color: 'text-green-500' },
            { label: 'Tugagan', value: products.filter(p => !p.inStock).length, color: 'text-destructive' },
            { label: 'Kategoriyalar', value: [...new Set(products.map(p => p.category).filter(Boolean))].length, color: 'text-primary' },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-2xl text-center">
            <Package size={48} className="text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground font-medium">{search ? 'Hech narsa topilmadi' : 'Mahsulot yo\'q'}</p>
            {!search && <button onClick={openNew} className="mt-4 text-sm text-primary hover:underline">Birinchi mahsulotni qo'shing →</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(product => (
              <div key={product._id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:border-primary/30 transition-all duration-300">
                <div className="relative h-44 bg-muted overflow-hidden">
                  {getProductImage(product) ? (
                    <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package size={32} className="text-muted-foreground opacity-30" /></div>
                  )}
                  <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${product.inStock ? 'bg-green-500/90 text-white' : 'bg-destructive/90 text-destructive-foreground'}`}>
                    {product.inStock ? 'Mavjud' : 'Tugagan'}
                  </div>
                  {(product.images?.length || 0) > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">{product.images?.length} rasm</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(product)} className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(product._id)} disabled={deletingId === product._id} className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-500 transition-colors disabled:opacity-50">
                      {deletingId === product._id ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin block" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">{product.category || 'Kategoriyasiz'}</div>
                  <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
                  {product.colors?.length ? (
                    <div className="flex gap-1 mb-2">
                      {product.colors.slice(0, 5).map(c => <span key={c} className="w-4 h-4 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: c }} />)}
                    </div>
                  ) : null}
                  <div className="mt-auto">
                    {product.salePrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-secondary">{product.salePrice.toLocaleString()} so'm</span>
                        <span className="text-xs text-muted-foreground line-through">{product.price?.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="font-bold">{product.price?.toLocaleString()} so'm</span>
                    )}
                    {product.quantity !== undefined && <div className="text-xs text-muted-foreground mt-0.5">Miqdor: {product.quantity}</div>}
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={() => openEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors"><Pencil size={12} /> Tahrirlash</button>
                  <button onClick={() => handleDelete(product._id)} disabled={deletingId === product._id} className="p-2 text-destructive border border-border rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <form onSubmit={handleSave} className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  {editingId === 'new' ? <Plus size={16} /> : <Pencil size={16} />}
                </div>
                <h3 className="font-semibold">{editingId === 'new' ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}</h3>
              </div>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
            </div>

            {/* Form body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {/* ── Image URL Input ── */}
              <div>
                <label className="block text-sm font-medium mb-2">Rasm URL manzillari <span className="text-muted-foreground font-normal">(maksimum 5)</span></label>
                <div className="space-y-3">
                  {/* Preview carousel */}
                  {imageUrls.length > 0 && (
                    <div className="relative h-40 rounded-xl overflow-hidden bg-muted border border-border">
                      <img src={imageUrls[currentPreviewIdx]} alt="Preview" className="w-full h-full object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {imageUrls.length > 1 && (
                        <>
                          <button type="button" onClick={() => setCurrentPreviewIdx(i => (i - 1 + imageUrls.length) % imageUrls.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <ChevronLeft size={14} />
                          </button>
                          <button type="button" onClick={() => setCurrentPreviewIdx(i => (i + 1) % imageUrls.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <ChevronRight size={14} />
                          </button>
                        </>
                      )}
                      <button type="button" onClick={() => removeImage(currentPreviewIdx)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {/* Thumbnails */}
                  {imageUrls.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {imageUrls.map((src, i) => (
                        <div key={i} onClick={() => setCurrentPreviewIdx(i)} className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${i === currentPreviewIdx ? 'border-primary' : 'border-border'}`}>
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* URL input */}
                  {imageUrls.length < 5 && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={e => setImageUrlInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                          className={`${InputCls} pl-8`}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <button type="button" onClick={addImageUrl}
                        className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0">
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                  {imageUrls.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                      <ImageIcon size={24} className="opacity-50" />
                      <span className="text-xs opacity-60">Rasm URL manzilini yukarida kiriting</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Basic fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nomi <span className="text-destructive">*</span></label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={InputCls} placeholder="Masalan: Viega quvur" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kategoriya <span className="text-destructive">*</span></label>
                  <input required type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className={InputCls} placeholder="Masalan: Quvurlar" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Narx (so'm) <span className="text-destructive">*</span></label>
                  <input required type="number" min="0" step="100" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className={InputCls} placeholder="450 000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Chegirmali narx (so'm)</label>
                  <input type="number" min="0" step="100" value={formData.salePrice || ''} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} className={InputCls} placeholder="Ixtiyoriy" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Miqdor (dona)</label>
                  <input type="number" min="0" step="1" value={formData.quantity ?? ''} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className={InputCls} placeholder="0" />
                </div>
              </div>

              {/* ── Description ── */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Tavsif</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={`${InputCls} min-h-[80px] resize-none`} placeholder="Mahsulot haqida ma'lumot..." />
              </div>

              {/* ── Colors ── */}
              <div>
                <label className="block text-sm font-medium mb-2">Ranglar</label>
                <div className="flex gap-2 items-center mb-3">
                  <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5 overflow-hidden" />
                  <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} className={`${InputCls} flex-1`} placeholder="#1e293b" />
                  <button type="button" onClick={addColor} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0">
                    Qo'sh
                  </button>
                </div>
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                      <div key={c} className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-1.5">
                        <span className="w-4 h-4 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: c }} />
                        <span className="text-xs font-mono">{c}</span>
                        <button type="button" onClick={() => removeColor(c)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Stock toggle ── */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => setFormData({...formData, inStock: !formData.inStock})}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${formData.inStock !== false ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.inStock !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <div>
                  <div className="text-sm font-medium">Mavjudlik holati</div>
                  <div className="text-xs text-muted-foreground">{formData.inStock !== false ? 'Sotuvda mavjud' : 'Tugagan'}</div>
                </div>
              </label>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-muted transition-colors font-medium">Bekor qilish</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all">
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saqlanmoqda...</>
                ) : (
                  <><Save size={14} />Saqlash</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
