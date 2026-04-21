import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useElements(weekId, identity) {
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!weekId || !identity) return
    let cancelled = false

    async function load() {
      const { data, error: fetchError } = await supabase
        .from('elements')
        .select('*')
        .eq('week_id', weekId)
        .eq('author', identity)
        .order('z_index', { ascending: true })

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setElements(data || [])
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [weekId, identity])

  const addElement = useCallback(async (elementData) => {
    if (!weekId || !identity) return null

    const maxZ = elements.reduce((m, el) => Math.max(m, el.z_index), 0)

    const newElement = {
      week_id: weekId,
      author: identity,
      type: elementData.type || 'text',
      content: elementData.content || '',
      x: elementData.x || 0,
      y: elementData.y || 0,
      width: elementData.width || 200,
      height: elementData.height || 80,
      rotation: 0,
      z_index: maxZ + 1,
    }

    const { data, error: insertError } = await supabase
      .from('elements')
      .insert(newElement)
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return null
    }

    setElements(prev => [...prev, data])
    return data
  }, [weekId, identity, elements])

  const updateElement = useCallback(async (id, updates) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el))

    const { error: updateError } = await supabase
      .from('elements')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
    }
  }, [])

  const deleteElement = useCallback(async (id) => {
    setElements(prev => prev.filter(el => el.id !== id))

    const { error: deleteError } = await supabase
      .from('elements')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
    }
  }, [])

  const bringToFront = useCallback(async (id) => {
    const maxZ = elements.reduce((m, el) => Math.max(m, el.z_index), 0)
    await updateElement(id, { z_index: maxZ + 1 })
  }, [elements, updateElement])

  return { elements, loading, error, addElement, updateElement, deleteElement, bringToFront }
}
