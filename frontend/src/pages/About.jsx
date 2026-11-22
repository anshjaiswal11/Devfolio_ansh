import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { aboutApi, achievementsApi } from '../services/api'

const DEFAULT_ABOUT = {
  name: 'Ansh Jaiswal',
  tagline: 'Full Stack Developer (SDE-I) | Java, Spring Boot, Node.js, React, TypeScript, REST APIs',
  location: 'Punjab, India',
  phone: '+91 8707559685',
  email: 'anshjaiswal1804@gmail.com',
  bio: `Full Stack Developer (B.Tech CSE, 2027) with hands-on experience building scalable backend services and REST APIs using Java/Spring Boot and Node.js/TypeScript, and user-facing features with React, JavaScript and TypeScript.

Strong fundamentals in data structures, algorithms, object-oriented programming and problem-solving, with working knowledge of relational databases (PostgreSQL, MySQL) including writing queries and designing database schemas.

Takes end-to-end feature ownership across requirements, development, testing, deployment and monitoring; writes clean, maintainable code, debugs issues and collaborates with product, design and operations teams. Eager to adopt AI-first development tools such as Cursor and GitHub Copilot. Top 5 of 3,000+ in a national Code-a-thon.`,
  socialLinks: {
    github: 'https://github.com/anshjaiswal11',
    linkedin: 'https://linkedin.com/in/anshjais',
    website: 'https://citewise.xyz',
  },
  skillCategories: [
    {
      category: 'Languages',
      skills: ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'C++']
    },
    {
      category: 'Backend',
      skills: ['Spring Boot', 'Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'Backend Services', 'Scalable Architecture', 'JWT Authentication', 'WebSockets']
    },
    {
      category: 'Frontend',
      skills: ['React JS', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3']
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL', 'MySQL (Relational, Schema Design, Queries)', 'MongoDB', 'Redis']
    },
    {
      category: 'Fundamentals',
      skills: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Problem Solving', 'System Design']
    },
    {
      category: 'Tools & Cloud',
      skills: ['Git', 'GitHub', 'Docker', 'AWS', 'CI/CD', 'Postman', 'JUnit', 'Unit Testing', 'Debugging', 'Production Monitoring', 'Cursor / Copilot']
    }
  ],
  experience: [
    {
      role: 'Software Developer',
      company: 'AetherNova (Freelance Software Development)',
      period: 'Jan 2026 – Present',
      desc: 'Full Stack / MERN Development for Healthcare, E-commerce and Service Clients:\n• Designed, developed and maintained scalable backend services and REST APIs with Node.js, Express.js and MongoDB, with React and TypeScript front ends, shipping 5+ full stack applications for clients.\n• Took end-to-end ownership of features across requirement understanding, development, testing, deployment and production monitoring, working closely with clients, designers and operations teams.\n• Built workflow automation and Email, SMS and WhatsApp Cloud API integrations, cutting response latency by 50% and client operational overhead by 40%.\n• Built secure admin dashboards and internal tools with role-based access control (RBAC); debugged issues and improved application performance and system reliability.'
    }
  ],
  education: [
    {
      degree: 'B.Tech, Computer Science & Engineering',
      school: 'Lovely Professional University, Punjab',
      year: 'Aug 2023 – Aug 2027',
      note: 'SDE-I Aspirant'
    },
    {
      degree: 'Class XII (Intermediate)',
      school: 'Shri Ram Public School, Basti, UP',
      year: 'Apr 2022 – May 2023',
      note: 'Science / PCM'
    }
  ],
  achievements: [
    {
      _id: 'ach-1',
      title: 'Top 5 of 3,000+ Participants — Code-a-thon',
      issuer: 'National Code-a-thon Hackathon',
      date: 'Jan 2025',
      description: 'Secured top 5 position out of 3,000+ developers nationwide demonstrating algorithmic problem solving and rapid prototype development.'
    },
    {
      _id: 'ach-2',
      title: 'Top-ranked LeetCode Contest Finish',
      issuer: 'LeetCode',
      date: 'Dec 2025',
      description: 'Achieved top percentiles in competitive weekly LeetCode programming contests focusing on advanced data structures and dynamic programming.'
    },
    {
      _id: 'ach-3',
      title: 'Backend Development Certification',
      issuer: 'Physics Wallah',
      date: 'Nov 2025',
      description: 'Rigorous backend training covering scalable architecture, microservices, databases, authentication, and API security.'
    },
    {
      _id: 'ach-4',
      title: 'Full Stack Web Dev Certification',
      issuer: 'Physics Wallah',
      date: 'Oct 2025',
      description: 'Comprehensive mastery of modern frontend and backend development with production deployment best practices.'
    },
    {
      _id: 'ach-5',
      title: 'Oracle OCI 2023 Foundations Associate',
      issuer: 'Oracle Cloud Infrastructure',
      date: 'Jul 2024',
      description: 'Certified in cloud computing fundamentals, compute, storage, networking, identity, and cloud security architecture.'
    }
  ]
}

export default function About() {
  const [about, setAbout] = useState(() => {
    try {
      const cached = localStorage.getItem('devfolio_about_cache')
      if (cached) return { ...DEFAULT_ABOUT, ...JSON.parse(cached) }
    } catch {}
    return DEFAULT_ABOUT
  })
  const [achievements, setAchievements] = useState(() => about.achievements || DEFAULT_ABOUT.achievements)

  useEffect(() => {
    // Background revalidation (stale-while-revalidate)
    Promise.all([
      aboutApi.get().catch(() => null),
      achievementsApi.getAll().catch(() => null)
    ]).then(([aboutRes, achRes]) => {
      if (aboutRes?.data?.about) {
        const fetched = aboutRes.data.about
        setAbout(prev => {
          const merged = {
            ...prev,
            ...fetched,
            // Keep rich resume bio and experience if DB has empty string
            bio: fetched.bio || prev.bio,
            experience: (fetched.experience && fetched.experience.length > 0) ? fetched.experience : prev.experience,
            education: (fetched.education && fetched.education.length > 0) ? fetched.education : prev.education,
            socialLinks: { ...prev.socialLinks, ...(fetched.socialLinks || {}) },
          }
          try { localStorage.setItem('devfolio_about_cache', JSON.stringify(merged)) } catch {}
          return merged
        })
      }
      if (achRes?.data?.achievements && achRes.data.achievements.length > 0) {
        setAchievements(achRes.data.achievements)
      }
    })
  }, [])

  const social = about?.socialLinks || DEFAULT_ABOUT.socialLinks
  const experience = about?.experience || DEFAULT_ABOUT.experience
  const education = about?.education || DEFAULT_ABOUT.education

  return (
    <div className="min-h-screen pt-24 pb-24 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto px-6 relative z-10"
      >
        {/* Header */}
        <div className="mb-14">
          <span className="badge mb-4">ENGINEERING PROFILE</span>
          <h1 className="heading-hero text-4xl md:text-6xl mb-3">
            About <span className="text-muted">Ansh Jaiswal</span>
          </h1>
          <p className="text-muted text-base max-w-2xl">
            Full Stack Developer specializing in Java/Spring Boot, Node.js, and modern React architectures.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Sidebar: Profile Card */}
          <div className="md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-24 space-y-4"
            >
              <div className="card-bento p-6 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10 flex items-center justify-center shadow-xl">
                  {about?.profileImage ? (
                    <img src={about.profileImage} alt={about.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="font-mono text-3xl font-extrabold text-white tracking-wider">
                      AJ
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-white tracking-tight mb-1">{about?.name}</h2>
                <p className="text-muted text-xs leading-relaxed mb-4">{about?.tagline}</p>
                
                {/* Location & Contact info */}
                <div className="w-full space-y-2 py-3 border-y border-border/50 text-left text-xs font-mono text-muted">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{about.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <a href={`mailto:${about.email || 'anshjaiswal1804@gmail.com'}`} className="hover:text-white truncate">
                      {about.email || 'anshjaiswal1804@gmail.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span>{about.phone || '+91 8707559685'}</span>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex gap-2 w-full justify-center my-4">
                  {social.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                      GitHub
                    </a>
                  )}
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                      LinkedIn
                    </a>
                  )}
                  {social.website && (
                    <a href={social.website} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                      CiteWise
                    </a>
                  )}
                </div>

                <div className="w-full">
                  <a href="/contact" className="btn-primary w-full py-2.5 text-xs justify-center">
                    Get in Touch
                  </a>
                </div>
              </div>

              {/* Quick stats badge card */}
              <div className="card-bento p-5 border border-white/5 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted">Key Highlights</div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                  <span className="text-white/70">LeetCode & DSA</span>
                  <span className="text-emerald-400 font-mono font-semibold">Active Contestant</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                  <span className="text-white/70">National Hackathon</span>
                  <span className="text-accent font-mono font-semibold">Top 5 / 3k+</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-white/70">Client Apps Shipped</span>
                  <span className="text-white font-mono font-semibold">5+ Full Stack</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="md:col-span-2 space-y-16">
            
            {/* Bio / Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Summary</h3>
              <div className="space-y-4 text-muted text-[15px] leading-relaxed">
                {(about?.bio || DEFAULT_ABOUT.bio).split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>

            {/* Technical Skills Categorized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="section-label mb-6 block">Technical Arsenal</h3>
              <div className="space-y-5">
                {DEFAULT_ABOUT.skillCategories.map(cat => (
                  <div key={cat.category} className="card-bento p-4 border border-white/5">
                    <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2.5 font-semibold">
                      {cat.category}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 rounded-lg text-xs font-medium transition-colors">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Experience Timeline */}
            {experience.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="section-label mb-8 block">Experience</h3>
                <div className="space-y-8">
                  {experience.map((exp, i) => (
                    <div key={i} className="group relative pl-8 border-l border-border/50 hover:border-white/30 transition-colors">
                      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-void transition-colors" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                        <h4 className="font-bold text-white text-base">{exp.role}</h4>
                        <span className="font-mono text-xs text-accent">{exp.period}</span>
                      </div>
                      <p className="text-white/70 text-sm font-semibold mb-3">{exp.company}</p>
                      <div className="text-muted text-sm leading-relaxed whitespace-pre-line space-y-1">
                        {exp.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="section-label mb-8 block">Education</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {education.map((edu, i) => (
                    <div key={i} className="card-bento p-5 border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">{edu.degree}</h4>
                        <p className="text-muted text-xs mb-3">{edu.school}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-3">
                        <span className="badge text-[11px]">{edu.year}</span>
                        <span className="text-accent text-[11px] font-mono font-medium">{edu.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements & Certifications */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="section-label mb-8 block">Achievements & Certifications</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {achievements.map((ach) => (
                    <div key={ach._id || ach.title} className="card-bento p-5 flex flex-col justify-between border border-white/5 group hover:border-white/20 transition-all">
                      <div>
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-bold text-sm">
                            🏆
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm leading-snug">{ach.title}</h4>
                            <p className="text-muted text-xs mt-0.5">{ach.issuer}</p>
                          </div>
                        </div>
                        {ach.description && (
                          <p className="text-muted/80 text-xs mt-3 leading-relaxed">
                            {ach.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                        <span className="font-mono text-[11px] text-muted">{ach.date || '—'}</span>
                        {ach.credentialUrl && (
                          <a href={ach.credentialUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1">
                            Credential →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
          
        </div>
      </motion.div>
    </div>
  )
}
