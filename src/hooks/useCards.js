import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useCards(boardId, author) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(Boolean(boardId))
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchCards() {
      if (!boardId) {
        setCards([])
        setLoading(false)
        setError('')
        return
      }

      if (!supabase) {
        setCards([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('board_id', boardId)
        .eq('deleted', false)
        .order('position', { ascending: true })

      if (active) {
        if (error) {
          setError(error.message || 'Could not load cards from Supabase.')
        }
        setCards(data || [])
        setLoading(false)
      }
    }

    fetchCards()

    if (!boardId) {
      return undefined
    }

    if (!supabase) {
      return undefined
    }

    const channel = supabase
      .channel('cards-' + boardId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCards((prev) => {
              if (prev.find((card) => card.id === payload.new.id)) {
                return prev
              }

              return [...prev, payload.new].sort((a, b) => a.position - b.position)
            })
          }
          if (payload.eventType === 'UPDATE') {
            setCards((prev) =>
              prev
                .map((card) => (card.id === payload.new.id ? payload.new : card))
                .filter((card) => !card.deleted)
                .sort((a, b) => a.position - b.position)
            )
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [boardId])

  const addCard = useCallback(async (cardData) => {
    if (!supabase) {
      return { ok: false }
    }

    const maxPosition = cards.length ? Math.max(...cards.map((card) => card.position)) : -1

    const { data, error } = await supabase
      .from('cards')
      .insert({
        board_id: boardId,
        type: cardData.type,
        title: cardData.title,
        body: cardData.body,
        url: cardData.url,
        color: cardData.color,
        author,
        position: maxPosition + 1,
        deleted: false,
      })
      .select()
      .single()

    if (error || !data) {
      setError(error?.message || 'Could not save the new card.')
      return { ok: false, error }
    }

    setError('')
    if (data) {
      setCards((prev) => {
        if (prev.find((card) => card.id === data.id)) {
          return prev
        }

        return [...prev, data].sort((a, b) => a.position - b.position)
      })
    }
    return { ok: true, data }
  }, [author, boardId, cards])

  const updateCard = useCallback(async (id, updates) => {
    if (!supabase) {
      return { ok: false }
    }

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card)).sort((a, b) => a.position - b.position)
    )

    const { error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('updateCard error:', error)
      setError(error.message || 'Could not save card changes.')
      return { ok: false, error }
    }

    setError('')
    return { ok: true }
  }, [])

  const deleteCard = useCallback(async (id) => {
    if (!supabase) {
      return { ok: false }
    }

    const { data, error } = await supabase
      .from('cards')
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      setError(error?.message || 'Could not delete the card.')
      return { ok: false, error }
    }

    setError('')
    if (data) {
      setCards((prev) => prev.filter((card) => card.id !== id))
    }
    return { ok: true, data }
  }, [])

  const swapCards = useCallback(async (idA, idB) => {
    if (!supabase) {
      return { ok: false }
    }

    const cardA = cards.find((card) => card.id === idA)
    const cardB = cards.find((card) => card.id === idB)

    if (!cardA || !cardB) {
      return { ok: false }
    }

    const { error } = await supabase
      .from('cards')
      .upsert(
        [
          { ...cardA, position: cardB.position },
          { ...cardB, position: cardA.position },
        ],
        { onConflict: 'id' }
      )

    if (error) {
      setError(error.message || 'Could not reorder cards.')
      return { ok: false, error }
    }

    setError('')
    setCards((prev) =>
      prev
        .map((card) => {
          if (card.id === idA) {
            return { ...card, position: cardB.position }
          }

          if (card.id === idB) {
            return { ...card, position: cardA.position }
          }

          return card
        })
        .sort((a, b) => a.position - b.position)
    )
    return { ok: true }
  }, [cards])

  return { cards, loading, error, addCard, updateCard, deleteCard, swapCards }
}
