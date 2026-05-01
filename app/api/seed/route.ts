import dbConnect from '../../../lib/mongodb';
import Skill from '../../../models/Skill';
import Project from '../../../models/Project';
import Experience from '../../../models/Experience';
import BlogPost from '../../../models/BlogPost';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function POST() {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();

    // Seed skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'HTML', category: 'Web', order: 1 },
        { name: 'CSS', category: 'Web', order: 2 },
        { name: 'JavaScript', category: 'Web', order: 3 },
        { name: 'WordPress', category: 'Web', order: 4 },
        { name: 'Python', category: 'Programming', order: 5 },
        { name: 'SQL', category: 'Data', order: 6 },
        { name: 'SEO', category: 'Marketing', order: 7 },
        { name: 'Data Analytics', category: 'Data', order: 8 },
        { name: 'React', category: 'Web', order: 9 },
        { name: 'Next.js', category: 'Web', order: 10 },
        { name: 'Node.js', category: 'Web', order: 11 },
        { name: 'MongoDB', category: 'Data', order: 12 },
        { name: 'Microsoft Power BI', category: 'Data', order: 13 },
        { name: 'Pandas', category: 'Data', order: 14 },
      ]);
    }

    // Seed projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'Personal Portfolio Website',
          description: 'A modern, responsive portfolio website built with Next.js and React, featuring dark mode, blog system, and dynamic content management.',
          thumbnail: '/project-images/portfolio.webp',
          github: 'https://github.com/durgesh-kushwaha/main-portfolio',
          demo: 'https://www.durgesh.me/',
          technologies: ['Next.js', 'React', 'CSS', 'MongoDB'],
          order: 1,
        },
        {
          title: 'AI Mock Interviewer',
          description: 'An AI-powered mock interview platform that provides realistic interview practice with intelligent feedback and analysis.',
          thumbnail: '/project-images/interview.png',
          github: 'https://github.com/durgesh-kushwaha/ai-mock-interview',
          demo: 'https://ai.durgesh.me/',
          technologies: ['AI', 'React', 'Node.js'],
          order: 2,
        },
        {
          title: 'Job Listing Template',
          description: 'A clean, responsive job listing page with filtering and search capabilities.',
          thumbnail: '/project-images/listing.png',
          github: 'https://github.com/durgesh-kushwaha/job-listings-project',
          demo: 'https://durgeshlisting.netlify.app/',
          technologies: ['HTML', 'CSS', 'JavaScript'],
          order: 3,
        },
      ]);
    }

    // Seed experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        {
          company: 'A2IT (InternEdge)',
          role: 'Data Analytics Intern',
          duration: 'June 2026 – July 2026',
          description: 'Working on data analysis, data cleaning, visualization, and practical exposure to data-driven problem solving using industry-relevant tools.',
          type: 'work',
          order: 1,
        },
        {
          company: 'FirstHope (ENGACY Learning Pvt. Ltd.)',
          role: 'Website Handler',
          duration: 'Jan 2026 – Present',
          description: 'Managing website structure on WordPress, creating and updating pages, SEO optimization, fixing broken links, and performing regular audits for performance and consistency. Stipend: ₹5,000/month.',
          type: 'work',
          order: 2,
        },
        {
          company: 'ISTE CGC University Chapter',
          role: 'Core Team Member – Sponsorship Lead',
          duration: 'Sep 2025 – Present',
          description: 'Leading sponsorship efforts for the university technical society. Coordinated national-level hackathon "VaultHeist". Team management and team building across events.',
          type: 'leadership',
          order: 3,
        },
        {
          company: 'HACKOPS\'24',
          role: 'Participant',
          duration: '2024',
          description: 'Participated in a 24-hour national-level hackathon, building innovative solutions under pressure.',
          type: 'hackathon',
          order: 4,
        },
        {
          company: 'Hack-N-Win 2.0',
          role: 'Participant',
          duration: '2024',
          description: 'Participated in a 24-hour hackathon, collaborating with teams to solve real-world challenges.',
          type: 'hackathon',
          order: 5,
        },
      ]);
    }

    // Seed a blog post
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.create({
        title: 'My Journey into AI & Data Science',
        slug: 'my-journey-into-ai-data-science',
        content: `<h2>From Web Development to Data Science</h2><p>Hi! I'm Durgesh Kushwaha, a B.Tech student in AI & Data Science at CGC Jhanjeri. My tech journey started with building websites and learning SEO, but the world of data analytics and artificial intelligence captured my curiosity.</p><h3>Where It All Began</h3><p>I started with basic HTML, CSS, and JavaScript — building simple websites and learning how the web works. Working as a Website Handler at FirstHope gave me hands-on experience with WordPress, content management, and SEO optimization.</p><h3>The Transition</h3><p>As I dove deeper into my B.Tech curriculum, I discovered the power of data. Python, SQL, and tools like Power BI opened up a whole new world. Now, as a Data Analytics Intern at A2IT, I'm getting real-world exposure to data cleaning, visualization, and analysis.</p><h3>What's Next?</h3><p>I'm focused on building practical projects in machine learning and data analysis. The intersection of AI and real-world problem solving excites me the most. Stay tuned for more updates on my journey!</p>`,
        excerpt: 'From web development to data science — my journey as a B.Tech AI student, exploring data analytics, and building practical tech solutions.',
        tags: ['AI', 'Data Science', 'Journey', 'Career'],
        published: true,
      });
    }

    return jsonResponse({ message: 'Database seeded successfully!' });
  } catch (error) {
    return errorResponse('Seed failed: ' + (error as Error).message, 500);
  }
}
