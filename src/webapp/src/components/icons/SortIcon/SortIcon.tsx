import styles from './SortIcon.module.css'

interface SortIconProps {
  isSorted: 'asc' | 'desc' | false
}

export const SortIcon = ({ isSorted }: SortIconProps) => {
  const sortClass = isSorted === 'asc' ? styles['sort-desc'] : isSorted === 'desc' ? styles['sort-asc'] : styles['sort-none'];

  return (
    <span className="inline-block w-4 h-4">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sortClass}
      >
        <path
          className={`${styles['sort-line']} ${styles.middle}`}
          d="M12 8 H4"
          stroke="#0080FF"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={`${styles['sort-line']} ${styles.top}`}
          d="M12 5 H4"
          stroke="#0080FF"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className={`${styles['sort-line']} ${styles.bottom}`}
          d="M12 11 H4"
          stroke="#0080FF"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
