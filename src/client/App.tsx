import React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './styles.css'
import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import TextPage from './TextPage'

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
              <Link to="/registration">Register</Link>
            </li>
            <li>
              <Link to="/text">Chatting</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/text" element={<TextPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  )
}
