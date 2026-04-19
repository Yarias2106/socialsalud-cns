import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoCns from '../assets/logo-cns.png'

export default function Register() {
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6)    { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setLoading(true)
    try {
      await register(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrarse')
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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img src={logoCns} alt="CNS" style={{ height: 70, marginBottom: '0.75rem' }} />
          <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
            CAJA NACIONAL DE SALUD
          </h1>
        </div>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ej: trabajador.social"
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="Repetir contraseña"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
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
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
