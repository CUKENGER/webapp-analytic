// utils.ts
import { addDays, format, getDay, isSameMonth, startOfMonth } from 'date-fns'
import { ru } from 'date-fns/locale'
import { DateRangeType } from './types'

export const TABS = ['Сегодня', 'Вчера', '7 дней', '30 дней', '90 дней', '365 дней']
export const SINGLE_MODE_TABS = ['Завтра', '7 дней', '30 дней', '90 дней', '365 дней']

export const monthNamesNominative: { [key: string]: string } = {
  января: 'январь',
  февраля: 'февраль',
  марта: 'март',
  апреля: 'апрель',
  мая: 'май',
  июня: 'июнь',
  июля: 'июль',
  августа: 'август',
  сентября: 'сентябрь',
  октября: 'октябрь',
  ноября: 'ноябрь',
  декабря: 'декабрь'
}

export const combineRanges = (ranges: DateRangeType[]): DateRangeType => {
  if (ranges.length === 0) return { from: new Date(), to: new Date() }
  const allDates = ranges.flatMap(range => [range.from, range.to])
  return {
    from: new Date(Math.min(...allDates.map(date => date.getTime()))),
    to: new Date(Math.max(...allDates.map(date => date.getTime())))
  }
}

export const formatMonthNominative = (date: Date): string => {
  const monthName = format(date, 'MMMM', { locale: ru })
  const year = format(date, 'yyyy')
  return `${monthNamesNominative[monthName] || monthName} ${year}`
}

export const generateMonthDays = (month: Date) => {
  const start = startOfMonth(month)
  const daysInMonth: (Date | null)[] = []
  let currentDay = start

  const firstDayOfWeek = getDay(start)
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  for (let i = 0; i < offset; i++) daysInMonth.push(null)

  while (isSameMonth(currentDay, month)) {
    daysInMonth.push(new Date(currentDay))
    currentDay = addDays(currentDay, 1)
  }

  const totalCells = daysInMonth.length
  const remainingCells = totalCells % 7
  if (remainingCells > 0) {
    for (let i = 0; i < 7 - remainingCells; i++) daysInMonth.push(null)
  }

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7))
  }
  return weeks
}

