'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiGrid, FiZap, FiFolder, FiBriefcase, FiEdit3, FiGlobe, FiLogOut, FiUser } from 'react-icons/fi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { href: '/admin/about', label: 'About Me', icon: <FiUser /> },
  { href: '/admin/skills', label: 'Skills', icon: <FiZap /> },
  { href: '/admin/projects', label: 'Projects', icon: <FiFolder /> },
  { href: '/admin/experiences', label: 'Experiences', icon: <FiBriefcase /> },
  { href: '/admin/blogs', label: 'Blog Posts', icon: <FiEdit3 /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link href="/" className="admin-sidebar-logo">
          <span className="admin-logo-icon">DK</span>
          <span>Admin Panel</span>
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-item" target="_blank">
          <span className="admin-nav-icon"><FiGlobe /></span>
          <span>View Site</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="admin-nav-item admin-logout-btn">
          <span className="admin-nav-icon"><FiLogOut /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
