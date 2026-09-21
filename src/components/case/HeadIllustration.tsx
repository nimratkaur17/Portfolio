interface HeadIllustrationProps {
  variant: 'girl' | 'guy'
  className?: string
}

// Line drawings of a head and shoulders, deliberately without facial
// features. Purely decorative, so hidden from assistive tech.
function HeadIllustration({ variant, className }: HeadIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'girl' ? (
        <>
          <path d="M60 22C36 22 30 44 31 66C32 86 44 100 60 100C76 100 88 86 89 66C90 44 84 22 60 22Z" />
          <path d="M31 62C24 78 22 100 26 122" />
          <path d="M89 62C96 78 98 100 94 122" />
          <path d="M60 22C50 32 40 40 31 50" />
          <path d="M60 22C70 30 80 40 89 52" />
          <path d="M52 99L52 114C52 122 36 126 20 140" />
          <path d="M68 99L68 114C68 122 84 126 100 140" />
        </>
      ) : (
        <>
          <path d="M60 24C40 24 34 42 34 62C34 84 44 100 60 100C76 100 86 84 86 62C86 42 80 24 60 24Z" />
          <path d="M34 58C30 34 44 16 64 16C82 16 92 32 86 58" />
          <path d="M34 56C42 46 54 42 62 34C70 42 78 46 86 54" />
          <path d="M33 62C26 60 26 74 34 74" />
          <path d="M87 62C94 60 94 74 86 74" />
          <path d="M52 99L52 114C52 122 36 126 20 140" />
          <path d="M68 99L68 114C68 122 84 126 100 140" />
        </>
      )}
    </svg>
  )
}

export default HeadIllustration
