'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: string;
  tags: string[];
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async (q = '') => {
    setLoading(true);
    const url = q ? `/api/blogs?search=${encodeURIComponent(q)}` : '/api/blogs';
    const res = await fetch(url);
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(search);
  };

  return (
    <div className="container section" style={{ paddingTop: '6rem' }}>
      <div className="section-header">
        <span className="section-label">Knowledge sharing</span>
        <h1 className="section-title">All Blog Posts</h1>
      </div>

      <form onSubmit={handleSearch} className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="admin-spinner-lg" style={{ margin: '0 auto' }}></div></div>
      ) : (
        <div className="all-posts-container">
          {posts.map((post) => (
            <Link key={post._id} href={`/blogs/${post.slug}`} className="card" style={{ textDecoration: 'none' }}>
              {post.featuredImage && (
                <Image src={post.featuredImage} alt={post.title} width={400} height={200} className="project-thumbnail" />
              )}
              <div className="card-body">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="card-techs">
                    {post.tags.map((t) => <span key={t} className="card-tech">{t}</span>)}
                  </div>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No posts found.</p>
        </div>
      )}
    </div>
  );
}