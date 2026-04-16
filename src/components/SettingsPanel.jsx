import { useEffect, useState } from 'react'

export default function SettingsPanel({ board, onSave, onClose }) {
  const [name, setName] = useState(board?.name || '')

  useEffect(() => {
    setName(board?.name || '')
  }, [board?.name])

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    onSave(name.trim())
    onClose()
  }

  return (
    <form className="settings-panel" onSubmit={handleSubmit}>
      <label className="settings-label">BOARD NAME</label>
      <input
        className="settings-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit" className="primary-pill-btn settings-save-btn">
        SAVE
      </button>
    </form>
  )
}
