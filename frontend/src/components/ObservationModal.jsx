import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { addObservation } from '../services/api'

export default function ObservationModal({ cardId, onClose, onAdded }) {
  const [texto, setTexto] = useState('')
  const [fecha, setFecha] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!texto.trim()) { setError('El texto de la observación es requerido.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await addObservation(cardId, {
        texto: texto.trim(),
        fecha_visita: format(fecha, 'yyyy-MM-dd'),
      })
      onAdded(res.data)
      onClose()
    } catch {
      setError('Error al agregar la observación. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
          📝 Nueva Observación de Visita
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Fecha de la visita</label>
            <DatePicker
              selected={fecha}
              onChange={setFecha}
              dateFormat="dd/MM/yyyy"
              locale={es}
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Seleccionar fecha"
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Puede seleccionar fechas pasadas para registros anteriores
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Observación</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Describa el motivo de la visita, evolución del paciente, indicaciones, etc."
              value={texto}
              onChange={e => setTexto(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : '✅ Guardar observación'}
          </button>
        </div>
      </div>
    </div>
  )
}
