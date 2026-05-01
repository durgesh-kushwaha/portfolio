import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: 'B.Tech AI & Data Science Student' },
  description: { type: String, default: '' },
  location: { type: String, default: 'Gorakhpur, India' },
  education: { type: String, default: 'B.Tech AI & DS (2024–2028)' },
  college: { type: String, default: 'CGC Jhanjeri (IKGPTU)' },
  currentRole: { type: String, default: 'Data Analytics Intern' },
  currentCompany: { type: String, default: 'A2IT (InternEdge)' },
  githubUsername: { type: String, default: 'durgesh-kushwaha' },
  leetcodeUsername: { type: String, default: 'durgeshkushwaha' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/durgesh-kushwaha' },
  email: { type: String, default: 'durgeshcgc@gmail.com' },
  phone: { type: String, default: '7706820906' },
  resumeUrl: { type: String, default: '/DURGESH RESUME.pdf' },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model('About', aboutSchema);
