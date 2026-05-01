'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiZap, FiFolder, FiBriefcase, FiEdit3, FiPlus, FiDatabase } from 'react-icons/fi';

interface Stats {
  skills: number;
  projects: number;
  experiences: number;
  blogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ skills: 0, projects: 0, experiences: 0, blogs: 0 });
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [skills, projects, experiences, blogs] = await Promise.all([
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/experiences').then((r) => r.json()),
        fetch('/api/blogs?all=true').then((r) => r.json()),
      ]);
      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        experiences: Array.isArray(experiences) ? experiences.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      await fetchStats();
      alert('Database seeded successfully!');
    } catch {
      alert('Seed failed');
    }
    setSeeding(false);
  };

  const cards = [
    { label: 'Skills', count: stats.skills, href: '/admin/skills', icon: <FiZap size={24} />, color: '#6366f1' },
    { label: 'Projects', count: stats.projects, href: '/admin/projects', icon: <FiFolder size={24} />, color: '#8b5cf6' },
    { label: 'Experiences', count: stats.experiences, href: '/admin/experiences', icon: <FiBriefcase size={24} />, color: '#a855f7' },
    { label: 'Blog Posts', count: stats.blogs, href: '/admin/blogs', icon: <FiEdit3 size={24} />, color: '#d946ef' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Durgesh! Manage your portfolio content here.</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-stat-card" style={{ '--accent': card.color } as React.CSSProperties}>
            <div className="admin-stat-icon" style={{ color: card.color }}>{card.icon}</div>
            <div className="admin-stat-info">
              <span className="admin-stat-count">{card.count}</span>
              <span className="admin-stat-label">{card.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="admin-actions-grid">
          <Link href="/admin/blogs/new" className="admin-action-card">
            <FiEdit3 size={28} />
            <span>Write New Post</span>
          </Link>
          <Link href="/admin/projects" className="admin-action-card">
            <FiPlus size={28} />
            <span>Add Project</span>
          </Link>
          <Link href="/admin/skills" className="admin-action-card">
            <FiZap size={28} />
            <span>Add Skill</span>
          </Link>
          <button onClick={handleSeed} disabled={seeding} className="admin-action-card">
            <FiDatabase size={28} />
            <span>{seeding ? 'Seeding...' : 'Seed Database'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
