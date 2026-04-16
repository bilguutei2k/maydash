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
  const { board, loading: boardLoading, error: boardError, createdBoardId, updateBoardName } = useBoard(author)
  const { cards, loading: cardsLoading, error: cardsError, addCard, updateCard, deleteCard, swapCards } = useCards(board?.id, author)

  useEffect(() => {
    setNeedsWelcomeCard(Boolean(author) && Boolean(createdBoardId))
  }, [author, createdBoardId])

  useEffect(() => {
    async function insertWelcomeCard() {
      if (!board?.id || !author || !needsWelcomeCard || welcomeCardInserted.current || createdBoardId !== board.id) {
        return
      }

      welcomeCardInserted.current = true
      const result = await addCard({
        type: 'note',
        title: 'Welcome to Maydash',
        body: 'This is your shared brainstorm board. Add notes, images, and links. Share the link with a collaborator.',
        color: WELCOME_CARD_COLOR,
        url: null,
      })
      if (result?.ok) {
        setNeedsWelcomeCard(false)
      } else {
        welcomeCardInserted.current = false
      }
    }

    insertWelcomeCard()
  }, [addCard, author, board?.id, createdBoardId, needsWelcomeCard])

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

  const saveError = boardError || cardsError

  async function copyLink() {
    const shareUrl = new URL(window.location.href)
    if (board?.id) {
      shareUrl.searchParams.set('board', board.id)
    }

    await navigator.clipboard.writeText(shareUrl.toString())
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
        {saveError ? <div className="save-error-banner">{saveError}</div> : null}
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
