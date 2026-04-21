import { useState } from 'react'
import PasswordScreen from './components/PasswordScreen'

export default function App() {
  const [authed, setAuthed] = useState(
    localStorage.getItem('dashletter_authed') === 'true'
  )

  if (!authed) {
    return <PasswordScreen onSuccess={() => setAuthed(true)} />
  }

  return (
    <div style={{ padding: '40px', fontFamily: "'Syne', sans-serif" }}>
      <h1>dashletter</h1>
      <p>Foundation ready. Build the canvas next.</p>
    </div>
  )
}
