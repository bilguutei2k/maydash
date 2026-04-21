// Returns ISO week number for a given date (1-53)
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return weekNum
}

export function getCurrentWeek() {
  const now = new Date()
  return {
    week_number: getWeekNumber(now),
    year: now.getFullYear(),
  }
}

export function isSunday() {
  return new Date().getDay() === 0
}
