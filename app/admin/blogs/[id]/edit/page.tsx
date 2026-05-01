'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '../../../../../components/admin/BlogEditor';
import Image from 'next/image';

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (data.title) {
        setTitle(data.title);
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setFeaturedImage(data.featuredImage || '');
        setTags(data.tags || []);
        setPublished(data.published || false);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog-featured');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setFeaturedImage(data.url);
    setUploading(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content, featuredImage, tags, published }),
      });
      if (res.ok) {
        router.push('/admin/blogs');
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Edit Post</h1>
        <div className="admin-header-actions">
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-blog-editor-layout">
        <div className="admin-blog-editor-main">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="admin-blog-title-input"
          />
          {content !== '' && <BlogEditor content={content} onChange={setContent} />}
        </div>

        <div className="admin-blog-editor-sidebar">
          <div className="admin-sidebar-card">
            <h3>Featured Image</h3>
            <div className="admin-upload-area">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <span className="admin-spinner"></span>}
              {featuredImage && (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <Image src={featuredImage} alt="Featured" width={300} height={180} style={{ borderRadius: 8, objectFit: 'cover', width: '100%' }} />
                  <button className="admin-remove-img" onClick={() => setFeaturedImage('')}>×</button>
                </div>
              )}
            </div>
          </div>

          <div className="admin-sidebar-card">
            <h3>Excerpt</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short description..."
              className="admin-textarea"
              rows={3}
            />
          </div>

          <div className="admin-sidebar-card">
            <h3>Tags</h3>
            <div className="admin-tags-input">
              <input
                className="admin-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                placeholder="Add tag..."
              />
              <div className="admin-tags-list">
                {tags.map((t) => (
                  <span key={t} className="admin-tag">
                    {t} <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-sidebar-card">
            <h3>Publish Status</h3>
            <label className="admin-toggle-label">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span>{published ? 'Published' : 'Draft'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
