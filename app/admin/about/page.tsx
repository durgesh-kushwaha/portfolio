'use client';

import { useEffect, useState } from 'react';
import { FiSave, FiCheck } from 'react-icons/fi';

interface AboutData {
  title: string;
  description: string;
  location: string;
  education: string;
  college: string;
  currentRole: string;
  currentCompany: string;
  githubUsername: string;
  leetcodeUsername: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  resumeUrl: string;
}

const defaultAbout: AboutData = {
  title: '', description: '', location: '', education: '', college: '',
  currentRole: '', currentCompany: '', githubUsername: '', leetcodeUsername: '',
  linkedinUrl: '', email: '', phone: '', resumeUrl: '',
};

export default function AdminAbout() {
  const [data, setData] = useState<AboutData>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(d => {
      setData({ ...defaultAbout, ...d });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof AboutData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  const fields: { label: string; key: keyof AboutData; type?: string; rows?: number }[] = [
    { label: 'Title / Headline', key: 'title' },
    { label: 'About Description', key: 'description', type: 'textarea', rows: 4 },
    { label: 'Location', key: 'location' },
    { label: 'Education', key: 'education' },
    { label: 'College', key: 'college' },
    { label: 'Current Role', key: 'currentRole' },
    { label: 'Current Company', key: 'currentCompany' },
    { label: 'GitHub Username', key: 'githubUsername' },
    { label: 'LeetCode Username', key: 'leetcodeUsername' },
    { label: 'LinkedIn URL', key: 'linkedinUrl' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Resume URL', key: 'resumeUrl' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1>About Me</h1>
          <p>Manage your personal information displayed on the portfolio.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary" style={{ gap: '.4rem' }}>
          {saving ? <span className="admin-spinner"></span> : saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
        </button>
      </div>

      <div className="admin-about-form">
        <div className="admin-form">
          {fields.map(f => (
            <div key={f.key} className="admin-form-group">
              <label>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  className="admin-textarea"
                  rows={f.rows || 3}
                  value={data[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              ) : (
                <input
                  className="admin-input"
                  type="text"
                  value={data[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
