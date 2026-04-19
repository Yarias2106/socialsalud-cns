import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoCns from '../assets/logo_header.png'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
      color: 'white',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
        gap: '1rem',
      }}>
        {/* Branding */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'white', textAlign: 'left',
          }}
        >
          <img
            src={logoCns}
            alt="Logo CNS"
            style={{ height: 52, width: 'auto', flexShrink: 0 }}
          />
          <div>
            <div style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '0.95rem',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.01em',
            }}>
              CAJA NACIONAL DE SALUD
            </div>
            <div style={{
              fontSize: '0.72rem',
              opacity: 0.85,
              letterSpacing: '0.06em',
              fontWeight: 500,
            }}>
              SUPERVISIÓN TRAB. SOCIAL
            </div>
          </div>
        </button>

        {/* User info + logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              fontSize: '0.8rem',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ fontSize: '1rem' }}>👤</span>
              <span style={{ fontWeight: 500 }}>{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.15)'}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
