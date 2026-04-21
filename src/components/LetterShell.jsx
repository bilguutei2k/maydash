import { useWeek } from '../hooks/useWeek'
import { useElements } from '../hooks/useElements'
import Canvas from './Canvas'

export default function LetterShell({ identity }) {
  const { week, loading: weekLoading, error: weekError } = useWeek()
  const {
    elements,
    loading: elementsLoading,
    error: elementsError,
    addElement,
    updateElement,
    deleteElement,
    bringToFront,
  } = useElements(week?.id, identity)

  const error = weekError || elementsError

  return (
    <div style={styles.wrapper}>
      <div style={styles.shell}>

        <div style={styles.topbar}>
          <span style={styles.wordmark}>dashletter</span>
          <div style={styles.identityBadge}>
            <span style={styles.identityLabel}>You are</span>
            <span style={styles.identityValue}>{identity}</span>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.weekHeader}>
            <div style={styles.weekEyebrow}>Your letter for</div>
            <div style={styles.weekTitle}>
              {weekLoading ? 'Loading...' : `Week ${week?.week_number}, ${week?.year}`}
            </div>
            {elements.length > 0 && !elementsLoading && (
              <div style={styles.weekMeta}>
                {elements.length} element{elements.length === 1 ? '' : 's'}
              </div>
            )}
          </div>

          {error && (
            <div style={styles.errorBar}>{error}</div>
          )}

          {!weekLoading && !elementsLoading && week && (
            <Canvas
              elements={elements}
              onAdd={addElement}
              onUpdate={updateElement}
              onDelete={deleteElement}
              onBringToFront={bringToFront}
            />
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'var(--page-bg)',
    fontFamily: "'Syne', sans-serif",
  },
  shell: {
    width: '100%',
    maxWidth: '1100px',
    border: '2.5px solid var(--black)',
    borderRadius: 'var(--radius-app)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-app)',
    background: 'var(--card-bg)',
  },
  topbar: {
    background: 'var(--pink)',
    borderBottom: '2.5px solid var(--black)',
    height: '56px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: '17px',
    fontWeight: 800,
    color: 'var(--black)',
    letterSpacing: '-.02em',
    textTransform: 'lowercase',
  },
  identityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--black)',
    borderRadius: '20px',
    padding: '5px 14px',
  },
  identityLabel: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--pink)',
    opacity: 0.7,
  },
  identityValue: {
    fontSize: '11px',
    fontWeight: 800,
    color: 'var(--pink)',
  },
  body: {
    padding: '24px 20px',
  },
  weekHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid var(--border-light)',
  },
  weekEyebrow: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--pink-deep)',
    marginBottom: '6px',
  },
  weekTitle: {
    fontSize: '38px',
    fontWeight: 800,
    color: 'var(--black)',
    letterSpacing: '-.03em',
    lineHeight: 1,
  },
  weekMeta: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    marginTop: '6px',
    letterSpacing: '.04em',
  },
  errorBar: {
    background: '#fce8e8',
    border: '1.5px solid #c47c7c',
    color: '#c47c7c',
    fontSize: '12px',
    fontWeight: 600,
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
  },
}
