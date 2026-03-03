import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, Building2, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Noto\'g\'ri parol. Qayta urinib ko\'ring.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
            <Building2 size={28} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">STROYDOM</h1>
          <p className="text-muted-foreground text-sm mt-1">Admin boshqaruv paneli</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Kirish</h2>
              <p className="text-sm text-muted-foreground mt-1">Admin paneliga kirish uchun parolingizni kiriting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Parol
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Parolni kiriting..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : 'Kirish'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 STROYDOM · Barcha huquqlar himoyalangan
        </p>
      </div>
    </div>
  );
}
