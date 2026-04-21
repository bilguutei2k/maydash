import { useState, useRef, useEffect } from 'react'

export default function TextElement({
  element,
  canvasWidth,
  canvasHeight,
  onUpdate,
  onDelete,
  onBringToFront,
}) {
  const [isEditing, setIsEditing] = useState(element.content === '')
  const [text, setText] = useState(element.content)
  const [hovering, setHovering] = useState(false)
  const elementRef = useRef(null)
  const textareaRef = useRef(null)

  const dragState = useRef(null)
  const resizeState = useRef(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  function handleMouseDown(e) {
    if (isEditing) return
    if (e.target.dataset.handle) return
    if (e.target.dataset.delete) return

    e.stopPropagation()
    onBringToFront(element.id)

    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
    }

    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }

  function handleDragMove(e) {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY

    const newX = Math.max(0, Math.min(dragState.current.origX + dx, canvasWidth - element.width))
    const newY = Math.max(0, Math.min(dragState.current.origY + dy, canvasHeight - element.height))

    if (elementRef.current) {
      elementRef.current.style.left = newX + 'px'
      elementRef.current.style.top = newY + 'px'
    }
  }

  function handleDragEnd() {
    if (!dragState.current || !elementRef.current) return

    const finalX = parseInt(elementRef.current.style.left, 10) || element.x
    const finalY = parseInt(elementRef.current.style.top, 10) || element.y

    if (finalX !== element.x || finalY !== element.y) {
      onUpdate(element.id, { x: finalX, y: finalY })
    }

    dragState.current = null
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  function handleResizeStart(e, corner) {
    e.stopPropagation()
    e.preventDefault()

    resizeState.current = {
      corner,
      startX: e.clientX,
      startY: e.clientY,
      origWidth: element.width,
      origHeight: element.height,
      origX: element.x,
      origY: element.y,
    }

    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  function handleResizeMove(e) {
    if (!resizeState.current || !elementRef.current) return
    const { corner, startX, startY, origWidth, origHeight, origX, origY } = resizeState.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    let newWidth = origWidth
    let newHeight = origHeight
    let newX = origX
    let newY = origY

    if (corner.includes('e')) newWidth = Math.max(80, origWidth + dx)
    if (corner.includes('w')) {
      newWidth = Math.max(80, origWidth - dx)
      newX = origX + (origWidth - newWidth)
    }
    if (corner.includes('s')) newHeight = Math.max(40, origHeight + dy)
    if (corner.includes('n')) {
      newHeight = Math.max(40, origHeight - dy)
      newY = origY + (origHeight - newHeight)
    }

    if (newX < 0) { newWidth += newX; newX = 0 }
    if (newY < 0) { newHeight += newY; newY = 0 }
    if (newX + newWidth > canvasWidth) newWidth = canvasWidth - newX
    if (newY + newHeight > canvasHeight) newHeight = canvasHeight - newY

    elementRef.current.style.left = newX + 'px'
    elementRef.current.style.top = newY + 'px'
    elementRef.current.style.width = newWidth + 'px'
    elementRef.current.style.height = newHeight + 'px'
  }

  function handleResizeEnd() {
    if (!resizeState.current || !elementRef.current) return

    const finalWidth = parseInt(elementRef.current.style.width, 10) || element.width
    const finalHeight = parseInt(elementRef.current.style.height, 10) || element.height
    const finalX = parseInt(elementRef.current.style.left, 10) || element.x
    const finalY = parseInt(elementRef.current.style.top, 10) || element.y

    onUpdate(element.id, {
      width: finalWidth,
      height: finalHeight,
      x: finalX,
      y: finalY,
    })

    resizeState.current = null
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }

  function handleTextChange(e) {
    setText(e.target.value)
  }

  function handleTextBlur() {
    if (text !== element.content) {
      onUpdate(element.id, { content: text })
    }
    if (text.trim() === '') {
      onDelete(element.id)
      return
    }
    setIsEditing(false)
  }

  function handleTextKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      setText(element.content)
      if (element.content.trim() === '') {
        onDelete(element.id)
      } else {
        setIsEditing(false)
      }
    }
  }

  function handleDoubleClick(e) {
    e.stopPropagation()
    setIsEditing(true)
  }

  function handleDelete(e) {
    e.stopPropagation()
    onDelete(element.id)
  }

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.z_index,
        background: 'var(--card-bg)',
        border: `2px solid ${isEditing ? 'var(--pink-deep)' : hovering ? 'var(--pink)' : 'var(--border-light)'}`,
        borderRadius: '10px',
        cursor: isEditing ? 'text' : 'move',
        padding: '10px 12px',
        boxSizing: 'border-box',
        transition: 'border-color 0.1s',
        userSelect: isEditing ? 'text' : 'none',
        overflow: 'hidden',
      }}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Type something..."
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          fontFamily: "'Syne', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: element.content ? 'var(--text-primary)' : 'var(--text-muted)',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'hidden',
        }}>
          {element.content || 'Empty — double-click to edit'}
        </div>
      )}

      {hovering && !isEditing && (
        <>
          <button
            data-delete="true"
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            style={styles.deleteBtn}
            aria-label="Delete element"
          >
            ×
          </button>

          <div data-handle="nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} style={{ ...styles.handle, ...styles.handleNW }} />
          <div data-handle="ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} style={{ ...styles.handle, ...styles.handleNE }} />
          <div data-handle="sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} style={{ ...styles.handle, ...styles.handleSW }} />
          <div data-handle="se" onMouseDown={(e) => handleResizeStart(e, 'se')} style={{ ...styles.handle, ...styles.handleSE }} />
        </>
      )}
    </div>
  )
}

const styles = {
  deleteBtn: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '2px solid var(--black)',
    background: 'var(--pink)',
    color: 'var(--black)',
    fontSize: '14px',
    fontWeight: 800,
    fontFamily: "'Syne', sans-serif",
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 1,
    zIndex: 10,
  },
  handle: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    background: 'var(--pink)',
    border: '2px solid var(--black)',
    borderRadius: '50%',
    zIndex: 10,
  },
  handleNW: { top: '-7px', left: '-7px', cursor: 'nw-resize' },
  handleNE: { top: '-7px', right: '-7px', cursor: 'ne-resize' },
  handleSW: { bottom: '-7px', left: '-7px', cursor: 'sw-resize' },
  handleSE: { bottom: '-7px', right: '-7px', cursor: 'se-resize' },
}
