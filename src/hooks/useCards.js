import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useCards(boardId, author) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(Boolean(boardId))

  useEffect(() => {
    let active = true

    async function fetchCards() {
      if (!boardId) {
        setCards([])
        setLoading(false)
        return
      }

      if (!supabase) {
        setCards([])
        setLoading(false)
        return
      }

      setLoading(true)

      const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('board_id', boardId)
        .eq('deleted', false)
        .order('position', { ascending: true })

      if (active) {
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
      return
    }

    const maxPosition = cards.length ? Math.max(...cards.map((card) => card.position)) : -1

    const { data } = await supabase
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

    if (data) {
      setCards((prev) => {
        if (prev.find((card) => card.id === data.id)) {
          return prev
        }

        return [...prev, data].sort((a, b) => a.position - b.position)
      })
    }
  }, [author, boardId, cards])

  const updateCard = useCallback(async (id, updates) => {
    if (!supabase) {
      return
    }

    const { data } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? data : card)).sort((a, b) => a.position - b.position)
      )
    }
  }, [])

  const deleteCard = useCallback(async (id) => {
    if (!supabase) {
      return
    }

    const { data } = await supabase
      .from('cards')
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setCards((prev) => prev.filter((card) => card.id !== id))
    }
  }, [])

  const swapCards = useCallback(async (idA, idB) => {
    if (!supabase) {
      return
    }

    const cardA = cards.find((card) => card.id === idA)
    const cardB = cards.find((card) => card.id === idB)

    if (!cardA || !cardB) {
      return
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

    if (!error) {
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
    }
  }, [cards])

  return { cards, loading, addCard, updateCard, deleteCard, swapCards }
}
