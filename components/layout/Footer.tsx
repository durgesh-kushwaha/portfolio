import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Durgesh Kushwaha. Built with Next.js & MongoDB.</p>
      <div style={{ marginTop: '.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '.85rem' }}>
        <Link href="/#about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</Link>
        <Link href="/blogs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
        <Link href="/#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link>
        <Link href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', opacity: 0.5 }}>Admin</Link>
      </div>
    </footer>
  );
};

export default Footer;