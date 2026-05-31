import { useState } from 'react'
import Pacientes from './pages/Pacientes'
import Citas from './pages/Citas'
import Dashboard from './pages/Dashboard'
import Doctores from './pages/Doctores'
import Login from './pages/Login'

// ┌──────────────────────────────────────────────────────────┐
// │  CONTROL DE BLOQUEO DEL SISTEMA                         │
// │  Cambiar a false cuando la doctora pague sus facturas   │
// └──────────────────────────────────────────────────────────┘
const SISTEMA_BLOQUEADO = true

// Decodifica el payload del JWT sin librería externa
const decodeToken = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

/* ── Componente de bloqueo por facturación pendiente ── */
const BloqueoFacturacion = () => (
  <div
    id="lockout-overlay"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.3s ease',
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        maxWidth: '460px',
        width: '100%',
        padding: '2.5rem 2rem 2rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        textAlign: 'center',
        animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Ícono de alerta */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Título */}
      <h2
        style={{
          fontSize: '1.35rem',
          fontWeight: '700',
          color: '#1D1D1B',
          marginBottom: '0.75rem',
          lineHeight: '1.3',
        }}
      >
        Sistema suspendido temporalmente
      </h2>

      {/* Línea decorativa */}
      <div
        style={{
          width: '50px',
          height: '3px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, #dc2626, #f87171)',
          margin: '0 auto 1.25rem',
        }}
      />

      {/* Mensaje */}
      <p
        style={{
          fontSize: '0.92rem',
          color: '#6b7280',
          lineHeight: '1.65',
          marginBottom: '1.5rem',
        }}
      >
        El acceso al sistema ha sido restringido debido a{' '}
        <strong style={{ color: '#1D1D1B' }}>facturas pendientes de pago</strong>.
        Para restaurar el servicio, por favor comuníquese con el equipo de soporte
        técnico para regularizar su situación.
      </p>

      {/* Tarjeta de contacto */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8D99AE', marginBottom: '0.5rem' }}>
          Contacto de soporte
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <a
            href="https://wa.me/72677214"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0077B6', textDecoration: 'none' }}
          >
            7267-7214
          </a>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          WhatsApp o llamada directa
        </p>
      </div>

      {/* Badge de estado */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '999px',
          padding: '0.4rem 1rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#dc2626',
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc2626', animation: 'pulse 2s infinite' }} />
        Servicio suspendido
      </div>
    </div>
  </div>
)

const IconGrid = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)
const IconCalendar = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconDoctor = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default function App() {
  const [pagina, setPagina] = useState('dashboard')
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem('token'))

  const token = localStorage.getItem('token')
  const usuario = token ? (JSON.parse(localStorage.getItem('usuario') || 'null') || decodeToken(token)) : null
  const esAdmin = usuario?.rol === 'admin'

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: IconGrid },
    { id: 'citas', label: 'Citas', Icon: IconCalendar },
    { id: 'pacientes', label: 'Pacientes', Icon: IconUsers },
    ...(esAdmin ? [{ id: 'doctores', label: 'Doctores', Icon: IconDoctor }] : []),
  ]

  const handleLogin = () => { setAutenticado(true) }
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); setAutenticado(false) }

  if (!autenticado) return <Login onLogin={handleLogin} />

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F0FAFF' }}>

      {/* ── Bloqueo por facturación pendiente ── */}
      {SISTEMA_BLOQUEADO && <BloqueoFacturacion />}

      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-40"
        style={{ width: 'var(--sidebar-w)', backgroundColor: '#0077B6' }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: '#fff' }}>
              <img src="/logo.png" alt="Bob Dent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white leading-tight truncate">Dra. Mariela Yepez</h1>
              <p className="text-xs font-medium" style={{ color: '#FFDD00' }}>Odontopediatría</p>
            </div>
          </div>
        </div>

        {/* Usuario activo */}
        {usuario && (
          <div className="px-5 pt-4 pb-2 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden text-sm font-bold"
              style={{ background: usuario.foto ? 'transparent' : 'linear-gradient(135deg, #FFDD00, #00B4D8)', color: '#1D1D1B' }}
            >
              {usuario.foto
                ? <img src={usuario.foto} alt={usuario.nombre} className="w-full h-full object-cover" />
                : usuario.nombre.charAt(0).toUpperCase()
              }
            </div>
            <div className="overflow-hidden">
              <p className="text-xs truncate font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {usuario.nombre}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block"
                style={{
                  background: esAdmin ? 'rgba(255,221,0,0.25)' : 'rgba(255,255,255,0.12)',
                  color: esAdmin ? '#FFDD00' : 'rgba(255,255,255,0.5)'
                }}
              >
                {esAdmin ? 'Admin' : 'Doctor'}
              </span>
            </div>
          </div>
        )}

        <div className="px-5 pt-3 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Menú
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setPagina(id)}
              className={`nav-item${pagina === id ? ' active' : ''}`}
            >
              <Icon />{label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="nav-item" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <IconLogout />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="md:ml-[260px]">

          {/* Mobile header */}
          <header
            className="md:hidden sticky top-0 z-30 bg-white px-4 py-3 flex justify-between items-center"
            style={{ borderBottom: '1px solid #e0edf5', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ background: '#fff', border: '1px solid #e0edf5' }}>
                <img src="/logo.png" alt="Bob Dent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span className="text-sm font-bold truncate max-w-[160px]" style={{ color: '#1D1D1B' }}>
                {usuario?.nombre || 'Dra. Mariela Yepez'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
              style={{ border: '1px solid #e0edf5', color: '#8D99AE' }}
            >
              Salir
            </button>
          </header>

          <div key={pagina} className="page-enter">
            {pagina === 'dashboard' && <Dashboard usuario={usuario} />}
            {pagina === 'citas' && <Citas />}
            {pagina === 'pacientes' && <Pacientes />}
            {pagina === 'doctores' && esAdmin && <Doctores />}
          </div>
        </div>
      </main>

      {/* ── Bottom nav móvil ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white md:hidden z-40 flex"
        style={{ borderTop: '1px solid #e0edf5', boxShadow: '0 -4px 20px rgba(0,0,0,0.07)' }}
      >
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPagina(id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all"
            style={{ color: pagina === id ? '#0077B6' : '#8D99AE' }}
          >
            <span style={{
              transform: pagina === id ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <Icon />
            </span>
            {label}
          </button>
        ))}
      </nav>

    </div>
  )
}
