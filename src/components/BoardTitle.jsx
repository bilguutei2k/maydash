import { formatDistanceToNow } from 'date-fns'

export default function BoardTitle({ title, cardCount, lastUpdated, onAddCard }) {
  return (
    <div className="board-title-wrap">
      <div className="board-title-row">
        <h1 className="board-title">{title || 'MY BOARD'}</h1>
        <button type="button" className="primary-pill-btn add-card-btn" onClick={onAddCard}>
          ＋ ADD CARD
        </button>
      </div>
      <p className="board-meta">
        {lastUpdated
          ? `${cardCount} cards · last updated ${formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}`
          : 'no cards yet'}
      </p>
    </div>
  )
}
