import React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './styles.css'
import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import ChattingPage from './ChattingPage'

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/chatting">Chatting</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chatting" element={<ChattingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  )
}
