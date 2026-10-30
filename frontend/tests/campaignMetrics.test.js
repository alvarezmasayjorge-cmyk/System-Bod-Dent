import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateCampaign } from '../src/lib/campaignMetrics.js'
const base = { spend: '1000', conversations: '200', booked: '50', attended: '35' }
test('WhatsApp funnel calculates costs, rates and remaining contacts', () => {
  const { metrics: m, errors } = calculateCampaign(base)
  assert.deepEqual(errors, {})
  assert.equal(m.conversationCost, 5)
  assert.equal(m.bookingCost, 20)
  assert.equal(m.attendanceCost, 1000 / 35)
  assert.equal(m.bookingRate, .25)
  assert.equal(m.attendanceRate, .7)
  assert.equal(m.totalRate, .175)
  assert.equal(m.notBooked, 150)
  assert.equal(m.notAttended, 15)
})
test('zero results have undefined ratios, not infinity or misleading zero costs', () => {
  const { metrics: m } = calculateCampaign({ spend: '100', conversations: '0', booked: '0', attended: '0' })
  for (const key of ['conversationCost', 'bookingCost', 'attendanceCost', 'bookingRate', 'attendanceRate', 'totalRate']) assert.equal(m[key], null)
  assert.equal(calculateCampaign({ ...base, spend: '0' }).metrics.conversationCost, 0)
})
test('invalid, incomplete and inconsistent funnels are rejected', () => {
  for (const patch of [{ spend: '' }, { spend: '-1' }, { spend: 'Infinity' }, { spend: 'NaN' }, { spend: '1000000000001' }, { conversations: '1.5' }, { booked: '201' }, { attended: '51' }]) {
    assert.equal(calculateCampaign({ ...base, ...patch }).metrics, null)
  }
})
test('decimal spending and zero conversion are supported', () => {
  const { metrics: m } = calculateCampaign({ ...base, spend: '10.50', booked: '0', attended: '0' })
  assert.equal(m.conversationCost, .0525)
  assert.equal(m.bookingRate, 0)
  assert.equal(m.bookingCost, null)
  assert.equal(m.attendanceRate, null)
})
