'use client';

import { useEffect, useState } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  order: number;
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, order: skills.length }),
      });
    }

    setName('');
    setCategory('General');
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setCategory(skill.category);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    fetchSkills();
  };

  const categories = ['Web', 'Programming', 'Data', 'Marketing', 'General', 'Tools'];

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Manage Skills</h1>
        <p>Add, edit, or remove your technical skills</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name (e.g., Python)"
          className="admin-input"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-select">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="admin-btn admin-btn-primary">
          {editingId ? 'Update' : 'Add Skill'}
        </button>
        {editingId && (
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setEditingId(null); setName(''); setCategory('General'); }}>
            Cancel
          </button>
        )}
      </form>

      <div className="admin-skills-grid">
        {skills.map((skill) => (
          <div key={skill._id} className="admin-skill-chip">
            <span className="admin-skill-name">{skill.name}</span>
            <span className="admin-skill-category">{skill.category}</span>
            <div className="admin-skill-actions">
              <button onClick={() => handleEdit(skill)} className="admin-icon-btn" title="Edit">✏️</button>
              <button onClick={() => handleDelete(skill._id)} className="admin-icon-btn" title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="admin-empty-state">
          <p>No skills added yet. Add your first skill above!</p>
        </div>
      )}
    </div>
  );
}
