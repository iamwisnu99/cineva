import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getViewerSession } from '@/lib/auth/user';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Masuk — Cineva: Stream with Comfortable',
  description: 'Masuk ke akun Cineva untuk menonton film dan serial orisinal.',
};

export default async function LoginPage() {
  const viewer = await getViewerSession();

  if (viewer) {
    redirect('/');
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
