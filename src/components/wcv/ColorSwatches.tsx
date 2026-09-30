import './ColorSwatches.css'

interface Swatch {
  tone: 'blue' | 'red' | 'dark' | 'white' | 'yellow'
  name: string
  meaning: string
}

interface ColorSwatchesProps {
  swatches: Swatch[]
}

function ColorSwatches({ swatches }: ColorSwatchesProps) {
  return (
    <div className="color-swatches">
      {swatches.map((swatch) => (
        <div key={swatch.name} className={`color-swatch color-swatch--${swatch.tone}`}>
          <span className="color-swatch__block" aria-hidden="true" />
          <p className="color-swatch__label">
            <strong>{swatch.name}</strong> · {swatch.meaning}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ColorSwatches
