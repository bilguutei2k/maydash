import { useState } from 'react'

export default function NameEntryScreen({ onSubmit }) {
  const [name, setName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    onSubmit(name.trim())
  }

  return (
    <div className="name-entry-screen">
      <form className="name-entry-card" onSubmit={handleSubmit}>
        <h1 className="name-entry-title">What's your name?</h1>
        <p className="name-entry-subtext">We'll use this to tag your cards.</p>
        <input
          className="name-entry-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoFocus
        />
        <button type="submit" className="primary-pill-btn name-entry-btn">
          LET'S GO →
        </button>
      </form>
    </div>
  )
}
