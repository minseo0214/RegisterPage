import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles.css'
import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import FeedPage from './FeedPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}
