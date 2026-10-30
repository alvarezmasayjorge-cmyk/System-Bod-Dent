import { calculateCampaign, emptyCampaign } from '../lib/campaignMetrics'
import './Campanas.css'

const fields = [
  ['spend', 'Inversión publicitaria', 'Total invertido en esta campaña.', '0.01'],
  ['conversations', 'Conversaciones iniciadas', 'Contactos que llegaron por WhatsApp.', '1'],
  ['booked', 'Citas agendadas', 'De esas conversaciones, cuántas agendaron.', '1'],
  ['attended', 'Asistencias a la cita', 'De esas citas, cuántas se concretaron.', '1'],
]

export default function Campanas({ campaign, onChange }) {
  const { errors, metrics: m } = calculateCampaign(campaign)
  const money = value => value == null ? '—' : new Intl.NumberFormat('es-BO', { style: 'currency', currency: campaign.currency, maximumFractionDigits: 2 }).format(value)
  const percent = value => value == null ? '—' : new Intl.NumberFormat('es-BO', { style: 'percent', maximumFractionDigits: 1 }).format(value)
  const count = value => value == null ? '—' : new Intl.NumberFormat('es-BO').format(value)
  const update = (key, value) => onChange({ ...campaign, [key]: value })
  const example = () => onChange({ name: 'Ejemplo · Sonrisas por WhatsApp', currency: campaign.currency, spend: '1000', conversations: '200', booked: '50', attended: '35' })
  const cards = [
    ['01', 'Costo por conversación', m?.conversationCost, 'Inversión ÷ conversaciones', 'blue'],
    ['02', 'Costo por cita agendada', m?.bookingCost, 'Inversión ÷ citas agendadas', 'green'],
    ['03', 'Costo por asistencia', m?.attendanceCost, 'Inversión ÷ asistencias', 'yellow'],
  ]
  const stages = [
    ['Conversaciones', m?.conversations, m && m.conversations > 0 ? 1 : 0, 'Conversaciones iniciadas en WhatsApp'],
    ['Citas agendadas', m?.booked, m?.bookingRate ?? 0, `${percent(m?.bookingRate)} de las conversaciones`],
    ['Asistencias', m?.attended, m?.totalRate ?? 0, `${percent(m?.attendanceRate)} de las citas agendadas`],
  ]
  return (
    <section className="campaign-page">
      <header className="campaign-heading">
        <div><p className="campaign-eyebrow">MARKETING · RESULTADOS</p><h1>De un mensaje a una sonrisa.</h1><p>Descubre cómo se convierten tus campañas en citas reales.</p></div>
        <span className="campaign-channel"><span aria-hidden="true">●</span> Embudo WhatsApp</span>
      </header>
      <div className="campaign-layout">
        <section className="campaign-inputs" aria-labelledby="campaign-data-title">
          <div className="campaign-panel-heading"><span className="campaign-icon" aria-hidden="true">↗</span><div><h2 id="campaign-data-title">Tu campaña, en números</h2><p>Ingresa los datos del mismo grupo de contactos.</p></div></div>
          <label className="campaign-label" htmlFor="campaign-name">Nombre de la campaña <span>· opcional</span></label>
          <input id="campaign-name" className="campaign-input" value={campaign.name} maxLength={100} placeholder="Ej. Valoración dental · Octubre" onChange={e => update('name', e.target.value)} />
          <label className="campaign-label" htmlFor="campaign-currency">Moneda de la inversión</label>
          <select id="campaign-currency" className="campaign-input" value={campaign.currency} onChange={e => update('currency', e.target.value)}><option value="BOB">BOB · Bolivianos</option><option value="USD">USD · Dólares</option></select>
          <p className="campaign-hint">Selecciona la moneda de tus datos; no convierte importes.</p>
          {fields.map(([key, label, hint, step], i) => {
            const showError = campaign[key] !== '' && errors[key]
            return <div className="campaign-field" key={key}>
              <label className="campaign-label" htmlFor={`campaign-${key}`}><span className="campaign-step">{i + 1}</span>{label}</label>
              <input id={`campaign-${key}`} className="campaign-input campaign-number" type="number" inputMode={key === 'spend' ? 'decimal' : 'numeric'} min="0" max="1000000000000" step={step} placeholder="0" value={campaign[key]} onChange={e => update(key, e.target.value)} aria-invalid={!!showError} aria-describedby={`campaign-${key}-hint`} />
              <p id={`campaign-${key}-hint`} className={showError ? 'campaign-error' : 'campaign-hint'}>{showError || hint}</p>
            </div>
          })}
          <div className="campaign-actions"><button type="button" onClick={example}>Probar ejemplo</button><button type="button" onClick={() => onChange({ ...emptyCampaign })}>Limpiar</button></div>
          <p className="campaign-local-note">Cálculo manual. Los datos se conservan al cambiar de sección, hasta recargar o cerrar sesión.</p>
        </section>
        <div className="campaign-results">
          <div className="campaign-results-title"><h2>{campaign.name || 'Así rinde tu campaña'}</h2><span>Resultados en vivo</span></div>
          {!m && <p className="campaign-status" role="status">{Object.entries(errors).some(([key]) => campaign[key] !== '') ? 'Revisa los datos señalados para calcular los resultados.' : 'Completa los cuatro datos o prueba el ejemplo para ver tu embudo.'}</p>}
          <div className="campaign-costs" aria-live="polite">
            {cards.map(([number, label, value, formula, color]) => <article className={`campaign-cost ${color}`} key={number}><div className="campaign-cost-top"><span>{number}</span><span aria-hidden="true">↗</span></div><h3>{label}</h3><strong>{money(value)}</strong><p>{formula}</p></article>)}
          </div>
          <section className="campaign-funnel" aria-labelledby="campaign-funnel-title">
            <div className="campaign-funnel-head"><div><p className="campaign-eyebrow">EL RECORRIDO DE TUS CONTACTOS</p><h2 id="campaign-funnel-title">Tu embudo de conversión</h2></div><div className="campaign-total"><strong>{percent(m?.totalRate)}</strong><span>conversión total</span></div></div>
            <div className="campaign-stages">
              {stages.map(([label, value, rate, detail], i) => <div className="campaign-stage" key={label}><div className="campaign-stage-label"><span><b>0{i + 1}</b> {label}</span><strong>{count(value)}</strong></div><div className="campaign-track"><div className={`campaign-fill fill-${i}`} style={{ width: `${rate * 100}%` }} /></div><p>{detail}</p></div>)}
            </div>
            <div className="campaign-conversions"><div><span>Conversación → cita</span><strong>{percent(m?.bookingRate)}</strong></div><div><span>Cita → asistencia</span><strong>{percent(m?.attendanceRate)}</strong></div></div>
          </section>
          <div className="campaign-opportunities"><span className="campaign-opportunity-icon" aria-hidden="true">◎</span><div><h3>Oportunidades de seguimiento</h3><p>{m ? <><strong>{count(m.notBooked)}</strong> conversaciones sin cita agendada y <strong>{count(m.notAttended)}</strong> citas sin asistencia registrada.</> : 'Aquí verás cuántos contactos quedan entre una etapa y la siguiente.'}</p><small>Las citas sin asistencia pueden estar pendientes o canceladas. No equivalen necesariamente a ausencias.</small></div></div>
          <p className="campaign-footnote">Cuenta cada contacto una sola vez en cada etapa. Usa las citas y asistencias de las conversaciones que incluiste, aunque hayan ocurrido después. “—” significa que faltan datos o que el divisor es cero.</p>
        </div>
      </div>
    </section>
  )
}
