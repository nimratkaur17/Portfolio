import './PhotoGrid.css'

interface Photo {
  src?: string | null
  alt: string
  caption: string
}

interface PhotoGridProps {
  photos: Photo[]
}

// A hover reveals a caption and desaturates the photo slightly, so the grid
// stays quiet at rest and gives a little feedback on interaction.
function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      {photos.map((photo, i) => (
        <figure className="photo-grid__tile" key={i}>
          {photo.src ? (
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
          ) : (
            <div className="photo-grid__placeholder" aria-hidden="true" />
          )}
          {photo.src && <figcaption className="photo-grid__caption">{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

export default PhotoGrid
