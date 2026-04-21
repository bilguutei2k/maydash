import { useState } from 'react'

export default function PasswordScreen({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const PASSWORD_A = import.meta.env.VITE_PASSWORD_A
  const PASSWORD_B = import.meta.env.VITE_PASSWORD_B

  function handleSubmit(e) {
    e.preventDefault()
    if (password === PASSWORD_A) {
      localStorage.setItem('dashletter_authed', 'true')
      localStorage.setItem('dashletter_identity', 'A')
      onSuccess('A')
    } else if (password === PASSWORD_B) {
      localStorage.setItem('dashletter_authed', 'true')
      localStorage.setItem('dashletter_identity', 'B')
      onSuccess('B')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>Private letters</div>
        <div style={styles.wordmarkWrap}>
          <div style={styles.wordmarkShadow}>dashletter</div>
          <div style={styles.wordmark}>dashletter</div>
        </div>
        <p style={styles.sub}>Enter your password</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.button}>
            Enter →
          </button>
          {error && (
            <div style={styles.error}>Incorrect password</div>
          )}
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--page-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Syne', sans-serif",
  },
  card: {
    background: 'var(--card-bg)',
    border: `2.5px solid var(--black)`,
    borderRadius: '24px',
    padding: '32px 28px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: 'var(--shadow-app)',
  },
  eyebrow: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: 'var(--pink-deep)',
    marginBottom: '8px',
  },
  wordmarkWrap: {
    position: 'relative',
    marginBottom: '10px',
    lineHeight: 1,
  },
  wordmarkShadow: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    fontSize: '40px',
    fontWeight: 800,
    color: 'var(--pink)',
    letterSpacing: '-.03em',
    lineHeight: 0.85,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  wordmark: {
    fontSize: '40px',
    fontWeight: 800,
    color: 'var(--black)',
    letterSpacing: '-.03em',
    lineHeight: 0.85,
    position: 'relative',
    zIndex: 1,
  },
  sub: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginTop: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    border: '2px solid var(--black)',
    borderRadius: '12px',
    padding: '11px 14px',
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    background: 'transparent',
    width: '100%',
    outline: 'none',
    color: 'var(--text-primary)',
  },
  button: {
    background: 'var(--black)',
    color: 'var(--pink)',
    border: 'none',
    borderRadius: '20px',
    padding: '12px',
    fontFamily: "'Syne', sans-serif",
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#c47c7c',
    textAlign: 'center',
    marginTop: '4px',
  },
}
