import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { codingApi } from '../services/api'
import Loader from '../components/Loader'

function StatCard({ label, value, sub, active = false }) {
  return (
    <div className={`card-bento p-5 flex flex-col items-center justify-center text-center ${active ? 'border-white/20 bg-card' : ''}`}>
      <div className={`font-bold text-3xl md:text-4xl mb-1 ${active ? 'text-white' : 'text-neutral-300'}`}>
        {value ?? '—'}
      </div>
      <div className="text-muted text-xs font-mono uppercase tracking-widest">{label}</div>
      {sub && <div className="text-muted/60 text-[10px] mt-1 uppercase tracking-wider">{sub}</div>}
    </div>
  )
}

export default function CodingPortfolio() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [usernames, setUsernames] = useState({})

  useEffect(() => {
    codingApi.getStats()
      .then(r => {
        setStats(r.data.stats)
        setErrors(r.data.errors || {})
        setUsernames(r.data.usernames || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const { github, leetcode, gfg } = stats || {}

  return (
    <div className="min-h-screen pt-24 pb-20 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="badge mb-6">METRICS</span>
          <h1 className="heading-hero text-4xl md:text-5xl mb-4">
            Coding <span className="text-muted">Stats</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            A real-time dashboard of my open source contributions and algorithmic problem-solving progress.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : (
          <div className="space-y-12">
            
            {/* Nav / Quick Links */}
            <div className="flex flex-wrap justify-center gap-3">
              {usernames.githubUsername && (
                <a href={`https://github.com/${usernames.githubUsername}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                  GitHub @{usernames.githubUsername}
                </a>
              )}
              {usernames.leetcodeUsername && (
                <a href={`https://leetcode.com/${usernames.leetcodeUsername}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                  LeetCode @{usernames.leetcodeUsername}
                </a>
              )}
              {usernames.gfgUsername && (
                <a href={`https://auth.geeksforgeeks.org/user/${usernames.gfgUsername}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                  GFG @{usernames.gfgUsername}
                </a>
              )}
            </div>

            {/* GitHub */}
            {github && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <h2 className="font-bold text-white text-xl">GitHub</h2>
                  <span className="badge">Open Source</span>
                </div>
                
                <div className="card-bento p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    {github.avatar && (
                      <img src={github.avatar} alt={github.name} className="w-16 h-16 rounded-full border border-border bg-card" />
                    )}
                    <div>
                      <h3 className="text-white font-bold text-lg">{github.name}</h3>
                      {github.bio && <p className="text-muted text-sm">{github.bio}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Public Repos" value={github.publicRepos} active />
                    <StatCard label="Followers" value={github.followers} />
                    <StatCard label="Following" value={github.following} />
                  </div>

                  {/* GitHub Calendar Graph */}
                  <div className="border-t border-border pt-8 mt-4">
                    <h3 className="text-white text-sm font-semibold mb-6 flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                      Contribution Graph
                    </h3>
                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                      <div className="min-w-[700px] flex justify-center">
                        <img 
                          src={`https://ghchart.rshah.org/006d32/${github.username}`} 
                          alt={`${github.username}'s Github chart`}
                          className="w-full max-w-[800px] opacity-90 hover:opacity-100 transition-opacity rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* LeetCode */}
            {leetcode && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4 mt-12">
                  <h2 className="font-bold text-white text-xl">LeetCode</h2>
                  <span className="badge">Algorithms</span>
                </div>
                
                <div className="card-bento p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                      <div className="font-bold text-6xl text-white tracking-tighter mb-2">
                        {leetcode.totalSolved}
                      </div>
                      <p className="text-muted text-sm font-mono uppercase tracking-widest">Questions Solved</p>
                      {leetcode.acceptanceRate && (
                        <div className="mt-4 badge">Acceptance: {parseFloat(leetcode.acceptanceRate).toFixed(1)}%</div>
                      )}
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted w-16">Easy</span>
                        <div className="flex-1 mx-4 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${((leetcode.easySolved || 0) / (leetcode.totalQuestions || 1)) * 100}%` }} />
                        </div>
                        <span className="text-white font-mono w-10 text-right">{leetcode.easySolved}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted w-16">Medium</span>
                        <div className="flex-1 mx-4 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-400 rounded-full" style={{ width: `${((leetcode.mediumSolved || 0) / (leetcode.totalQuestions || 1)) * 100}%` }} />
                        </div>
                        <span className="text-white font-mono w-10 text-right">{leetcode.mediumSolved}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted w-16">Hard</span>
                        <div className="flex-1 mx-4 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-600 rounded-full" style={{ width: `${((leetcode.hardSolved || 0) / (leetcode.totalQuestions || 1)) * 100}%` }} />
                        </div>
                        <span className="text-white font-mono w-10 text-right">{leetcode.hardSolved}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* GeeksForGeeks */}
            {gfg && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4 mt-12">
                  <h2 className="font-bold text-white text-xl">GeeksForGeeks</h2>
                  <span className="badge">Data Structures</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <StatCard label="Total Solved" value={gfg.totalProblemsSolved} active />
                  <StatCard label="Score" value={gfg.codingScore} />
                  <StatCard label="Streak" value={gfg.currentStreak} sub="days" />
                  <StatCard label="Max Streak" value={gfg.maxStreak} sub="days" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="card-bento p-5 text-center">
                    <div className="font-bold text-2xl text-white mb-1">{gfg.easy || 0}</div>
                    <div className="text-muted text-xs font-mono uppercase">Easy</div>
                  </div>
                  <div className="card-bento p-5 text-center">
                    <div className="font-bold text-2xl text-neutral-400 mb-1">{gfg.medium || 0}</div>
                    <div className="text-muted text-xs font-mono uppercase">Medium</div>
                  </div>
                  <div className="card-bento p-5 text-center">
                    <div className="font-bold text-2xl text-neutral-600 mb-1">{gfg.hard || 0}</div>
                    <div className="text-muted text-xs font-mono uppercase">Hard</div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Error states */}
            {Object.keys(errors).length > 0 && (
              <div className="card-bento p-4 border-red-500/20 bg-red-500/5 mt-8">
                <p className="text-red-400/80 text-xs font-mono mb-2 uppercase tracking-widest">Partial Sync Failure</p>
                {Object.entries(errors).map(([k, v]) => (
                  <p key={k} className="text-muted text-xs font-mono">• {k}: {v}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
