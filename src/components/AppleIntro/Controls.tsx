'use client'

interface ControlsProps {
  isPlaying: boolean
  progress: number
  onPlayPause: () => void
  onRestart: () => void
  onSliderChange: (value: number) => void
}

export function Controls({
  isPlaying,
  progress,
  onPlayPause,
  onRestart,
  onSliderChange,
}: ControlsProps) {
  return (
    <div className="controls-container">
      <div className="controls-wrapper">
        <button
          onClick={onRestart}
          className="control-button"
          title="Restart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <button
          onClick={onPlayPause}
          className="control-button"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={(e) => onSliderChange(parseFloat(e.target.value))}
          className="progress-slider"
        />

        <span className="progress-text">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  )
}
