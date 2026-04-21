import { useState } from 'react'

const AUTH_KEY = 'dashletter_authed'

export default function PasswordScreen({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    if (password === import.meta.env.VITE_APP_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true')
      setShowError(false)
      onSuccess()
      return
    }

    setShowError(true)
    setPassword('')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5e400',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 'min(100%, 420px)',
          background: '#f5e400',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '28px',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '8px',
          }}
        >
          Enter password
        </h1>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.45)',
            marginBottom: '18px',
          }}
        >
          This board is private.
        </p>
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (showError) {
              setShowError(false)
            }
          }}
          autoFocus
          style={{
            border: '2px solid #1a1a1a',
            borderRadius: '12px',
            padding: '10px 14px',
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            background: 'transparent',
            width: '100%',
            outline: 'none',
            marginBottom: '12px',
          }}
        />
        {showError ? (
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#c47c7c',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            Incorrect password
          </p>
        ) : null}
        <button
          type="submit"
          style={{
            background: '#1a1a1a',
            color: '#f5e400',
            border: 'none',
            borderRadius: '20px',
            padding: '11px',
            fontFamily: "'Syne', sans-serif",
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          Enter →
        </button>
      </form>
    </div>
  )
}
