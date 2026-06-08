import { useState, useEffect } from 'react'

const getDiaSemana = (fechaStr) => {
  if (!fechaStr) return '';
  try {
    const [datePart] = fechaStr.split('T');
    if (!datePart) return '';
    const [year, month, day] = datePart.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch(e) {
    return '';
  }
}

const ESTADOS = [
  { value: 'agendo',      label: 'Agendó'      },
  { value: 'confirmo',    label: 'Confirmó'    },
  { value: 'asistio',     label: 'Asistió'     },
  { value: 'reprogramo',  label: 'Reprogramó'  },
  { value: 'cancelo',     label: 'Canceló'     },
]

const DURACIONES = [
  { value: 15,  label: '15 min' },
  { value: 30,  label: '30 min' },
  { value: 45,  label: '45 min' },
  { value: 60,  label: '1 hora' },
  { value: 90,  label: '1 hora 30 min' },
  { value: 120, label: '2 horas' },
]

export default function FormCita({ cita, pacientes, doctores = [], esAdmin = false, fechaInicial, onGuardar, onEliminar, onCancelar }) {
  const [form, setForm] = useState({
    pacienteId: '',
    fecha:      '',
    motivo:     '',
    estado:     'agendo',
    duracion:   30,
    doctorId:   '',
  })

  useEffect(() => {
    if (cita) {
      const dateObj = new Date(cita.fecha);
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);

      setForm({
        pacienteId: cita.pacienteId,
        fecha:      localISOTime,
        motivo:     cita.motivo,
        estado:     cita.estado,
        duracion:   cita.duracion || 30,
        doctorId:   cita.doctorId || '',
      })
    } else if (fechaInicial) {
      let initial = fechaInicial;
      if (initial.length === 10) {
        initial += 'T09:00';
      } else {
        initial = initial.slice(0, 16);
      }
      setForm(f => ({ ...f, fecha: initial }))
    }
  }, [cita, fechaInicial])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => { 
    e.preventDefault(); 
    
    // Extraer componentes para evitar bugs de zona horaria en diferentes navegadores (ej. Safari)
    // donde "YYYY-MM-DDTHH:mm" se puede interpretar como UTC en lugar de hora local.
    const [datePart, timePart] = form.fecha.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    // Al pasar los argumentos separados, Date SIEMPRE asume que es la hora local del navegador.
    const localDate = new Date(year, month - 1, day, hour, minute);
    
    const dataToSave = { ...form, fecha: localDate.toISOString() };
    onGuardar(dataToSave);
  }

  return (
    <div
      className="card rounded-2xl p-4 md:p-6"
      style={{ animation: 'fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1)', borderTop: '3px solid #0077B6' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="font-semibold" style={{ color: '#1D1D1B', fontFamily: "'Bell MT', serif" }}>
          {cita ? 'Editar cita' : 'Nueva cita'}
        </h2>
        {cita && (
          <button
            onClick={() => onEliminar(cita.id)}
            className="btn-danger text-xs px-3 py-2 w-full sm:w-auto"
          >
            Eliminar cita
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Paciente</label>
          <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required className="input">
            <option value="">Seleccionar paciente…</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Fecha y hora</label>
          <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} required className="input" />
          {form.fecha && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl" style={{ background: '#e0f2fe', border: '1px solid #a8d8ea' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-sm font-semibold capitalize" style={{ color: '#005F8A' }}>
                {getDiaSemana(form.fecha)}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="form-label">Motivo</label>
          <input name="motivo" value={form.motivo} onChange={handleChange} required className="input" placeholder="Ej: Limpieza dental" />
        </div>

        <div>
          <label className="form-label">Duración</label>
          <select name="duracion" value={form.duracion} onChange={handleChange} className="input">
            {DURACIONES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {esAdmin && doctores.length > 0 && (
          <div className="md:col-span-2">
            <label className="form-label">Doctor asignado</label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange} className="input">
              <option value="">Sin asignar</option>
              {doctores.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="form-label">Estado</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ESTADOS.map(e => (
              <button
                key={e.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, estado: e.value }))}
                className="py-3 px-3 md:py-2 rounded-xl text-xs font-semibold text-left transition-all"
                style={{
                  border: form.estado === e.value ? '2px solid #0077B6' : '2px solid #e5e7e5',
                  background: form.estado === e.value ? '#e0f2fe' : '#fff',
                  color: form.estado === e.value ? '#0077B6' : '#B2B2B2',
                  minHeight: '44px',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-1">
          <button type="button" onClick={onCancelar} className="btn-ghost w-full sm:w-auto">Cancelar</button>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            {cita ? 'Guardar cambios' : 'Crear cita'}
          </button>
        </div>
      </form>
    </div>
  )
}
