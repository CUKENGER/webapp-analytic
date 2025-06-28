import { cn } from '@/lib/utils'

export const EditIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn('flex-shrink-0', className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L2 13L6 12L12.2929 5.70711C12.6834 5.31658 12.6834 4.68342 12.2929 4.29289L10.7071 2.70711C10.3166 2.31658 9.68342 2.31658 9.29289 2.70711L3 9Z"
        stroke="#0080FF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4L11 7"
        stroke="#0080FF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
