export const emptyCampaign = { name: '', currency: 'BOB', spend: '', conversations: '', booked: '', attended: '' }

export function calculateCampaign(input) {
  const fields = ['spend', 'conversations', 'booked', 'attended']
  const errors = {}
  const values = {}
  for (const field of fields) {
    const raw = String(input[field] ?? '').trim()
    const value = Number(raw)
    if (!raw) errors[field] = 'Completa este dato; escribe 0 si no hubo resultados.'
    else if (!Number.isFinite(value) || value < 0 || value > 1e12) errors[field] = 'Ingresa un número entre 0 y 1 billón.'
    else if (field !== 'spend' && !Number.isSafeInteger(value)) errors[field] = 'Ingresa una cantidad entera.'
    values[field] = value
  }
  if (!errors.booked && !errors.conversations && values.booked > values.conversations) errors.booked = 'Las citas no pueden superar las conversaciones.'
  if (!errors.attended && !errors.booked && values.attended > values.booked) errors.attended = 'Las asistencias no pueden superar las citas.'
  if (Object.keys(errors).length) return { errors, metrics: null }
  const { spend, conversations, booked, attended } = values
  const ratio = (a, b) => b > 0 ? a / b : null
  return { errors, metrics: {
    ...values,
    conversationCost: ratio(spend, conversations),
    bookingCost: ratio(spend, booked),
    attendanceCost: ratio(spend, attended),
    bookingRate: ratio(booked, conversations),
    attendanceRate: ratio(attended, booked),
    totalRate: ratio(attended, conversations),
    notBooked: conversations - booked,
    notAttended: booked - attended,
  } }
}
