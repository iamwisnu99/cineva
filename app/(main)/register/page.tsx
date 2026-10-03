import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getViewerSession } from '@/lib/auth/user';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Daftar Akun Penonton — Cineva',
  description: 'Daftar akun Cineva gratis dan verifikasi OTP untuk mulai menonton film dan serial orisinal.',
};

export default async function RegisterPage() {
  const viewer = await getViewerSession();

  if (viewer) {
    redirect('/');
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
