import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

function AdminLogin({ setIsAdmin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    
    if (password === adminPassword) {
      setIsAdmin(true)
      navigate('/admin')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>🔐 Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>
    </div>
  )
}

export default AdminLogin
