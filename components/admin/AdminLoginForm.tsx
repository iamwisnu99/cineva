'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle, Database, CheckCircle2 } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('primawisnu99@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Email atau password salah.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Autentikasi berhasil. Membuka Cineva Studio...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage('Koneksi terganggu. Silakan periksa jaringan dan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-3xl bg-[#0b0e16] border border-[#232b3e] shadow-2xl p-7 sm:p-9 backdrop-blur-xl">
        {/* Glow behind box */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center space-y-3 mb-8">
          <div className="relative w-20 h-20 flex items-center justify-center mx-auto">
            <Image
              src="/cineva_logo.png"
              alt="Cineva Logo"
              width={80}
              height={80}
              priority
              className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(245,158,11,0.2)]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
              <span>Cineva Studio</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black uppercase">
                Admin
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Portal login khusus administrator & manajemen konten
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07090e] border border-[#232b3e] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#07090e] border border-[#232b3e] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Cineva Studio</span>
              </>
            )}
          </button>
        </form>

        {/* Security badges per user requirements */}
        <div className="mt-8 pt-6 border-t border-[#1b2234] space-y-2">
          <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Password di-enkripsi dengan algoritma <strong>bcrypt</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
            <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Database Supabase Table <code>admin_users</code></span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Zero API Key Leakage (100% Server-Side, aman dari DevTools)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
