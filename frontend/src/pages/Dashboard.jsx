import { useState, useEffect } from 'react'
import api from '../lib/api'

const API_CITAS     = '/api/citas'
const API_PACIENTES = '/api/pacientes'

const estadoBadge = (estado) => {
  const map = {
    agendo:     { bg: '#fef3cd', color: '#e6a817', label: 'Agendó' },
    confirmo:   { bg: '#e0f2fe', color: '#0077B6', label: 'Confirmó' },
    asistio:    { bg: '#dbeafe', color: '#3b82f6', label: 'Asistió' },
    reprogramo: { bg: '#ede9fe', color: '#6366f1', label: 'Reprogramó' },
    cancelo:    { bg: '#fee2e2', color: '#dc2626', label: 'Canceló' },
  }
  const s = map[estado] || { bg: '#f3f4f6', color: '#9ca3af', label: estado }
  return (
    <span className="badge capitalize" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function StatCard({ label, value, Icon, accent, delay }) {
  return (
    <div
      className="card card-hover rounded-2xl p-5 relative overflow-hidden"
      style={{ animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}
    >
      {/* Gradient blob */}
      <div
        className="absolute -top-5 -right-5 w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accent}18` }}
      >
        <Icon color={accent} />
      </div>

      <p className="text-3xl font-bold mb-0.5" style={{ color: '#1D1D1B' }}>{value}</p>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#B2B2B2' }}>{label}</p>
    </div>
  )
}

const IconPatients = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconCalendar = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconClock = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconCheck = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function SkeletonDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="skeleton h-7 w-36 mb-2 rounded-xl" />
      <div className="skeleton h-4 w-56 mb-8 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[0,1,2,3].map(i => (
          <div key={i} className="skeleton rounded-2xl" style={{ height: '116px' }} />
        ))}
      </div>
      <div className="skeleton rounded-2xl mb-6" style={{ height: '220px' }} />
      <div className="skeleton rounded-2xl" style={{ height: '200px' }} />
    </div>
  )
}

export default function Dashboard() {
  const [citas, setCitas]         = useState([])
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando]   = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resCitas, resPacientes] = await Promise.all([
          api.get(API_CITAS),
          api.get(API_PACIENTES)
        ])
        setCitas(resCitas.data)
        setPacientes(resPacientes.data)
      } catch (e) {
        console.error('Error cargando dashboard:', e)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  if (cargando) return <SkeletonDashboard />

  const hoy        = new Date().toDateString()
  const citasHoy   = citas.filter(c => new Date(c.fecha).toDateString() === hoy)
  const pendientes = citas.filter(c => c.estado === 'agendo').length
  const confirmadas = citas.filter(c => c.estado === 'confirmo').length

  const stats = [
    { label: 'Pacientes',   value: pacientes.length, Icon: IconPatients, accent: '#0077B6', delay: 0   },
    { label: 'Citas hoy',   value: citasHoy.length,  Icon: IconCalendar, accent: '#00B4D8', delay: 60  },
    { label: 'Agendadas',   value: pendientes,        Icon: IconClock,    accent: '#e6a817', delay: 120 },
    { label: 'Confirmadas', value: confirmadas,       Icon: IconCheck,    accent: '#0077B6', delay: 180 },
  ]

  const fechaHoy = new Date().toLocaleDateString('es-BO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8" style={{ animation: 'fadeInUp 0.4s both' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#1D1D1B', fontFamily: "'Bell MT', serif" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1 capitalize" style={{ color: '#B2B2B2' }}>{fechaHoy}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Citas hoy */}
      <div
        className="card rounded-2xl mb-6 overflow-hidden"
        style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 240ms both' }}
      >
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #f0f4f1' }}>
          <div>
            <h2 className="font-semibold" style={{ color: '#1D1D1B' }}>Citas de hoy</h2>
            <p className="text-xs mt-0.5" style={{ color: '#B2B2B2' }}>
              {citasHoy.length} programada{citasHoy.length !== 1 ? 's' : ''}
            </p>
          </div>
          {citasHoy.length > 0 && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#e0f2fe', color: '#0077B6' }}
            >
              {citasHoy.length}
            </span>
          )}
        </div>

        {citasHoy.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div
              className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#e0f2fe', color: '#0077B6' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M9 16l2 2 4-4"></path>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: '#B2B2B2' }}>
              Sin citas para hoy
            </p>
          </div>
        ) : (
          citasHoy.map((c, i) => (
            <div
              key={c.id}
              className="px-6 py-4 flex items-center gap-4"
              style={{
                borderTop: i > 0 ? '1px solid #f5f7f5' : 'none',
                animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${280 + i * 50}ms both`
              }}
            >
              <div className="avatar">{c.paciente.nombre.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#1D1D1B' }}>
                  {c.paciente.nombre}
                </p>
                <p className="text-xs" style={{ color: '#B2B2B2' }}>{c.motivo}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-semibold tabular-nums" style={{ color: '#1D1D1B' }}>
                  {new Date(c.fecha).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {estadoBadge(c.estado)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Últimos pacientes */}
      <div
        className="card rounded-2xl overflow-hidden"
        style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 300ms both' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #f0f4f1' }}>
          <h2 className="font-semibold" style={{ color: '#1D1D1B' }}>Últimos pacientes</h2>
          <p className="text-xs mt-0.5" style={{ color: '#B2B2B2' }}>Registros recientes</p>
        </div>

        {pacientes.slice(0, 5).map((p, i) => (
          <div
            key={p.id}
            className="px-6 py-3.5 flex items-center gap-3"
            style={{
              borderTop: i > 0 ? '1px solid #f5f7f5' : 'none',
              animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${350 + i * 40}ms both`
            }}
          >
            <div
              className="avatar"
              style={{ background: 'linear-gradient(135deg, #B2B2B2, #929292)' }}
            >
              {p.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#1D1D1B' }}>{p.nombre}</p>
              <p className="text-xs" style={{ color: '#B2B2B2' }}>{p.telefono}</p>
            </div>
            {p.email && (
              <p className="text-xs hidden sm:block truncate max-w-[160px]" style={{ color: '#B2B2B2' }}>
                {p.email}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
