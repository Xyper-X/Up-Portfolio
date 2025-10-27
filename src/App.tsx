import React, { useEffect, useState } from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Shield,
  Medal,
  Lock,
  BookOpen,
  Trophy,
  Mail,
  Terminal,
  Network,
  Bug,
  Scan,
  Sliders as Spider,
  ShieldAlert,
  Code,
  Terminal as Terminal2,
  Target,
  Award,
  FileDown,
  Download,
  Phone,
  MapPin,
  Send
} from 'lucide-react';
import { submitContactMessage } from './lib/supabase';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isDownloading, setIsDownloading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });

      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight / 2) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    window.location.href = '/path-to-your-resume.pdf';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactMessage(formData);
      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully! I will get back to you soon.');
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { name: 'about', icon: Shield },
    { name: 'leaderboard', icon: Trophy },
    { name: 'skills', icon: Terminal },
    { name: 'certificates', icon: Medal },
    { name: 'projects', icon: Lock },
    { name: 'blog', icon: BookOpen },
    { name: 'achievements', icon: Award },
    { name: 'resume', icon: FileDown },
    { name: 'contact', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-red-900 fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-red-600 animate-float" />
              <span className="text-xl font-bold animate-gradient-text">Sibin</span>
            </div>
            <div className="hidden md:block">
              <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={`#${item.name}`}
                    className={`
                      py-2 px-3 rounded-md transition-all duration-300 flex items-center gap-2
                      ${activeSection === item.name
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-500/5'}
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="capitalize">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-24">
        <section id="about" className="flex flex-col items-center text-center py-16 reveal">
          <div className="relative w-48 h-48 mb-6 group animate-float">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="Profile"
              className="rounded-full w-full h-full object-cover border-4 border-red-600 transition-transform duration-300 group-hover:scale-105 animate-glow"
            />
            <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-full animate-pulse">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-gradient-text">Sibin C</h1>
          <h2 className="text-2xl text-red-500 mb-6 slide-in">Penetration Tester</h2>

          <div className="mb-8 reveal">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Network, name: 'Nmap', color: 'text-blue-500' },
                { icon: Scan, name: 'Wireshark', color: 'text-cyan-500' },
                { icon: Bug, name: 'Metasploit', color: 'text-red-500' },
                { icon: ShieldAlert, name: 'Nessus', color: 'text-green-500' },
                { icon: Spider, name: 'Burpsuite', color: 'text-orange-500' },
                { icon: Shield, name: 'OWASP', color: 'text-purple-500' },
                { icon: Code, name: 'Python', color: 'text-yellow-500' },
                { icon: Terminal2, name: 'Bash', color: 'text-gray-300' }
              ].map((skill, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group transform hover:scale-110 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-3 rounded-lg bg-gray-800 mb-2 group-hover:bg-gray-700 transition-colors duration-300 ${skill.color} animate-float`}>
                    <skill.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mb-8 reveal">
            {[
              { icon: Github, href: 'https://github.com' },
              { icon: Linkedin, href: 'https://linkedin.com' },
              { icon: Twitter, href: 'https://twitter.com' },
              { icon: Mail, href: 'mailto:contact@johndoe.com' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors duration-300 transform hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">About Me</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl reveal">
            Dedicated cybersecurity professional with expertise in penetration testing,
            incident response, and security architecture. Committed to protecting
            digital assets and infrastructure through innovative security solutions.
          </p>
        </section>

        <section id="leaderboard" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Platform Rankings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
              <div className="flex items-center gap-4 mb-6">
                <Award className="w-8 h-8 text-red-500 animate-pulse" />
                <h3 className="text-2xl font-bold text-white">TryHackMe</h3>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src="https://tryhackme-badges.s3.amazonaws.com/SIBIN.png"
                  alt="TryHackMe Badge"
                  className="w-full max-w-md rounded-lg shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                />
                <div className="w-full grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-red-900/20 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Rank</div>
                    <div className="text-xl font-bold text-red-500">#2,345</div>
                  </div>
                  <div className="bg-red-900/20 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Points</div>
                    <div className="text-xl font-bold text-red-500">8,765</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg border border-green-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20">
              <div className="flex items-center gap-4 mb-6">
                <Target className="w-8 h-8 text-green-500 animate-pulse" />
                <h3 className="text-2xl font-bold text-white">HackTheBox</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Global Rank</div>
                  <div className="text-xl font-bold text-green-500">#1,234</div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Points</div>
                  <div className="text-xl font-bold text-green-500">12,345</div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Machines Owned</div>
                  <div className="text-xl font-bold text-green-500">75</div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Challenges</div>
                  <div className="text-xl font-bold text-green-500">50</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 reveal">
              <h3 className="text-2xl font-semibold text-white mb-6">Security Tools</h3>
              {[
                { name: 'Nmap', level: 95 },
                { name: 'Wireshark', level: 90 },
                { name: 'Metasploit', level: 85 },
                { name: 'Nessus', level: 88 },
                { name: 'Burpsuite', level: 92 },
                { name: 'OWASP ZAP', level: 85 }
              ].map((skill, index) => (
                <div key={index} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-red-500">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden skill-bar">
                    <div
                      className="h-full bg-red-600 rounded-full animate-progress"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6 reveal">
              <h3 className="text-2xl font-semibold text-white mb-6">Programming & Scripting</h3>
              {[
                { name: 'Python', level: 88 },
                { name: 'Bash Scripting', level: 85 },
                { name: 'SQL', level: 80 },
                { name: 'JavaScript', level: 75 },
                { name: 'PowerShell', level: 82 }
              ].map((skill, index) => (
                <div key={index} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-red-500">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden skill-bar">
                    <div
                      className="h-full bg-red-600 rounded-full animate-progress"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Professional Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Certified Ethical Hacker (CEH)', date: '2023', description: 'EC-Council Certification for ethical hacking and penetration testing' },
              { name: 'CompTIA Security+', date: '2022', description: 'Foundation level security certification covering network security concepts' },
              { name: 'CISSP', date: '2023', description: 'Advanced certification in information security management' },
              { name: 'OSCP', date: '2021', description: 'Offensive Security Certified Professional - Hands-on penetration testing' }
            ].map((cert, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Medal className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-red-400 mb-2">{cert.date}</p>
                <p className="text-gray-400">{cert.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Security Projects</h2>
          <div className="space-y-8">
            {[
              {
                title: 'Security Audit Tool',
                description: 'Automated security assessment platform for enterprise systems',
                tech: ['Python', 'Docker', 'REST API'],
                details: 'Developed a comprehensive security audit tool that automatically scans and reports vulnerabilities in enterprise infrastructure.'
              },
              {
                title: 'Threat Detection System',
                description: 'ML-based system for identifying potential security threats',
                tech: ['TensorFlow', 'Python', 'Elasticsearch'],
                details: 'Created an advanced threat detection system using machine learning to identify and alert on potential security breaches in real-time.'
              }
            ].map((project, index) => (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-lg border border-red-600 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Lock className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <p className="text-gray-400 mb-6">{project.details}</p>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="bg-red-900 text-red-200 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="blog" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Security Insights</h2>
          <div className="space-y-8">
            {[
              {
                title: 'Zero-Day Vulnerabilities: A Deep Dive',
                date: 'March 15, 2024',
                preview: 'Understanding the impact of zero-day exploits on modern security infrastructure and how to prepare for them.',
                readTime: '8 min read',
                tags: ['Security', 'Research', 'Vulnerabilities']
              },
              {
                title: 'Securing Cloud Infrastructure',
                date: 'March 1, 2024',
                preview: 'Best practices for implementing robust security measures in cloud environments.',
                readTime: '6 min read',
                tags: ['Cloud', 'Infrastructure', 'Best Practices']
              }
            ].map((post, index) => (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-lg border border-red-600 transform hover:-translate-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BookOpen className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <p className="text-gray-300 mb-6">{post.preview}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="achievements" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Professional Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Critical Vulnerability Discovery',
                description: 'Discovered and reported 5 critical vulnerabilities in major enterprise systems',
                impact: 'Prevented potential data breaches affecting millions of users'
              },
              {
                title: 'Security Leadership',
                description: 'Led security implementation for Fortune 500 company',
                impact: 'Reduced security incidents by 75% within first year'
              },
              {
                title: 'Industry Recognition',
                description: 'Speaker at BlackHat 2023',
                impact: 'Presented research on advanced persistent threats to over 1000 security professionals'
              },
              {
                title: 'Research Publication',
                description: 'Published research on advanced persistent threats',
                impact: 'Featured in leading cybersecurity journals and conferences'
              }
            ].map((achievement, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Trophy className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-300 mb-2">{achievement.description}</p>
                <p className="text-red-400 italic">{achievement.impact}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="resume" className="py-16 scroll-mt-20 reveal">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-900/20 via-red-600/20 to-red-900/20 p-1 rounded-xl">
              <div className="bg-gray-900 p-8 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 transform rotate-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <FileDown className="w-8 h-8 text-red-500 animate-bounce" />
                      <h2 className="text-3xl font-bold animate-gradient-text">Download Resume</h2>
                    </div>
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                        transform transition-all duration-300
                        ${isDownloading
                          ? 'bg-gray-700 text-gray-300 cursor-wait'
                          : 'bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50'
                        }
                      `}
                    >
                      {isDownloading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Professional Summary</h3>
                      <p className="text-gray-400">Comprehensive overview of skills, experience, and achievements</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Technical Skills</h3>
                      <p className="text-gray-400">Detailed breakdown of technical expertise and certifications</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Project Portfolio</h3>
                      <p className="text-gray-400">Showcase of key projects and professional achievements</p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-red-900/20 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      <span className="text-red-400">Note:</span> The resume includes detailed information about my professional experience, technical skills, certifications, and notable achievements in cybersecurity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 scroll-mt-20 reveal">
          <h2 className="text-3xl font-bold text-red-500 mb-12 text-center animate-gradient-text">Contact Me</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-600/20 rounded-lg">
                      <Mail className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                      <a href="mailto:sibin@cybersecurity.com" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                        sibin@cybersecurity.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-600/20 rounded-lg">
                      <Phone className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
                      <a href="tel:+1234567890" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-red-600 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-600/20 rounded-lg">
                      <MapPin className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                      <p className="text-gray-400">
                        San Francisco, CA<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 p-8 rounded-lg border border-red-600">
                  <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white transition-colors duration-300"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white transition-colors duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white transition-colors duration-300 resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
                        transform transition-all duration-300
                        ${isSubmitting
                          ? 'bg-gray-700 text-gray-300 cursor-wait'
                          : 'bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50'
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 p-4 bg-red-900/20 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      <span className="text-red-400">Response Time:</span> I typically respond within 24-48 hours. For urgent security matters, please use the phone contact above.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-900/20 via-red-600/20 to-red-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Connect on Social</h3>
                  <div className="flex gap-4">
                    {[
                      { icon: Github, href: 'https://github.com', label: 'GitHub' },
                      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-900 rounded-lg border border-red-600 text-gray-400 hover:text-red-500 hover:bg-red-600/10 transition-all duration-300 transform hover:scale-110"
                        aria-label={social.label}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-red-900 mb-8 reveal">
          <p className="text-gray-400 text-center">&copy; 2024 Cybersecurity Portfolio</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
