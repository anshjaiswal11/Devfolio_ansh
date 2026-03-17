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
import Services from './pages/Services'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import CodingPortfolio from './pages/CodingPortfolio'

// Client Portal
import ClientGuard from './components/ClientGuard'
import ClientLayout from './pages/client/ClientLayout'
import ClientAccess from './pages/client/ClientAccess'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProgress from './pages/client/ClientProgress'
import ClientTasks from './pages/client/ClientTasks'
import ClientLogs from './pages/client/ClientLogs'
import ClientGitHub from './pages/client/ClientGitHub'
import ClientNotion from './pages/client/ClientNotion'
import ClientFeedback from './pages/client/ClientFeedback'
import ClientBugs from './pages/client/ClientBugs'
import ClientDocs from './pages/client/ClientDocs'
import ClientFiles from './pages/client/ClientFiles'
import ClientTime from './pages/client/ClientTime'
import ClientMeetings from './pages/client/ClientMeetings'
import ClientReleases from './pages/client/ClientReleases'
import ClientSlack from './pages/client/ClientSlack'

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
              <Route path="/services"     element={<Services />} />
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

              {/* Client Portal Routes */}
              <Route path="/client" element={<ClientAccess />} />
              <Route path="/client" element={<ClientGuard><ClientLayout /></ClientGuard>}>
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="progress"  element={<ClientProgress />} />
                <Route path="tasks"     element={<ClientTasks />} />
                <Route path="logs"      element={<ClientLogs />} />
                <Route path="github"    element={<ClientGitHub />} />
                <Route path="notion"    element={<ClientNotion />} />
                <Route path="feedback"  element={<ClientFeedback />} />
                <Route path="bugs"      element={<ClientBugs />} />
                <Route path="docs"      element={<ClientDocs />} />
                <Route path="files"     element={<ClientFiles />} />
                <Route path="time"      element={<ClientTime />} />
                <Route path="meetings"  element={<ClientMeetings />} />
                <Route path="releases"  element={<ClientReleases />} />
                <Route path="slack"     element={<ClientSlack />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
