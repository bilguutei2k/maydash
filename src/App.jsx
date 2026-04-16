import { useEffect, useMemo, useRef, useState } from 'react'
import Topbar from './components/Topbar'
import BoardTitle from './components/BoardTitle'
import CardGrid from './components/CardGrid'
import AddCardModal from './components/AddCardModal'
import SettingsPanel from './components/SettingsPanel'
import NameEntryScreen from './components/NameEntryScreen'
import { useAuthor } from './hooks/useAuthor'
import { useBoard } from './hooks/useBoard'
import { useCards } from './hooks/useCards'
import { WELCOME_CARD_COLOR } from './constants/colors'
import { hasSupabaseEnv } from './lib/supabase'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [needsWelcomeCard, setNeedsWelcomeCard] = useState(false)
  const copyTimerRef = useRef(null)
  const welcomeCardInserted = useRef(false)
  const { author, setAuthor } = useAuthor()
  const { board, loading: boardLoading, updateBoardName } = useBoard(author)
  const { cards, loading: cardsLoading, addCard, updateCard, deleteCard, swapCards } = useCards(board?.id, author)

  useEffect(() => {
    const authorName = localStorage.getItem('maydash_author_name')
    const boardId = localStorage.getItem('maydash_board_id')
    setNeedsWelcomeCard(Boolean(authorName) && !boardId)
  }, [author])

  useEffect(() => {
    async function insertWelcomeCard() {
      if (!board?.id || !author || !needsWelcomeCard || welcomeCardInserted.current) {
        return
      }

      welcomeCardInserted.current = true
      await addCard({
        type: 'note',
        title: 'Welcome to Maydash',
        body: 'This is your shared brainstorm board. Add notes, images, and links. Share the link with a collaborator.',
        color: WELCOME_CARD_COLOR,
        url: null,
      })
      setNeedsWelcomeCard(false)
    }

    insertWelcomeCard()
  }, [addCard, author, board?.id, needsWelcomeCard])

  useEffect(() => () => {
    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  const lastCard = useMemo(() => {
    if (!cards.length) {
      return null
    }

    return [...cards].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
  }, [cards])

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current)
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  if (!author) {
    return <NameEntryScreen onSubmit={setAuthor} />
  }

  if (!hasSupabaseEnv) {
    return (
      <div className="name-entry-screen">
        <div className="name-entry-card">
          <h1 className="name-entry-title">Maydash needs Supabase setup</h1>
          <p className="name-entry-subtext">
            Replace the placeholder values in <code>.env</code> with your real Supabase URL and anon key, then restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      <div className="app-shell">
        <Topbar
          onSettingsClick={() => setSettingsOpen((current) => !current)}
          copyLink={copyLink}
          copied={copied}
        />
        {settingsOpen && <SettingsPanel board={board} onSave={updateBoardName} onClose={() => setSettingsOpen(false)} />}
        <div className="board-area">
          <BoardTitle title={board?.name} cardCount={cards.length} lastUpdated={lastCard?.created_at} onAddCard={() => setModalOpen(true)} />
          <div className="grid-area">
            <CardGrid
              cards={cards}
              loading={boardLoading || cardsLoading}
              author={author}
              onDelete={deleteCard}
              onUpdate={updateCard}
              onSwap={swapCards}
            />
          </div>
        </div>
      </div>
      {modalOpen && <AddCardModal onClose={() => setModalOpen(false)} onSubmit={addCard} />}
    </div>
  )
}
