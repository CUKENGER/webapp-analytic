// Функция форматирования дат в "DD.MM.YYYY"
function formatDate(value: string | number | undefined): string {
  if (!value)
    return 'нет'
  const date = new Date(isNaN(Number(value)) ? value : Number(value))
  if (isNaN(date.getTime())) {
    return String(value)
  }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const year = date.getFullYear().toString().substring(2, 4)
  return `${day}.${month}.${year}`
}

export default formatDate
