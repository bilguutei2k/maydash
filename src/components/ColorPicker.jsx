import { COLOR_OPTIONS } from '../constants/colors'

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color.hex}
          type="button"
          className="color-swatch"
          style={{
            background: color.hex,
            borderColor: value === color.hex ? 'var(--black)' : 'transparent',
          }}
          onClick={() => onChange(color.hex)}
          aria-label={color.label}
        />
      ))}
    </div>
  )
}
