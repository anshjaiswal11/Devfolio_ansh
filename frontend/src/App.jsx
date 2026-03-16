import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthGuard from './components/AuthGuard'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import CodingPortfolio from './pages/CodingPortfolio'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-void noise scan-overlay">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/about"        element={<About />} />
              <Route path="/projects"     element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/blog"         element={<Blogs />} />
              <Route path="/blog/:slug"   element={<BlogDetails />} />
              <Route path="/coding"       element={<CodingPortfolio />} />
              <Route path="/contact"      element={<Contact />} />
              <Route path="/login"        element={<Login />} />
              <Route path="/signup"       element={<Signup />} />
              <Route path="/dashboard"    element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
