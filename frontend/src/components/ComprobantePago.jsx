// ┌──────────────────────────────────────────────────────────┐
// │  COMPROBANTE / BOUCHER DE PAGO DE LA DOCTORA              │
// │  Edita las constantes de abajo para actualizar el pago.   │
// └──────────────────────────────────────────────────────────┘

// Muestra el banner en el Dashboard + el comprobante.
export const RECORDATORIO_PAGO_ACTIVO = true
// Interruptor futuro: si lo pones en true, el comprobante se vuelve
// un bloqueo total del sistema (no se puede cerrar).
export const BLOQUEAR_POR_PAGO = true

const DIA_PAGO   = 30          // día del mes en que vence el pago
const DIAS_ANTES = 1           // a partir de cuántos días antes se auto-muestra (29-30)
const WHATSAPP   = '72677214'  // mismo número que BloqueoFacturacion (App.jsx)

const CONCEPTOS = [
  { label: 'Mensualidad del sistema', monto: 300 },
  { label: 'Pago pendiente',          monto: 1000 },
]

const TOTAL = CONCEPTOS.reduce((acc, c) => acc + c.monto, 0)

const bs = (n) => `Bs ${n.toLocaleString('es-BO')}`

const mensajeWhatsApp = encodeURIComponent(
  `Hola, quiero coordinar el pago de ${bs(TOTAL)} (mensualidad + pago pendiente).`
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${mensajeWhatsApp}`

// Devuelve true si el recordatorio está activo y ya estamos en la ventana de pago.
export const debeAutoMostrar = () =>
  RECORDATORIO_PAGO_ACTIVO && new Date().getDate() >= DIA_PAGO - DIAS_ANTES

/* ── Ícono de teléfono (reutilizado de BloqueoFacturacion) ── */
const IconTelefono = ({ color = '#0077B6' }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const IconRecibo = ({ color = '#e6a817' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1L4 2z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

/* ── Tarjeta de contacto WhatsApp (reutilizada de BloqueoFacturacion) ── */
const TarjetaContacto = () => (
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
      ¿Cómo pagar?
    </p>
    <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.55', marginBottom: '0.85rem' }}>
      Comunícate con el siguiente número para coordinar tu pago:
    </p>
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#25D366',
        color: '#fff',
        fontWeight: '600',
        fontSize: '0.9rem',
        padding: '0.6rem 1.1rem',
        borderRadius: '10px',
        textDecoration: 'none',
        boxShadow: '0 2px 10px rgba(37,211,102,0.35)',
      }}
    >
      <IconTelefono color="#fff" />
      Escribir al 7267-7214
    </a>
    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.6rem' }}>
      WhatsApp o llamada directa
    </p>
  </div>
)

/* ── Desglose de conceptos + total ── */
const Desglose = () => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #eef2f6',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      marginBottom: '1.5rem',
      textAlign: 'left',
    }}
  >
    {CONCEPTOS.map((c, i) => (
      <div
        key={c.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.7rem 0',
          borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#475569' }}>{c.label}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1D1D1B', whiteSpace: 'nowrap' }}>
          {bs(c.monto)}
        </span>
      </div>
    ))}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 0 0.6rem',
        borderTop: '2px solid #eef2f6',
        marginTop: '0.2rem',
      }}
    >
      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8D99AE' }}>
        Total a pagar
      </span>
      <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0077B6', whiteSpace: 'nowrap' }}>
        {bs(TOTAL)}
      </span>
    </div>
  </div>
)

/* ── Contenido compartido por el comprobante y el bloqueo ── */
const ContenidoComprobante = ({ bloqueante = false, onClose }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '20px',
      maxWidth: '460px',
      width: '100%',
      padding: '2.25rem 1.75rem 1.75rem',
      boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
      textAlign: 'center',
      animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)',
      maxHeight: '92vh',
      overflowY: 'auto',
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Ícono */}
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFF8D6, #FFE89A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem',
        boxShadow: '0 4px 20px rgba(230,168,23,0.18)',
      }}
    >
      <IconRecibo />
    </div>

    {/* Título */}
    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1D1D1B', marginBottom: '0.35rem', lineHeight: '1.3' }}>
      Comprobante de pago
    </h2>
    <p style={{ fontSize: '0.85rem', color: '#8D99AE', marginBottom: '1.25rem' }}>
      Vencimiento: día <strong style={{ color: '#dc2626' }}>{DIA_PAGO}</strong> de cada mes
    </p>

    {/* Línea decorativa */}
    <div
      style={{
        width: '50px',
        height: '3px',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, #FFDD00, #E6C700)',
        margin: '0 auto 1.5rem',
      }}
    />

    <Desglose />
    <TarjetaContacto />

    {bloqueante ? (
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
        Servicio suspendido hasta regularizar el pago
      </div>
    ) : (
      <button className="btn-ghost" onClick={onClose} style={{ width: '100%' }}>
        Cerrar
      </button>
    )}
  </div>
)

/* ── Comprobante modal (descartable) ── */
export default function ComprobantePago({ abierto, onClose }) {
  if (!abierto) return null
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <ContenidoComprobante onClose={onClose} />
    </div>
  )
}

/* ── Banner para el Dashboard ── */
export function BannerPago({ onAbrir }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        borderLeft: '4px solid #FFDD00',
        background: 'linear-gradient(90deg, #FFFCEB 0%, #ffffff 60%)',
        animation: 'fadeInUp 0.4s both',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: '#FFF8D6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconRecibo />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1D1D1B' }}>
          Tu pago vence el día {DIA_PAGO}
        </p>
        <p style={{ fontSize: '0.8rem', color: '#8D99AE', marginTop: '0.1rem' }}>
          Total pendiente: <strong style={{ color: '#0077B6' }}>{bs(TOTAL)}</strong>
        </p>
      </div>
      <button className="btn-primary" onClick={onAbrir} style={{ flexShrink: 0 }}>
        Ver comprobante
      </button>
    </div>
  )
}

/* ── Variante bloqueante (interruptor futuro) ── */
export function BloqueoPago() {
  return (
    <div
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
      <ContenidoComprobante bloqueante />
    </div>
  )
}
