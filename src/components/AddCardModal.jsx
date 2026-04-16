import { useEffect, useState } from 'react'
import ColorPicker from './ColorPicker'
import { DEFAULT_CARD_COLOR } from '../constants/colors'

export default function AddCardModal({ onClose, onSubmit }) {
  const [type, setType] = useState('note')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState(DEFAULT_CARD_COLOR)
  const [error, setError] = useState('')

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  function resetForType(nextType) {
    setType(nextType)
    setTitle('')
    setBody('')
    setUrl('')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (type === 'note' && !body.trim()) {
      setError('A note needs body text.')
      return
    }

    if (type === 'image' && !url.trim()) {
      setError('An image card needs an image URL.')
      return
    }

    if (type === 'link' && (!title.trim() || !url.trim())) {
      setError('A link card needs both a title and a URL.')
      return
    }

    onSubmit({
      type,
      title: title.trim() || null,
      body: body.trim() || null,
      url: url.trim() || null,
      color,
    })
    onClose()
  }

  function autosize(event, setter) {
    setter(event.target.value)
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 'px'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-card-modal" onClick={(event) => event.stopPropagation()}>
        <form className="add-card-form" onSubmit={handleSubmit}>
          <div className="type-selector">
            {['note', 'image', 'link'].map((option) => (
              <button
                key={option}
                type="button"
                className={`type-pill ${type === option ? 'selected' : ''}`}
                onClick={() => resetForType(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="field-group">
            <span className="field-label">{type === 'link' ? 'TITLE' : 'TITLE'}</span>
            <input
              className="modal-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={type === 'link' ? 'Required title' : 'Optional title'}
            />
          </label>

          {type === 'note' ? (
            <label className="field-group">
              <span className="field-label">NOTE</span>
              <textarea
                className="modal-textarea"
                value={body}
                onChange={(event) => autosize(event, setBody)}
                placeholder="Write your idea"
              />
            </label>
          ) : null}

          {type === 'image' ? (
            <>
              <label className="field-group">
                <span className="field-label">IMAGE URL</span>
                <input
                  className="modal-input"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label className="field-group">
                <span className="field-label">CAPTION</span>
                <textarea
                  className="modal-textarea"
                  value={body}
                  onChange={(event) => autosize(event, setBody)}
                  placeholder="Optional caption"
                />
              </label>
            </>
          ) : null}

          {type === 'link' ? (
            <label className="field-group">
              <span className="field-label">LINK URL</span>
              <input
                className="modal-input"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://..."
              />
            </label>
          ) : null}

          <div className="field-group">
            <span className="field-label">CARD COLOR</span>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {error ? <p className="modal-error">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-pill-btn" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="primary-pill-btn">
              ADD CARD
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
