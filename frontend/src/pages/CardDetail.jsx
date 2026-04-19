import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import DeleteModal from '../components/DeleteModal'
import ObservationModal from '../components/ObservationModal'
import { getCard, deleteCard, deleteObservation } from '../services/api'

function Field({ label, value }) {
  if (!value) return null
  return (
    <div>
      <div style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'2px' }}>
        {label}
      </div>
      <div style={{ fontSize:'0.9rem', color:'var(--text)' }}>{value}</div>
    </div>
  )
}

function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(c => c !== null && c !== false && c !== undefined)
    : children !== null && children !== undefined
  if (!hasContent) return null
  return (
    <div style={{
      background:'var(--surface)', borderRadius:'var(--radius)',
      border:'1px solid var(--border)', overflow:'hidden', marginBottom:'1rem',
    }}>
      <div style={{ background:'var(--primary-faint)', borderBottom:'1px solid var(--border)', padding:'0.55rem 1.25rem' }}>
        <h3 style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--primary)' }}>{title}</h3>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem', padding:'1.1rem 1.25rem' }}>
        {children}
      </div>
    </div>
  )
}

export default function CardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [card, setCard]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [showDeleteCard, setShowDeleteCard]   = useState(false)
  const [showAddObs, setShowAddObs]   = useState(false)
  const [deletingCard, setDeletingCard] = useState(false)
  const [obsToDelete, setObsToDelete] = useState(null)
  const [deletingObs, setDeletingObs] = useState(false)
  const [error, setError]             = useState('')

  const loadCard = () => {
    setLoading(true)
    getCard(id)
      .then(res => setCard(res.data))
      .catch(() => setError('No se pudo cargar la tarjeta.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCard() }, [id])

  const handleDeleteCard = async () => {
    setDeletingCard(true)
    try {
      await deleteCard(id)
      navigate('/', { replace: true })
    } catch {
      setError('Error al eliminar la tarjeta.')
      setDeletingCard(false)
      setShowDeleteCard(false)
    }
  }

  const handleDeleteObs = async () => {
    if (!obsToDelete) return
    setDeletingObs(true)
    try {
      await deleteObservation(id, obsToDelete)
      setCard(c => ({ ...c, observations: c.observations.filter(o => o.id !== obsToDelete) }))
      setObsToDelete(null)
    } catch {
      setError('Error al eliminar la observación.')
    } finally {
      setDeletingObs(false)
    }
  }

  const handleObsAdded = (newObs) => {
    setCard(c => ({ ...c, observations: [newObs, ...c.observations] }))
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header />
      <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
        <div style={{ fontSize:'2rem' }}>⏳</div> Cargando tarjeta...
      </div>
    </div>
  )

  if (error && !card) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header />
      <div style={{ textAlign:'center', padding:'4rem', color:'var(--danger)' }}>{error}</div>
    </div>
  )

  const fullName = [card.apellido_paterno, card.apellido_materno, card.nombre].filter(Boolean).join(' ') || 'Sin nombre'

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header />

      <main style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem' }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.5rem', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Volver</button>
            <div>
              <h1 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--primary-dark)' }}>{fullName}</h1>
              {card.mat_aseg && (
                <span className="badge badge-green" style={{ marginTop:'0.25rem' }}>
                  🆔 Mat. Aseg.: {card.mat_aseg}
                </span>
              )}
            </div>
          </div>

          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/cards/${id}/edit`)}>
              ✏️ Editar
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteCard(true)}>
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background:'var(--danger-light)', border:'1px solid #f5c6cb',
            borderRadius:'var(--radius-sm)', padding:'0.7rem 1rem',
            color:'var(--danger)', fontSize:'0.85rem', marginBottom:'1rem',
          }}>{error}</div>
        )}

        {/* Sections */}
        <Section title="🆔 Identificación del Asegurado">
          <Field label="Mat. Aseg."   value={card.mat_aseg} />
          <Field label="Cód. Benefi." value={card.cod_benefi} />
        </Section>

        <Section title="👤 Datos Personales">
          <Field label="Apellido Paterno" value={card.apellido_paterno} />
          <Field label="Apellido Materno" value={card.apellido_materno} />
          <Field label="Nombre"           value={card.nombre} />
          <Field label="Ap. Esposo/a"     value={card.ap_esposo} />
        </Section>

        <Section title="📍 Procedencia y Contacto">
          <Field label="Lugar de Procedencia" value={card.lugar_procedencia} />
          <Field label="Localidad"            value={card.localidad} />
          <Field label="Provincia"            value={card.provincia} />
          <Field label="Departamento"         value={card.departamento} />
          <Field label="Dirección"            value={card.direccion} />
          <Field label="Teléfono"             value={card.telefono} />
        </Section>

        <Section title="🏢 Datos Laborales">
          <Field label="Empresa" value={card.empresa} />
          <Field label="Sección" value={card.seccion} />
        </Section>

        <Section title="🚨 Contacto de Emergencia">
          <Field label="A quién notificar" value={card.notificar_nombre} />
          <Field label="Dirección"          value={card.notificar_direccion} />
        </Section>

        <Section title="🏥 Datos Médicos / Hospitalarios">
          <Field label="Unidad Sanitaria"      value={card.unidad_sanitaria} />
          <Field label="Consultorio / Servicio" value={card.consultorio_servicio} />
          <Field label="Sala" value={card.sala} />
          <Field label="Cama" value={card.cama} />
        </Section>

        <Section title="📅 Lugar y Fecha">
          <Field label="Lugar" value={card.lugar} />
          <Field label="Fecha" value={card.fecha
            ? new Date(card.fecha + 'T00:00:00').toLocaleDateString('es-BO', { day:'2-digit', month:'long', year:'numeric' })
            : null} />
        </Section>

        {/* Observaciones */}
        <div style={{
          background:'var(--surface)', borderRadius:'var(--radius)',
          border:'1px solid var(--border)', overflow:'hidden',
        }}>
          <div style={{
            background:'var(--primary-faint)', borderBottom:'1px solid var(--border)',
            padding:'0.6rem 1.25rem',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <h3 style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--primary)' }}>
              📝 Observaciones de Visitas ({card.observations?.length || 0})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddObs(true)}>
              + Agregar observación
            </button>
          </div>

          <div style={{ padding:'1.25rem' }}>
            {(!card.observations || card.observations.length === 0) ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📭</div>
                <p style={{ fontSize:'0.875rem' }}>No hay observaciones registradas aún.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {card.observations.map(obs => (
                  <div key={obs.id} style={{
                    border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
                    padding:'0.9rem 1rem', background:'var(--surface-2)',
                    position:'relative',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                      <span style={{
                        fontSize:'0.75rem', fontWeight:700,
                        color:'var(--primary)', background:'var(--accent-light)',
                        padding:'2px 10px', borderRadius:999,
                      }}>
                        📅 {new Date(obs.fecha_visita + 'T00:00:00').toLocaleDateString('es-BO', { day:'2-digit', month:'long', year:'numeric' })}
                      </span>
                      <button
                        onClick={() => setObsToDelete(obs.id)}
                        style={{
                          background:'none', border:'none', cursor:'pointer',
                          color:'var(--text-muted)', fontSize:'1rem', padding:'0 4px',
                          lineHeight:1, transition:'color 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.color='var(--danger)'}
                        onMouseLeave={e => e.target.style.color='var(--text-muted)'}
                        title="Eliminar observación"
                      >
                        ×
                      </button>
                    </div>
                    <p style={{ fontSize:'0.875rem', whiteSpace:'pre-wrap', lineHeight:1.6 }}>{obs.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modales */}
      {showDeleteCard && (
        <DeleteModal
          title="¿Eliminar esta tarjeta?"
          message={`Se eliminará permanentemente la tarjeta de "${fullName}" junto con todas sus observaciones.`}
          onConfirm={handleDeleteCard}
          onCancel={() => setShowDeleteCard(false)}
          loading={deletingCard}
        />
      )}

      {obsToDelete && (
        <DeleteModal
          title="¿Eliminar esta observación?"
          message="Se eliminará permanentemente esta observación de visita."
          onConfirm={handleDeleteObs}
          onCancel={() => setObsToDelete(null)}
          loading={deletingObs}
        />
      )}

      {showAddObs && (
        <ObservationModal
          cardId={id}
          onClose={() => setShowAddObs(false)}
          onAdded={handleObsAdded}
        />
      )}
    </div>
  )
}
