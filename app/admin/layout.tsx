'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AuthProvider from '../../components/AuthProvider';
import AdminSidebar from '../../components/admin/AdminSidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
    if (status === 'authenticated' && isLoginPage) {
      router.push('/admin');
    }
  }, [status, router, isLoginPage]);

  // Login page renders without sidebar/guard
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="admin-loading">
        <div className="admin-spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
