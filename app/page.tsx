import Link from "next/link";
import Image from "next/image";
import TypewriterEffect from "../components/ui/TypewriterEffect";
import { FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { FiBookOpen, FiMapPin, FiBriefcase, FiGlobe, FiDownload, FiMail, FiPhone } from "react-icons/fi";
import GitHubStats from "../components/ui/GitHubStats";
import LeetCodeStats from "../components/ui/LeetCodeStats";
import ScrollReveal from "../components/ui/ScrollReveal";

async function fetchData(path: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${path}`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export default async function Home() {
  const [skills, projects, experiences, recentPosts] = await Promise.all([
    fetchData('/api/skills'), fetchData('/api/projects'),
    fetchData('/api/experiences'), fetchData('/api/blogs?limit=3'),
  ]);

  return (
    <div className="container">
      {/* HERO */}
      <section id="home" className="hero-section">
        <div className="hero-background"></div>
        <p className="section-label animate-in">Welcome to my portfolio</p>
        <h1 className="hero-title animate-in animate-delay-1">
          Hi, I&apos;m <span className="gradient-text">Durgesh Kushwaha</span>
        </h1>
        <p className="hero-subtitle animate-in animate-delay-2">I&apos;m a <TypewriterEffect /></p>
        <div className="hero-cta animate-in animate-delay-3">
          <a href="#contact" className="btn-primary">Get In Touch</a>
          <a href="/DURGESH RESUME.pdf" download className="btn-secondary">Download Resume</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">Get to know me</span>
            <h2 className="section-title">About Me</h2>
          </div>
        </ScrollReveal>
        <div className="about-container">
          <ScrollReveal animation="fadeRight">
            <div className="about-image-container">
              <Image src="/durgesh.webp" alt="Durgesh Kushwaha" width={280} height={280} className="about-image" />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fadeLeft" delay={200}>
            <div className="about-content">
              <h2>B.Tech AI & Data Science Student</h2>
              <p>I&apos;m Durgesh Kushwaha, a passionate B.Tech student in AI & Data Science at CGC Jhanjeri (IKGPTU). Currently working as a Data Analytics Intern at A2IT and Website Handler at FirstHope, bridging web technologies and data science.</p>
              <div className="about-details">
                <div className="about-detail"><span className="about-detail-icon"><FiBookOpen /></span> B.Tech AI & DS (2024–2028)</div>
                <div className="about-detail"><span className="about-detail-icon"><FiMapPin /></span> Gorakhpur, India</div>
                <div className="about-detail"><span className="about-detail-icon"><FiBriefcase /></span> Data Analytics Intern</div>
                <div className="about-detail"><span className="about-detail-icon"><FiGlobe /></span> Website Handler</div>
              </div>
              <a href="/DURGESH RESUME.pdf" download className="resume-button"><FiDownload /> Download Resume</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">What I work with</span>
            <h2 className="section-title">Technical Skills</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="scaleIn" className="stagger-children">
          <div className="skills-container">
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((s: { _id: string; name: string }) => <div key={s._id} className="skill-badge">{s.name}</div>)
            ) : (
              ['HTML','CSS','JavaScript','Python','SQL','React','Next.js','WordPress','SEO','Data Analytics','Power BI','MongoDB'].map(s =>
                <div key={s} className="skill-badge">{s}</div>
              )
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">My journey</span>
            <h2 className="section-title">Experience</h2>
          </div>
        </ScrollReveal>
        <div className="experience-timeline">
          {(Array.isArray(experiences) && experiences.length > 0 ? experiences : [
            { _id:'1', role:'Data Analytics Intern', company:'A2IT (InternEdge)', duration:'June 2026 – July 2026', description:'Data analysis, cleaning, visualization using industry tools.', type:'work' },
            { _id:'2', role:'Website Handler', company:'FirstHope (ENGACY Learning)', duration:'Jan 2026 – Present', description:'WordPress management, SEO optimization, site audits. Stipend: ₹5,000/month.', type:'work' },
            { _id:'3', role:'Core Team – Sponsorship Lead', company:'ISTE CGC University Chapter', duration:'Sep 2025 – Present', description:'Led sponsorship for national hackathon "VaultHeist". Team management.', type:'leadership' },
          ]).map((exp: { _id: string; role: string; company: string; duration: string; description: string; type: string }, i: number) => (
            <ScrollReveal key={exp._id} animation="fadeLeft" delay={i * 150}>
              <div className="exp-item">
                <div className={`exp-dot ${exp.type}`}></div>
                <div className="exp-card">
                  <div className="exp-header">
                    <div>
                      <div className="exp-role">{exp.role}</div>
                      <div className="exp-company">{exp.company}</div>
                      <div className="exp-duration">{exp.duration}</div>
                    </div>
                    <span className={`exp-type ${exp.type}`}>{exp.type}</span>
                  </div>
                  <p className="exp-desc">{exp.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CODING STATS */}
      <section id="coding-profiles" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">Coding Activity</span>
            <h2 className="section-title">Live Stats</h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="scaleIn">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:'1.5rem' }}>
            <GitHubStats username="durgesh-kushwaha" />
            <LeetCodeStats username="durgeshkushwaha" />
          </div>
        </ScrollReveal>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">What I&apos;ve built</span>
            <h2 className="section-title">Projects</h2>
          </div>
        </ScrollReveal>
        <div className="cards-container">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((p: { _id:string;title:string;description:string;thumbnail?:string;github?:string;demo?:string;technologies?:string[] }, i: number) => (
              <ScrollReveal key={p._id} animation="fadeUp" delay={i * 100}>
                <div className="card">
                  {p.thumbnail && <Image src={p.thumbnail} alt={p.title} width={400} height={200} className="project-thumbnail" />}
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="card-techs">{p.technologies.map((t:string)=><span key={t} className="card-tech">{t}</span>)}</div>
                    )}
                    <div className="project-button-wrapper">
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="project-button secondary">GitHub</a>}
                      {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="project-button">Live Demo</a>}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : <p style={{color:'var(--text-muted)',textAlign:'center',gridColumn:'1/-1'}}>Projects will appear once added via admin panel.</p>}
        </div>
      </section>

      {/* BLOG */}
      <section id="recent-posts" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">Latest articles</span>
            <h2 className="section-title">Blog</h2>
          </div>
        </ScrollReveal>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          {Array.isArray(recentPosts) && recentPosts.length > 0 ? (
            recentPosts.map((post:{_id:string;slug:string;title:string;excerpt:string;featuredImage?:string;createdAt:string}, i:number) => (
              <ScrollReveal key={post._id} animation="fadeRight" delay={i * 100}>
                <Link href={`/blogs/${post.slug}`} className="blog-post-card">
                  <div className="blog-post-card-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="date">{new Date(post.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                  </div>
                  {post.featuredImage && <Image src={post.featuredImage} alt={post.title} width={220} height={140} className="blog-post-card-image" />}
                </Link>
              </ScrollReveal>
            ))
          ) : <p style={{color:'var(--text-muted)',textAlign:'center'}}>Blog posts will appear once published.</p>}
        </div>
        {Array.isArray(recentPosts) && recentPosts.length > 0 && (
          <div style={{textAlign:'center'}}><Link href="/blogs" className="view-all-btn">View All Posts →</Link></div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <ScrollReveal animation="fadeUp">
          <div className="section-header">
            <span className="section-label">Let&apos;s connect</span>
            <h2 className="section-title">Get In Touch</h2>
          </div>
        </ScrollReveal>
        <div className="contact-container">
          <ScrollReveal animation="fadeRight">
            <div className="social-links">
              <h3>Open to Opportunities</h3>
              <p>Whether you&apos;re a recruiter, fellow developer, or someone with an exciting project — I&apos;d love to hear from you. Open to internships, freelance, and collaboration.</p>
              <div className="social-icons-wrapper">
                <a href="https://www.linkedin.com/in/durgesh-kushwaha" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn"><FaLinkedin /></a>
                <a href="https://github.com/durgesh-kushwaha" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub"><FaGithub /></a>
                <a href="https://leetcode.com/durgeshkushwaha" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LeetCode"><SiLeetcode /></a>
                <a href="https://wa.me/7706820906" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp"><FaWhatsapp /></a>
                <a href="mailto:durgeshcgc@gmail.com" className="social-icon" aria-label="Email"><FaEnvelope /></a>
              </div>
              <div className="contact-details">
                <a href="mailto:durgeshcgc@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><FiMail /> durgeshcgc@gmail.com</a>
                <a href="https://wa.me/7706820906" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><FiPhone /> +91 7706820906</a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fadeLeft" delay={200}>
            <form action="https://formspree.io/f/xblarykl" method="POST" className="contact-form">
              <div className="form-group"><label htmlFor="name">Your Name</label><input id="name" type="text" name="name" className="form-input" placeholder="John Doe" required /></div>
              <div className="form-group"><label htmlFor="email">Your Email</label><input id="email" type="email" name="email" className="form-input" placeholder="john@company.com" required /></div>
              <div className="form-group"><label htmlFor="company">Company (Optional)</label><input id="company" type="text" name="company" className="form-input" placeholder="Company name" /></div>
              <div className="form-group"><label htmlFor="message">Your Message</label><textarea id="message" name="message" className="form-textarea" placeholder="Tell me about the opportunity..." required></textarea></div>
              <button type="submit" className="form-submit-btn">Send Message →</button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
