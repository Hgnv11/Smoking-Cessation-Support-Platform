import './App.css'
import Header from './components/Header/Header.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Overview from './pages/Dashboard/Overview.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserManagement from './pages/UserManagement/UserManagement.jsx'
import BlogManagement from './pages/BlogManagement/BlogManagement.jsx'
import MembershipPayment from './pages/MembershipPayment/MembershipPayment.jsx'
import CoachManagement from './pages/CoachManagement/CoachManagement.jsx'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Header />
          <Routes>
            <Route path="/" element={
              <div className="main-content">
                <Overview />
              </div>
            } />
            {/* -------- Admin Management -------- */}
            <Route path="/user-management" element={
              <div className="main-content">
                <UserManagement />
              </div>
            } />
            <Route path="/blog-management" element={
              <div className="main-content">
                <BlogManagement />
              </div>
            } />
            <Route path="/membership-payment" element={
              <div className="main-content">
                <MembershipPayment />
              </div>
            } />
            <Route path="/coach-management" element={
              <div className="main-content">
                <CoachManagement />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
