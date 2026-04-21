import { useWeek } from '../hooks/useWeek'

export default function LetterShell({ identity }) {
  const { week, loading, error } = useWeek()

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
              {loading ? 'Loading...' : error ? 'Error' : `Week ${week?.week_number}, ${week?.year}`}
            </div>
          </div>

          <div style={styles.canvas}>
            <div style={styles.canvasEmpty}>
              Your blank letter
              <br />
              <span style={styles.canvasEmptySub}>
                Elements will appear here in the next session
              </span>
            </div>
          </div>
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
    padding: '32px 28px',
  },
  weekHeader: {
    marginBottom: '24px',
    paddingBottom: '20px',
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
  canvas: {
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-card)',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--pink-soft)',
  },
  canvasEmpty: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    fontFamily: "'Syne', sans-serif",
    lineHeight: 1.6,
  },
  canvasEmptySub: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    opacity: 0.7,
  },
}
