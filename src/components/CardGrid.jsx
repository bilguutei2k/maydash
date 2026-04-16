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
