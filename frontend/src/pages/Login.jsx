import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoCns from '../assets/logo-cns.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--primary-dark) 0%, var(--primary) 50%, var(--accent) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: 420,
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo + Nombre */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logoCns} alt="CNS" style={{ height: 80, marginBottom: '1rem' }} />
          <h1 style={{
            fontFamily: 'Merriweather, serif',
            fontSize: '1rem',
            color: 'var(--primary-dark)',
            lineHeight: 1.3,
          }}>
            CAJA NACIONAL DE SALUD
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
            SUPERVISIÓN TRAB. SOCIAL
          </p>
          <div style={{
            width: 40, height: 3, background: 'var(--accent)', borderRadius: 2,
            margin: '1rem auto 0',
          }} />
        </div>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              className="form-input"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-light)',
              border: '1px solid #f5c6cb',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.9rem',
              fontSize: '0.85rem',
              color: 'var(--danger)',
            }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem' }}>
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
