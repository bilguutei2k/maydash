import Masonry from 'react-masonry-css'
import Card from './Card'
import SkeletonCard from './SkeletonCard'

const breakpoints = {
  default: 3,
  1100: 2,
  700: 1,
}

export default function CardGrid({ cards, loading, author, onDelete, onUpdate, onSwap }) {
  const sortedCards = [...cards]
    .filter((card) => card.deleted === false)
    .sort((a, b) => a.position - b.position)

  if (loading) {
    return (
      <div className="skeleton-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (sortedCards.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          fontFamily: "'Syne', sans-serif",
        }}
      >
        <p
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Nothing here yet
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: '400',
          }}
        >
          Add your first card using the button above
        </p>
      </div>
    )
  }

  return (
    <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-grid-column">
      {sortedCards.map((card) => (
        <Card
          key={card.id}
          card={card}
          author={author}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onSwap={onSwap}
          cards={sortedCards}
        />
      ))}
    </Masonry>
  )
}
