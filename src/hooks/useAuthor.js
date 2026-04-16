import { useState } from 'react'

const KEY = 'maydash_author_name'

export function useAuthor() {
  const [author, setAuthorState] = useState(() => localStorage.getItem(KEY))

  function setAuthor(name) {
    localStorage.setItem(KEY, name)
    setAuthorState(name)
  }

  return { author, setAuthor }
}
