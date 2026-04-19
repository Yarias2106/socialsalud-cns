import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCards } from '../services/api'

function CardItem({ card, onClick }) {
  const initials = [card.apellido_paterno, card.nombre]
    .filter(Boolean).map(s => s[0]).join('').toUpperCase() || '?'

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow)'
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = ''
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        color: 'white', fontWeight: 700, fontSize: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
          {[card.apellido_paterno, card.apellido_materno, card.nombre].filter(Boolean).join(' ') || 'Sin nombre'}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {card.mat_aseg && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🆔 Mat.: <strong>{card.mat_aseg}</strong>
            </span>
          )}
          {card.empresa && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🏢 {card.empresa}
            </span>
          )}
          {card.unidad_sanitaria && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🏥 {card.unidad_sanitaria}
            </span>
          )}
        </div>
      </div>

      {/* Fecha + flecha */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {card.fecha && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            {new Date(card.fecha + 'T00:00:00').toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' })}
          </div>
        )}
        <span style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>›</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [cards, setCards]       = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const fetchCards = useCallback(async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await getCards(q)
      setCards(res.data)
    } catch {
      setError('Error al cargar las tarjetas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchCards(search), 350)
    return () => clearTimeout(timer)
  }, [search, fetchCards])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '1.75rem',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              Tarjetas de Pacientes
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {loading ? 'Cargando...' : `${cards.length} registro${cards.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/cards/new')}
          >
            + Nueva tarjeta
          </button>
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{
            position: 'absolute', left: '0.9rem', top: '50%',
            transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none',
          }}>🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.9rem' }}
            placeholder="Buscar por Mat. Aseg. (ej: A-0012)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem',
              }}
            >×</button>
          )}
        </div>

        {/* Estados */}
        {error && (
          <div style={{
            background: 'var(--danger-light)', border: '1px solid #f5c6cb',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
            color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            Cargando tarjetas...
          </div>
        )}

        {!loading && cards.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            border: '1px dashed var(--border)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {search ? 'No se encontraron resultados' : 'No hay tarjetas aún'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {search
                ? `No hay tarjetas con Mat. Aseg. "${search}"`
                : 'Haga clic en "+ Nueva tarjeta" para crear el primer registro'}
            </p>
          </div>
        )}

        {/* Lista de tarjetas */}
        {!loading && cards.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                onClick={() => navigate(`/cards/${card.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
