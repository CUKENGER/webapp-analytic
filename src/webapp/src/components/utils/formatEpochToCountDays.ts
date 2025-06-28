import { differenceInDays, format, parseISO } from 'date-fns'

export const formatDateStringToCountDays = (
  dateString: string | null | undefined
) => {
  // Если dateString невалиден или отсутствует, возвращаем 0
  if (!dateString) {
    return 0
  }

  try {
    const endDate = parseISO(dateString) // Парсим строку в объект Date
    const now = new Date()

    const endDateUTC = new Date(endDate.toUTCString())
    const nowUTC = new Date(now.toUTCString())

    const daysLeft = differenceInDays(endDateUTC, nowUTC)
    return Math.max(0, daysLeft)
  } catch {
    return 0
  }
}

// Преобразует строку даты в формате ISO в строку формата "DD.MM.YYYY"
export const formatDateStringToDate = (
  dateString: string | null | undefined
): string => {
  // Если dateString невалиден или отсутствует, возвращаем пустую строку
  if (!dateString) {
    return ''
  }

  try {
    const date = parseISO(dateString) // Парсим строку в объект Date
    return format(date, 'dd.MM.yyyy') // Форматируем в "DD.MM.YYYY"
  } catch {
    return ''
  }
}

export const getTariffEndDateInfo = (dateString: string | undefined) => {
  const endDate = formatDateStringToDate(dateString)
  const daysLeft = formatDateStringToCountDays(dateString)
  const isExpiringSoon = daysLeft < 3 && daysLeft > 0
  const isExpired = daysLeft === 0

  return {
    endDate,
    daysLeft,
    className: isExpired || isExpiringSoon ? 'text-tg-destructive' : '',
    text: isExpired ? '(истёк)' : `до ${endDate}`
  }
}
