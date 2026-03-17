import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { aboutApi, achievementsApi } from '../services/api'
import Loader from '../components/Loader'

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    Promise.all([
      aboutApi.get(),
      achievementsApi.getAll()
    ])
      .then(([aboutRes, achRes]) => {
        setAbout(aboutRes.data.about)
        setAchievements(achRes.data.achievements || [])
      })
      .catch(() => setAbout(null))
      .finally(() => setLoading(false))
  }, [])

  const skills = about?.skills || []
  const tools = about?.tools || ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'Tailwind CSS', 'Git', 'PostgreSQL', 'Redis', 'AWS', 'Figma']
  const experience = about?.experience || []
  const education = about?.education || []
  const social = about?.socialLinks || {}

  return (
    <div className="min-h-screen pt-24 pb-24 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        {/* Header */}
        <div className="mb-16">
          <span className="badge mb-4">PROFILE</span>
          <h1 className="heading-hero text-4xl md:text-6xl mb-4">
            About <span className="text-muted">Me</span>
          </h1>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Left Sidebar: Profile Card */}
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="sticky top-24"
              >
                <div className="card-bento p-6 flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-5 bg-card border border-border flex items-center justify-center">
                    {about?.profileImage ? (
                      <img src={about.profileImage} alt={about.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-4xl text-white">{about?.name?.charAt(0) || 'D'}</span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-white tracking-tight mb-1">{about?.name || 'Your Name'}</h2>
                  <p className="text-muted text-sm mb-4">{about?.tagline || 'Full-Stack Developer'}</p>
                  
                  {about?.location && (
                    <div className="flex items-center gap-2 text-xs text-muted mb-6 font-mono">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {about.location}
                    </div>
                  )}

                  {/* Social links */}
                  <div className="flex gap-2 w-full justify-center mb-6">
                    {social.github && (
                      <a href={social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3">
                        GitHub
                      </a>
                    )}
                    {social.linkedin && (
                      <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3">
                        LinkedIn
                      </a>
                    )}
                    {social.twitter && (
                      <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3">
                        Twitter
                      </a>
                    )}
                  </div>

                  {about?.resumeUrl && (
                    <a href={about.resumeUrl} download className="btn-primary w-full py-2.5 text-xs">
                      Download Resume
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Content */}
            <div className="md:col-span-2 space-y-16">
              
              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Background</h3>
                <div className="prose-dark">
                  {(about?.bio || 'I am a passionate software engineer focused on building robust and scalable web applications.')
                    .split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  }
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
                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-border group-hover:bg-white transition-colors" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                          <h4 className="font-bold text-white text-base">{exp.role}</h4>
                          <span className="font-mono text-xs text-muted">{exp.period}</span>
                        </div>
                        <p className="text-white/60 text-sm font-medium mb-3">{exp.company}</p>
                        <p className="text-muted text-sm leading-relaxed">{exp.desc}</p>
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
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="section-label mb-8 block">Education</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {education.map((edu, i) => (
                      <div key={i} className="card-bento p-5">
                        <h4 className="font-bold text-white text-sm mb-1">{edu.degree}</h4>
                        <p className="text-muted text-xs mb-3">{edu.school}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="badge">{edu.year}</span>
                          <span className="text-muted text-[10px] uppercase tracking-wider">{edu.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements & Certificates */}
              {achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="section-label mb-8 block">Achievements & Certificates</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {achievements.map((ach) => (
                      <div key={ach._id} className="card-bento p-5 flex flex-col h-full group">
                        <div className="flex items-start gap-4 mb-3">
                          {ach.imageUrl ? (
                            <img src={ach.imageUrl} alt={ach.title} className="w-12 h-12 rounded object-contain bg-white/5 p-1 shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1 line-clamp-2">{ach.title}</h4>
                            <p className="text-muted text-xs">{ach.issuer}</p>
                          </div>
                        </div>
                        {ach.description && (
                          <p className="text-muted/80 text-xs mb-4 line-clamp-3 leading-relaxed flex-grow">
                            {ach.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <span className="font-mono text-[10px] text-muted">{ach.date || '—'}</span>
                          {ach.credentialUrl && (
                            <a href={ach.credentialUrl} target="_blank" rel="noopener noreferrer" 
                               className="text-[10px] font-mono uppercase tracking-wider text-accent hover:text-white transition-colors flex items-center gap-1">
                              View Credential
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Skills & Tools */}
              {(skills.length > 0 || tools.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="section-label mb-6 block">Technical Arsenal</h3>
                  
                  {skills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-mono text-muted mb-3 uppercase tracking-widest">Core specific</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-white text-void rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tools.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-muted mb-3 uppercase tracking-widest">Tools & Ecosystem</p>
                      <div className="flex flex-wrap gap-2">
                        {tools.map(tool => (
                          <span key={tool} className="px-3 py-1.5 card-bento text-muted hover:text-white transition-colors text-xs font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
          </div>
        )}
      </motion.div>
    </div>
  )
}
