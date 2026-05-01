'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  tags: string[];
}

export default function AdminBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/blogs?all=true');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/blogs/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner-lg"></div></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Blog Posts</h1>
        <Link href="/admin/blogs/new" className="admin-btn admin-btn-primary">
          ✍️ Write New Post
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>
                  <div className="admin-table-title">
                    <strong>{post.title}</strong>
                    <span className="admin-table-excerpt">{post.excerpt?.slice(0, 80)}...</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => togglePublish(post)}
                    className={`admin-status-badge ${post.published ? 'published' : 'draft'}`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div className="admin-tags-list">
                    {post.tags?.slice(0, 3).map((t) => <span key={t} className="admin-tag-sm">{t}</span>)}
                  </div>
                </td>
                <td className="admin-table-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/blogs/${post._id}/edit`} className="admin-btn admin-btn-sm">
                      Edit
                    </Link>
                    <Link href={`/blogs/${post.slug}`} target="_blank" className="admin-btn admin-btn-sm admin-btn-ghost">
                      View
                    </Link>
                    <button onClick={() => handleDelete(post._id)} className="admin-btn admin-btn-sm admin-btn-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="admin-empty-state">
          <h3>No blog posts yet</h3>
          <p>Start writing your first blog post!</p>
          <Link href="/admin/blogs/new" className="admin-btn admin-btn-primary">
            ✍️ Write New Post
          </Link>
        </div>
      )}
    </div>
  );
}
