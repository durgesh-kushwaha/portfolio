"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => { if (window.innerWidth > 768) setIsOpen(false); };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', handleResize); };
  }, []);

  const closeMenu = () => setIsOpen(false);
  const links = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#skills", label: "Skills" },
    { href: "/#experience", label: "Experience" },
    { href: "/#projects", label: "Projects" },
    { href: "/blogs", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="navbar" style={scrolled ? { borderBottomColor: 'rgba(99,102,241,.2)' } : {}}>
        <Link href="/" className="navbar-logo" onClick={closeMenu}>DK</Link>
        <div className="navbar-links">
          {links.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          <ThemeSwitcher />
        </div>
        <div className="mobile-nav-header">
          <ThemeSwitcher />
          <button onClick={() => setIsOpen(!isOpen)} className="mobile-nav-toggle" aria-label="Menu">
            <FaBars />
          </button>
        </div>
      </nav>
      <div className={`mobile-nav-menu ${isOpen ? "open" : ""}`}>
        <button onClick={() => setIsOpen(false)} className="mobile-nav-toggle" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} aria-label="Close">
          <FaTimes />
        </button>
        {links.map(l => <Link key={l.href} href={l.href} onClick={closeMenu}>{l.label}</Link>)}
      </div>
    </>
  );
};

export default Navbar;