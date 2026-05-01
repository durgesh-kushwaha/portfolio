'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  github?: string;
  demo?: string;
  technologies: string[];
  order: number;
}

const emptyProject = { title: '', description: '', thumbnail: '', github: '', demo: '', technologies: [] as string[], order: 0 };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'projects');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setForm((prev) => ({ ...prev, thumbnail: data.url }));
    setUploading(false);
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/projects/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: projects.length }),
      });
    }
    resetForm();
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    setForm({ title: project.title, description: project.description, thumbnail: project.thumbnail || '', github: project.github || '', demo: project.demo || '', technologies: project.technologies || [], order: project.order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const resetForm = () => {
    setForm(emptyProject);
    setEditingId(null);
    setShowForm(false);
    setTechInput('');
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Manage Projects</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn admin-btn-primary">
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => resetForm()}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label>Title</label>
                <input className="admin-input" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>GitHub URL</label>
                  <input className="admin-input" value={form.github} onChange={(e) => setForm({...form, github: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Demo URL</label>
                  <input className="admin-input" value={form.demo} onChange={(e) => setForm({...form, demo: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Thumbnail</label>
                <div className="admin-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {uploading && <span className="admin-spinner"></span>}
                  {form.thumbnail && <Image src={form.thumbnail} alt="Thumbnail" width={200} height={120} style={{ borderRadius: 8, objectFit: 'cover', marginTop: 8 }} />}
                </div>
              </div>
              <div className="admin-form-group">
                <label>Technologies</label>
                <div className="admin-tags-input">
                  <input className="admin-input" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); }}} placeholder="Type and press Enter" />
                  <div className="admin-tags-list">
                    {form.technologies.map((t) => (
                      <span key={t} className="admin-tag">{t} <button type="button" onClick={() => removeTech(t)}>×</button></span>
                    ))}
                  </div>
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

      <div className="admin-cards-grid">
        {projects.map((project) => (
          <div key={project._id} className="admin-card">
            {project.thumbnail && <Image src={project.thumbnail} alt={project.title} width={400} height={200} className="admin-card-img" />}
            <div className="admin-card-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.technologies?.length > 0 && (
                <div className="admin-tags-list">
                  {project.technologies.map((t) => <span key={t} className="admin-tag-sm">{t}</span>)}
                </div>
              )}
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(project)} className="admin-btn admin-btn-sm">Edit</button>
                <button onClick={() => handleDelete(project._id)} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="admin-empty-state">
          <p>No projects yet. Click &quot;Add Project&quot; to get started!</p>
        </div>
      )}
    </div>
  );
}
