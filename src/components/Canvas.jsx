import { useRef } from 'react'
import TextElement from './TextElement'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export default function Canvas({ elements, onAdd, onUpdate, onDelete, onBringToFront }) {
  const canvasRef = useRef(null)

  function handleCanvasClick(e) {
    if (e.target !== canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 100
    const y = e.clientY - rect.top - 30

    onAdd({
      type: 'text',
      content: '',
      x: Math.max(0, Math.min(x, CANVAS_WIDTH - 200)),
      y: Math.max(0, Math.min(y, CANVAS_HEIGHT - 80)),
      width: 200,
      height: 80,
    })
  }

  return (
    <div style={styles.scroller}>
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          ...styles.canvas,
          width: CANVAS_WIDTH,
          height: CANVASheight ?? CANVAS_HEIGHT,
        }}
      >
        {elements.map(element => (
          <TextElement
            key={element.id}
            element={element}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={CANVAS_HEIGHT}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onBringToFront={onBringToFront}
          />
        ))}

        {elements.length === 0 && (
          <div style={styles.emptyHint}>
            <div style={styles.emptyTitle}>Your blank letter</div>
            <div style={styles.emptySub}>Click anywhere to add a text element</div>
          </div>
        )}
      </div>
    </div>
  )
}

const CANVASheight = 600

const styles = {
  scroller: {
    width: '100%',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px',
  },
  canvas: {
    position: 'relative',
    background: 'var(--card-bg)',
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-card)',
    cursor: 'crosshair',
    flexShrink: 0,
  },
  emptyHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none',
    fontFamily: "'Syne', sans-serif",
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: '6px',
  },
  emptySub: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    opacity: 0.7,
  },
}
