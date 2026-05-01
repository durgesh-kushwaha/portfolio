'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';

interface Post {
  title: string;
  content: string;
  featuredImage?: string;
  createdAt: string;
  tags: string[];
  excerpt: string;
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/blogs/${params.slug}`)
        .then(r => r.json())
        .then(d => { if (d.title) setPost(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading) return (
    <div className="container section" style={{ paddingTop: '6rem', textAlign: 'center' }}>
      <div className="admin-spinner-lg" style={{ margin: '0 auto' }}></div>
    </div>
  );

  if (!post) return (
    <div className="container section" style={{ paddingTop: '6rem', textAlign: 'center' }}>
      <h1 className="section-title">Post Not Found</h1>
      <Link href="/blogs" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>← Back to Blog</Link>
    </div>
  );

  return (
    <div className="container section" style={{ paddingTop: '6rem' }}>
      <div className="blog-layout-container">
        <main className="blog-post-main">
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-date">
            {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          {post.featuredImage && (
            <div style={{ marginBottom: '2rem' }}>
              <Image src={post.featuredImage} alt={post.title} width={800} height={400} style={{ borderRadius: '15px', objectFit: 'cover', width: '100%' }} />
            </div>
          )}
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.tags?.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(t => <span key={t} className="card-tech">{t}</span>)}
            </div>
          )}
        </main>
        <div className="blog-sidebar">
          <div className="author-card">
            <Image src="/durgesh.webp" alt="Durgesh" width={80} height={80} className="author-image" />
            <h4>Durgesh Kushwaha</h4>
            <p>AI & Data Science Student</p>
            <div className="social-icons-wrapper">
              <a href="https://linkedin.com/in/durgesh-kushwaha" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: 36, height: 36, fontSize: '1.1rem' }}><FaLinkedin /></a>
              <a href="https://github.com/durgesh-kushwaha" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: 36, height: 36, fontSize: '1.1rem' }}><FaGithub /></a>
            </div>
            <a href="mailto:durgeshcgc@gmail.com" className="author-email">durgeshcgc@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}