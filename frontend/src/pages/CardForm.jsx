import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import Header from '../components/Header'
import { createCard, updateCard, getCard } from '../services/api'

const SECTIONS = [
  {
    title: '🆔 Identificación del Asegurado',
    fields: [
      { key: 'mat_aseg',    label: 'Mat. Aseg.',    placeholder: 'Código único del asegurado' },
      { key: 'cod_benefi',  label: 'Cód. Benefi.',  placeholder: 'Código de beneficiario' },
    ]
  },
  {
    title: '👤 Datos Personales',
    fields: [
      { key: 'apellido_paterno', label: 'Apellido Paterno', placeholder: '' },
      { key: 'apellido_materno', label: 'Apellido Materno', placeholder: '' },
      { key: 'nombre',           label: 'Nombre',           placeholder: '' },
      { key: 'ap_esposo',        label: 'Ap. Esposo/a',     placeholder: '' },
    ]
  },
  {
    title: '📍 Procedencia',
    fields: [
      { key: 'lugar_procedencia', label: 'Lugar de Procedencia', placeholder: '' },
      { key: 'localidad',         label: 'Localidad',            placeholder: '' },
      { key: 'provincia',         label: 'Provincia',            placeholder: '' },
      { key: 'departamento',      label: 'Departamento',         placeholder: '' },
      { key: 'direccion',         label: 'Dirección',            placeholder: '' },
      { key: 'telefono',          label: 'Teléfono',             placeholder: '' },
    ]
  },
  {
    title: '🏢 Datos Laborales',
    fields: [
      { key: 'empresa', label: 'Empresa', placeholder: '' },
      { key: 'seccion', label: 'Sección', placeholder: '' },
    ]
  },
  {
    title: '🚨 Contacto de Emergencia',
    fields: [
      { key: 'notificar_nombre',    label: 'A quién notificar en caso de emergencia', placeholder: 'Nombre completo' },
      { key: 'notificar_direccion', label: 'Dirección del contacto',                  placeholder: '' },
    ]
  },
  {
    title: '🏥 Datos Médicos / Hospitalarios',
    fields: [
      { key: 'unidad_sanitaria',    label: 'Unidad Sanitaria',     placeholder: '' },
      { key: 'consultorio_servicio',label: 'Consultorio / Servicio', placeholder: '' },
      { key: 'sala',                label: 'Sala',                 placeholder: '' },
      { key: 'cama',                label: 'Cama',                 placeholder: '' },
    ]
  },
]

const EMPTY = {
  mat_aseg:'', cod_benefi:'', apellido_paterno:'', apellido_materno:'',
  nombre:'', ap_esposo:'', lugar_procedencia:'', localidad:'',
  provincia:'', departamento:'', direccion:'', telefono:'',
  empresa:'', seccion:'', notificar_nombre:'', notificar_direccion:'',
  unidad_sanitaria:'', consultorio_servicio:'', sala:'', cama:'', lugar:'',
}

export default function CardForm() {
  const { id } = useParams()
  const isEdit  = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm]       = useState(EMPTY)
  const [fecha, setFecha]     = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isEdit) return
    getCard(id)
      .then(res => {
        const d = res.data
        const { observations, created_at, updated_at, user_id, id: _id, fecha: f, ...rest } = d
        setForm(prev => ({ ...prev, ...Object.fromEntries(Object.entries(rest).map(([k,v]) => [k, v ?? ''])) }))
        if (f) setFecha(parseISO(f))
      })
      .catch(() => setError('No se pudo cargar la tarjeta.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(form).map(([k,v]) => [k, v.trim() || null])),
        fecha: format(fecha, 'yyyy-MM-dd'),
      }
      if (isEdit) {
        await updateCard(id, payload)
        navigate(`/cards/${id}`)
      } else {
        const res = await createCard(payload)
        navigate(`/cards/${res.data.id}`)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar la tarjeta.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header />
      <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>Cargando...</div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header />
      <main style={{ maxWidth:860, margin:'0 auto', padding:'2rem 1.5rem' }}>

        {/* Page header */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.75rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Volver</button>
          <div>
            <h1 style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--primary-dark)' }}>
              {isEdit ? 'Editar Tarjeta' : 'Nueva Tarjeta Indice'}
            </h1>
            <p style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
              Todos los campos son opcionales
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            background:'var(--danger-light)', border:'1px solid #f5c6cb',
            borderRadius:'var(--radius-sm)', padding:'0.75rem 1rem',
            color:'var(--danger)', fontSize:'0.875rem', marginBottom:'1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{
              background:'var(--surface)', borderRadius:'var(--radius)',
              border:'1px solid var(--border)', marginBottom:'1.25rem',
              overflow:'hidden',
            }}>
              {/* Section header */}
              <div style={{
                background:'var(--primary-faint)', borderBottom:'1px solid var(--border)',
                padding:'0.6rem 1.25rem',
              }}>
                <h3 style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--primary)' }}>
                  {section.title}
                </h3>
              </div>

              {/* Fields grid */}
              <div style={{
                display:'grid',
                gridTemplateColumns: section.fields.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                gap:'1rem', padding:'1.25rem',
              }}>
                {section.fields.map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-input"
                      type={f.key === 'telefono' ? 'tel' : 'text'}
                      placeholder={f.placeholder || `Ingresar ${f.label.toLowerCase()}`}
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Lugar y Fecha */}
          <div style={{
            background:'var(--surface)', borderRadius:'var(--radius)',
            border:'1px solid var(--border)', marginBottom:'1.25rem', overflow:'hidden',
          }}>
            <div style={{ background:'var(--primary-faint)', borderBottom:'1px solid var(--border)', padding:'0.6rem 1.25rem' }}>
              <h3 style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--primary)' }}>
                📅 Lugar y Fecha
              </h3>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', padding:'1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Lugar</label>
                <input
                  className="form-input"
                  placeholder="Ej: Oruro"
                  value={form.lugar}
                  onChange={e => set('lugar', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <DatePicker
                  selected={fecha}
                  onChange={setFecha}
                  dateFormat="dd/MM/yyyy"
                  locale={es}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Seleccionar fecha"
                />
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                  Permite fechas pasadas para registros físicos anteriores
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', paddingTop:'0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? '💾 Guardar cambios' : '✅ Crear tarjeta'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
