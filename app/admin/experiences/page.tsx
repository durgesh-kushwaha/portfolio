'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Experience {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo?: string;
  type: string;
  order: number;
}

const emptyExp = { company: '', role: '', duration: '', description: '', logo: '', type: 'work' as const, order: 0 };

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyExp);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    const res = await fetch('/api/experiences');
    const data = await res.json();
    setExperiences(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'experiences');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm((prev) => ({ ...prev, logo: data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/experiences/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: experiences.length }),
      });
    }
    resetForm();
    fetchExperiences();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp._id);
    setForm({ company: exp.company, role: exp.role, duration: exp.duration, description: exp.description, logo: exp.logo || '', type: exp.type, order: exp.order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
    fetchExperiences();
  };

  const resetForm = () => {
    setForm(emptyExp);
    setEditingId(null);
    setShowForm(false);
  };

  const typeColors: Record<string, string> = { work: '#6366f1', leadership: '#8b5cf6', hackathon: '#d946ef', workshop: '#f97316' };

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Manage Experiences</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn admin-btn-primary">
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => resetForm()}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Experience' : 'New Experience'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Company / Organization</label>
                  <input className="admin-input" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Role</label>
                  <input className="admin-input" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input className="admin-input" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} placeholder="e.g., Jan 2026 – Present" required />
                </div>
                <div className="admin-form-group">
                  <label>Type</label>
                  <select className="admin-select" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                    <option value="work">Work</option>
                    <option value="leadership">Leadership</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="admin-form-group">
                <label>Company Logo (optional)</label>
                <div className="admin-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {uploading && <span className="admin-spinner"></span>}
                  {form.logo && <Image src={form.logo} alt="Logo" width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover', marginTop: 8 }} />}
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">{editingId ? 'Update' : 'Create'}</button>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-timeline">
        {experiences.map((exp) => (
          <div key={exp._id} className="admin-timeline-item">
            <div className="admin-timeline-dot" style={{ backgroundColor: typeColors[exp.type] || '#6366f1' }}></div>
            <div className="admin-timeline-card">
              <div className="admin-timeline-header">
                {exp.logo && <Image src={exp.logo} alt={exp.company} width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} />}
                <div>
                  <h3>{exp.role}</h3>
                  <p className="admin-timeline-company">{exp.company}</p>
                  <span className="admin-timeline-duration">{exp.duration}</span>
                </div>
                <span className="admin-badge" style={{ backgroundColor: typeColors[exp.type] || '#6366f1' }}>{exp.type}</span>
              </div>
              <p className="admin-timeline-desc">{exp.description}</p>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(exp)} className="admin-btn admin-btn-sm">Edit</button>
                <button onClick={() => handleDelete(exp._id)} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="admin-empty-state">
          <p>No experiences yet. Click &quot;Add Experience&quot; to get started!</p>
        </div>
      )}
    </div>
  );
}
