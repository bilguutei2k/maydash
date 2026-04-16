import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function normalizeMaydashUrl() {
  const url = new URL(window.location.href)
  if (url.search || url.hash) {
    url.search = ''
    url.hash = ''
    window.history.replaceState({}, '', url)
  }
}

export function useBoard(author) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(Boolean(author))
  const [error, setError] = useState('')
  const [createdBoardId, setCreatedBoardId] = useState(null)

  useEffect(() => {
    let active = true

    async function loadBoard() {
      if (!author) {
        setBoard(null)
        setLoading(false)
        setError('')
        setCreatedBoardId(null)
        return
      }

      if (!supabase) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setCreatedBoardId(null)
      normalizeMaydashUrl()

      const { data: existingBoards, error: fetchError } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)

      if (!active) {
        return
      }

      if (fetchError) {
        setError(fetchError.message || 'Could not load the Maydash board.')
        setLoading(false)
        return
      }

      const existingBoard = existingBoards?.[0]

      if (existingBoard) {
        setBoard(existingBoard)
        setLoading(false)
        return
      }

      const { data: createdBoard, error: createError } = await supabase
        .from('boards')
        .insert({ name: 'My board' })
        .select()
        .single()

      if (!active) {
        return
      }

      if (createError || !createdBoard) {
        setError(createError?.message || 'Could not create the Maydash board.')
        setLoading(false)
        return
      }

      setBoard(createdBoard)
      setCreatedBoardId(createdBoard.id)
      setLoading(false)
    }

    loadBoard()

    return () => {
      active = false
    }
  }, [author])

  async function updateBoardName(name) {
    if (!board?.id || !name.trim()) {
      return { ok: false }
    }

    if (!supabase) {
      return { ok: false }
    }

    const { data, error } = await supabase
      .from('boards')
      .update({ name: name.trim() })
      .eq('id', board.id)
      .select()
      .single()

    if (error || !data) {
      setError(error?.message || 'Could not save the board name.')
      return { ok: false, error }
    }

    setError('')
    setBoard(data)
    return { ok: true, data }
  }

  return { board, loading, error, createdBoardId, updateBoardName }
}
