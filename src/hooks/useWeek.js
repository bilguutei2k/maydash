import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentWeek } from '../lib/week'

export function useWeek() {
  const [week, setWeek] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrCreateWeek() {
      const { week_number, year } = getCurrentWeek()

      const { data: existing, error: fetchError } = await supabase
        .from('weeks')
        .select('*')
        .eq('week_number', week_number)
        .eq('year', year)
        .maybeSingle()

      if (fetchError) {
        if (!cancelled) {
          setError(fetchError.message)
          setLoading(false)
        }
        return
      }

      if (existing) {
        if (!cancelled) {
          setWeek(existing)
          setLoading(false)
        }
        return
      }

      const { data: created, error: insertError } = await supabase
        .from('weeks')
        .insert({ week_number, year })
        .select()
        .single()

      if (insertError) {
        if (!cancelled) {
          setError(insertError.message)
          setLoading(false)
        }
        return
      }

      if (!cancelled) {
        setWeek(created)
        setLoading(false)
      }
    }

    loadOrCreateWeek()

    return () => { cancelled = true }
  }, [])

  return { week, loading, error }
}
