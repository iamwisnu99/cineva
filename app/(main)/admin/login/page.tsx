import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login — Cineva Studio',
  description: 'Portal masuk administrator Cineva Studio streaming platform.',
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  // If already logged in, redirect to admin studio directly
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}
