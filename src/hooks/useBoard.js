import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const BOARD_KEY = 'maydash_board_id'
const BOARD_QUERY_KEY = 'board'

function getBoardIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get(BOARD_QUERY_KEY)
}

function syncBoardId(id) {
  localStorage.setItem(BOARD_KEY, id)

  const url = new URL(window.location.href)
  url.searchParams.set(BOARD_QUERY_KEY, id)
  window.history.replaceState({}, '', url)
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
      const existingBoardId = getBoardIdFromUrl() || localStorage.getItem(BOARD_KEY)

      if (!existingBoardId) {
        const { data, error } = await supabase
          .from('boards')
          .insert({ name: 'My board' })
          .select()
          .single()

        if (!active) {
          return
        }

        if (error || !data) {
          setError(error?.message || 'Could not create a Maydash board.')
          setLoading(false)
          return
        }

        syncBoardId(data.id)
        setBoard(data)
        setCreatedBoardId(data.id)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', existingBoardId)
        .single()

      if (!active) {
        return
      }

      if (error || !data) {
        localStorage.removeItem(BOARD_KEY)
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.delete(BOARD_QUERY_KEY)
        window.history.replaceState({}, '', currentUrl)

        const { data: fallbackBoard, error: createError } = await supabase
          .from('boards')
          .insert({ name: 'My board' })
          .select()
          .single()

        if (!active) {
          return
        }

        if (createError || !fallbackBoard) {
          setError(createError?.message || 'Could not load or create a Maydash board.')
          setLoading(false)
          return
        }

        syncBoardId(fallbackBoard.id)
        setBoard(fallbackBoard)
        setCreatedBoardId(fallbackBoard.id)
        setLoading(false)
        return
      }

      syncBoardId(data.id)
      setBoard(data)
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
    if (data) {
      setBoard(data)
    }

    return { ok: true, data }
  }

  return { board, loading, error, createdBoardId, updateBoardName }
}
