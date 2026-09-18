import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root '/' to '/feed' */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
        
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/feed" element={<Feed />} />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  )
}

export default App