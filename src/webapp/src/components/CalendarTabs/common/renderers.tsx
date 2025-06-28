// renderers.tsx
import { cn } from '@/lib/utils'
import { endOfMonth, format, isAfter, isBefore, isSameDay, isWeekend, startOfMonth } from 'date-fns'
import { memo, useMemo } from 'react'
import { DateRangeType } from './types'
import { formatMonthNominative, generateMonthDays } from './utils'

// Shared styles
const getDayClasses = (
  day: Date | null,
  isToday: boolean,
  isInRange: boolean,
  isDisabled: boolean,
  isWeekMode: boolean
) =>
  [
    'p-2 py-[8px] text-center w-full',
    day && !isDisabled && 'hover:bg-tg-secondary cursor-pointer',
    isWeekMode
      ? ''
      : 'rounded-sm  select-none',
    isDisabled
    && 'text-gray-400 cursor-default opacity-50 hover:bg-transparent',
    day && isWeekend(day) && !isToday ? 'text-weekend-color' : '',
    isToday ? 'text-tg-link' : '',
    isInRange ? 'bg-tg-secondary' : '',
    isInRange && isToday ? 'text-tg-link bg-tg-secondary' : ''
  ]
    .filter(Boolean)
    .join(' ')

// Month Renderer
export interface MonthRendererProps {
  month: Date
  index: number
  combinedRange: DateRangeType
  onDayClick: (day: Date, event: React.MouseEvent) => void
  isWeekMode?: boolean
  disabledUntil?: Date
  disabledAfter?: Date
  handleMonthClick: (month: Date, e: React.MouseEvent<HTMLButtonElement>) => void
}

export const MonthRenderer = memo(({
  month,
  index,
  combinedRange,
  onDayClick,
  isWeekMode = false,
  disabledUntil,
  disabledAfter,
  handleMonthClick,
}: MonthRendererProps) => {
  const today = new Date()
  const weeks = generateMonthDays(month)

  const isMonthDisabled = useMemo(() => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    return (
      (disabledUntil && monthEnd < disabledUntil) ||
      (disabledAfter && monthStart > disabledAfter)
    )
  }, [month, disabledUntil, disabledAfter])

  // Проверяем, выбран ли месяц
  const isMonthSelected = useMemo(() => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    return (
      combinedRange.from <= monthEnd &&
      combinedRange.to >= monthStart
    )
  }, [month, combinedRange])

  return (
    <div data-index={index}>
      <button
        className={cn(
          "text-sm text-tg-link capitalize text-start px-3 py-[9px] hover:bg-light-gray-back rounded-lg my-3 font-bold select-none transition-colors duration-200",
          'active:bg-light-gray-back',
          isMonthSelected && 'text-gray',
          isMonthDisabled && 'text-tg-hint opacity-50 cursor-default',
        )}
        onClick={(e) => handleMonthClick(month, e)}
      >
        <span>{formatMonthNominative(month)}</span>
      </button>
      <div className="flex flex-col gap-y-2 text-xs w-auto min-w-[280px]">
        {weeks.map((week, weekIndex) => {
          return (
            <div
              key={`week-${weekIndex}`}
              className={[
                'grid grid-cols-7 w-full gap-2'
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {week.map((day, dayIndex) => {
                const isToday = day ? isSameDay(day, today) : false
                const isInRange = day
                  ? day >= combinedRange.from && day <= combinedRange.to
                  : false
                const isDisabled =
                  day &&
                  ((disabledUntil && isBefore(day, disabledUntil)) ||
                    (disabledAfter && isAfter(day, disabledAfter)))

                return (
                  <div
                    key={day ? day.toString() : `empty-${dayIndex}`}
                    className={getDayClasses(
                      day,
                      isToday,
                      isInRange,
                      !!isDisabled,
                      isWeekMode
                    )}
                    onClick={e =>
                      !isWeekMode && day && !isDisabled && onDayClick(day, e)
                    }
                  >
                    {day ? format(day, 'd') : ''}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
})
