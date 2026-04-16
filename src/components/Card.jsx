import { useEffect, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { COLOR_OPTIONS, WELCOME_CARD_COLOR } from '../constants/colors'

function getBgForColor(color) {
  const option = COLOR_OPTIONS.find((item) => item.hex === color)
  return option?.bg || 'var(--card-bg)'
}

export default function Card({ card, author, onDelete, onUpdate, onSwap, cards }) {
  const [editingField, setEditingField] = useState(null)
  const [editTitle, setEditTitle] = useState(card.title || '')
  const [editBody, setEditBody] = useState(card.body || '')
  const [isExiting, setIsExiting] = useState(false)
  const bodyInputRef = useRef(null)

  const cardIndex = cards.findIndex((item) => item.id === card.id)
  const previousCard = cardIndex > 0 ? cards[cardIndex - 1] : null
  const nextCard = cardIndex < cards.length - 1 ? cards[cardIndex + 1] : null
  const isWelcomeCard = card.color === WELCOME_CARD_COLOR
  const isEditable = card.author === author

  useEffect(() => {
    setEditTitle(card.title || '')
  }, [card.title])

  useEffect(() => {
    setEditBody(card.body || '')
  }, [card.body])

  useEffect(() => {
    if (editingField === 'body' && bodyInputRef.current) {
      bodyInputRef.current.style.height = 'auto'
      bodyInputRef.current.style.height = bodyInputRef.current.scrollHeight + 'px'
    }
  }, [editingField])

  async function saveTitle() {
    await onUpdate(card.id, { title: editTitle })
    setEditingField(null)
  }

  async function saveBody() {
    await onUpdate(card.id, { body: editBody })
    setEditingField(null)
  }

  function cancelTitleEdit() {
    setEditTitle(card.title || '')
    setEditingField(null)
  }

  function cancelBodyEdit() {
    setEditBody(card.body || '')
    setEditingField(null)
  }

  function startTitleEdit() {
    if (!isEditable) {
      return
    }

    setEditTitle(card.title || '')
    setEditingField('title')
  }

  function startBodyEdit() {
    if (!isEditable) {
      return
    }

    setEditBody(card.body || '')
    setEditingField('body')
  }

  function handleDelete() {
    setIsExiting(true)
    window.setTimeout(() => {
      onDelete(card.id)
    }, 300)
  }

  const cardStyle = isWelcomeCard
    ? {
        borderRadius: 'var(--radius-card)',
        border: '2px solid var(--yellow)',
        outline: '2px solid var(--black)',
        outlineOffset: '-4px',
        background: 'var(--welcome-card-bg)',
        padding: '13px 14px',
        animation: 'cardEnter 0.25s ease-out forwards',
      }
    : {
        borderRadius: 'var(--radius-card)',
        border: `2px solid ${card.color}`,
        background: getBgForColor(card.color),
        padding: '13px 14px',
        animation: 'cardEnter 0.25s ease-out forwards',
      }

  return (
    <div className={`card ${isExiting ? 'card-exit' : ''}`} style={cardStyle}>
      <p className="card-type-tag">{card.type.toUpperCase()}</p>

      {editingField === 'title' ? (
        <input
          autoFocus
          className="card-inline-title-input"
          style={{
            border: `2px solid ${isWelcomeCard ? 'var(--yellow)' : card.color}`,
            borderRadius: '8px',
            background: 'transparent',
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            width: '100%',
            padding: '4px 8px',
          }}
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              saveTitle()
            }

            if (event.key === 'Escape') {
              event.preventDefault()
              cancelTitleEdit()
            }
          }}
        />
      ) : card.title ? (
        <p className={`card-title ${isEditable ? 'card-text-editable' : 'card-text-static'}`} onClick={startTitleEdit}>
          {card.title}
        </p>
      ) : null}

      {card.type === 'image' && card.url ? (
        <>
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', marginBottom: '8px' }}
          >
            <img
              src={card.url}
              alt={card.title || 'image'}
              style={{
                width: '100%',
                borderRadius: '9px',
                display: 'block',
                cursor: 'zoom-in',
              }}
              onError={(event) => {
                event.target.style.display = 'none'
                event.target.closest('a').nextSibling.style.display = 'flex'
              }}
            />
          </a>
          <div className="image-fallback">Image unavailable</div>
        </>
      ) : null}

      {editingField === 'body' ? (
        <textarea
          ref={bodyInputRef}
          autoFocus
          className="card-inline-body-input"
          style={{
            border: `2px solid ${isWelcomeCard ? 'var(--yellow)' : card.color}`,
            borderRadius: '8px',
            background: 'transparent',
            fontFamily: "'Syne', sans-serif",
            fontSize: '12px',
            fontWeight: 400,
            width: '100%',
            resize: 'none',
            minHeight: '60px',
            lineHeight: 1.65,
          }}
          value={editBody}
          onChange={(event) => {
            setEditBody(event.target.value)
            event.target.style.height = 'auto'
            event.target.style.height = event.target.scrollHeight + 'px'
          }}
          onBlur={saveBody}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              cancelBodyEdit()
            }
          }}
        />
      ) : card.body ? (
        <p className={`card-body ${isEditable ? 'card-text-editable' : 'card-text-static'}`} onClick={startBodyEdit}>
          {card.body}
        </p>
      ) : null}

      {card.type === 'link' && card.url ? (
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div className="card-link-row">
            <div className="card-favicon" />
            <span className="card-link-text">{card.title || card.url} ↗</span>
          </div>
        </a>
      ) : null}

      <div className="card-meta-row">
        <div className="author-dot" style={{ background: isWelcomeCard ? 'var(--yellow)' : card.color }} />
        <span>{card.author === author ? 'you' : card.author}</span>
        <span>·</span>
        <span>{formatDistanceToNow(new Date(card.created_at), { addSuffix: true })}</span>
        <div className="card-meta-spacer" />
        <div className="card-actions">
          <button
            type="button"
            className="card-action-btn"
            disabled={!previousCard}
            onClick={() => previousCard && onSwap(card.id, previousCard.id)}
          >
            ↑
          </button>
          <button
            type="button"
            className="card-action-btn"
            disabled={!nextCard}
            onClick={() => nextCard && onSwap(card.id, nextCard.id)}
          >
            ↓
          </button>
          <button type="button" className="card-action-btn" onClick={handleDelete}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
