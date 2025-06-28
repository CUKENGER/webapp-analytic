export const ChevronIcon = ({
  className,
  disabled = false
}: {
  className?: string
  disabled?: boolean
}) => {
  return (
    <svg
      className={className}
      width="10"
      height="22"
      viewBox="0 0 10 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6L7 11L3 16"
        stroke={disabled ? 'var(--gray-stroke)' : 'var(--tg-link-color)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
