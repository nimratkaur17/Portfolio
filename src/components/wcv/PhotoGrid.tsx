import ImageSlot from '../case/ImageSlot'
import './PhotoGrid.css'

interface Photo {
  src?: string | null
  alt: string
}

interface PhotoGridProps {
  photos: Photo[]
}

function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      {photos.map((photo, i) => (
        <ImageSlot key={i} src={photo.src} alt={photo.alt} ratio="1 / 1" />
      ))}
    </div>
  )
}

export default PhotoGrid
