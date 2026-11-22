export const DEFAULT_PROJECTS = [
  {
    _id: 'proj-1',
    title: 'CiteWise AI (Studex)',
    slug: 'citewise-ai',
    description: 'RAG-based AI study companion with Groq LLM inference, sentence transformers embeddings, interactive D3.js mind maps, flashcards, and KaTeX math rendering.',
    techStack: ['Next.js', 'React', 'FastAPI', 'Supabase', 'PostgreSQL', 'Groq', 'D3.js'],
    githubLink: 'https://github.com/anshjaiswal11',
    liveDemoLink: 'https://citewise.xyz',
    featured: true,
    order: 1
  },
  {
    _id: 'proj-2',
    title: 'URL Shortener at Scale',
    slug: 'url-shortener',
    description: 'Production-oriented URL shortener built with Java 17 and Spring Boot 3 featuring Base62 encoding, cache-first Redis redirects, distributed rate limiting, and async click analytics.',
    techStack: ['Java 17', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker', 'JUnit 5'],
    githubLink: 'https://github.com/anshjaiswal11',
    featured: true,
    order: 2
  },
  {
    _id: 'proj-3',
    title: 'CodeRev AI',
    slug: 'coderev',
    description: 'Automated PR code review engine integrating GitHub API and WebSockets to stream line-by-line quality, security, and performance insights, cutting review turnaround by 70%.',
    techStack: ['Node.js', 'Express.js', 'GitHub API', 'WebSockets', 'React'],
    githubLink: 'https://github.com/anshjaiswal11',
    featured: true,
    order: 3
  },
  {
    _id: 'proj-4',
    title: 'Blinkit Backend API',
    slug: 'blinkit',
    description: 'Scalable e-commerce backend with geospatial store routing, atomic stock management, order processing pipelines, and Redis caching for sub-millisecond lookups.',
    techStack: ['Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'Redis', 'Docker'],
    githubLink: 'https://github.com/anshjaiswal11',
    featured: false,
    order: 4
  },
  {
    _id: 'proj-5',
    title: 'Airbnb Backend API',
    slug: 'airbnb-backend',
    description: 'High-concurrency property booking and reservation service designed with relational schema optimization, conflict-free scheduling, and JWT authentication.',
    techStack: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker'],
    githubLink: 'https://github.com/anshjaiswal11',
    featured: false,
    order: 5
  },
  {
    _id: 'proj-6',
    title: 'FinSight-AI',
    slug: 'finsight-ai',
    description: 'Financial intelligence analytics platform extracting insights and real-time market data with interactive visualization dashboards.',
    techStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
    githubLink: 'https://github.com/anshjaiswal11',
    featured: false,
    order: 6
  }
]
