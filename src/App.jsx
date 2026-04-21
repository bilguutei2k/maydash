import { useState } from 'react'
import PasswordScreen from './components/PasswordScreen'
import LetterShell from './components/LetterShell'

export default function App() {
  const [authed, setAuthed] = useState(
    localStorage.getItem('dashletter_authed') === 'true'
  )
  const [identity, setIdentity] = useState(
    localStorage.getItem('dashletter_identity')
  )

  function handleSuccess(id) {
    setAuthed(true)
    setIdentity(id)
  }

  if (!authed || !identity) {
    return <PasswordScreen onSuccess={handleSuccess} />
  }

  return <LetterShell identity={identity} />
}
