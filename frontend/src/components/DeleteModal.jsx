export default function DeleteModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 style={{ color: 'var(--danger)', fontSize: '1.1rem', fontWeight: 700 }}>
            {title || '¿Eliminar?'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {message || 'Esta acción no se puede deshacer.'}
          </p>
        </div>

        <div style={{
          background: 'var(--danger-light)',
          border: '1px solid #f5c6cb',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--danger)',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 500,
        }}>
          🔒 Segunda confirmación requerida — haga clic en "Eliminar" para confirmar
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : '🗑️ Eliminar definitivamente'}
          </button>
        </div>
      </div>
    </div>
  )
}
