import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const BOARD_KEY = 'maydash_board_id'

export function useBoard(author) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(Boolean(author))

  useEffect(() => {
    let active = true

    async function loadBoard() {
      if (!author) {
        setBoard(null)
        setLoading(false)
        return
      }

      if (!supabase) {
        setLoading(false)
        return
      }

      setLoading(true)
      const existingBoardId = localStorage.getItem(BOARD_KEY)

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
          setLoading(false)
          return
        }

        localStorage.setItem(BOARD_KEY, data.id)
        setBoard(data)
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

        const { data: fallbackBoard, error: createError } = await supabase
          .from('boards')
          .insert({ name: 'My board' })
          .select()
          .single()

        if (!active) {
          return
        }

        if (createError || !fallbackBoard) {
          setLoading(false)
          return
        }

        localStorage.setItem(BOARD_KEY, fallbackBoard.id)
        setBoard(fallbackBoard)
        setLoading(false)
        return
      }

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
      return
    }

    if (!supabase) {
      return
    }

    const { data } = await supabase
      .from('boards')
      .update({ name: name.trim() })
      .eq('id', board.id)
      .select()
      .single()

    if (data) {
      setBoard(data)
    }
  }

  return { board, loading, updateBoardName }
}
