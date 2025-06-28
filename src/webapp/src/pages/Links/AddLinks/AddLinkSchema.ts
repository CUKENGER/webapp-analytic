import * as yup from 'yup'

export const AddLinkSchema = yup.object().shape({
  name: yup.string().trim().default(''),
  isRequest: yup.boolean().default(false),
  consumption: yup
    .number()
    .typeError('Введите число')
    .positive('Сумма должна быть больше 0')
    .max(999999999, 'Максимальное значение 999999999')
    .transform((value, originalValue) => {
      // Если значение пустое или не число, возвращаем undefined
      return originalValue === '' || isNaN(originalValue) ? undefined : value
    })
    .optional() // Поле необязательное
    .default(undefined),
  period: yup.string().required('Выберите срок действия ссылки'),
  customPeriod: yup.string().when('period', {
    is: 'custom_period',
    then: (schema) =>
      schema
        .required('Укажите дату')
        .test('is-valid-date', 'Некорректная дата', (value) => {
          if (!value) return false
          const [day, month, year] = value.split('.')
          const date = new Date(`${year}-${month}-${day}`)
          const currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)
          return (
            !isNaN(date.getTime()) &&
            Number(day) >= 1 &&
            Number(day) <= 31 &&
            Number(month) >= 1 &&
            Number(month) <= 12 &&
            Number(year) <= 2100 &&
            date >= currentDate
          )
        })
        .matches(/^(\d{2}\.\d{2}\.\d{4})$/, 'Формат: дд.мм.гггг'),
    otherwise: (schema) => schema.optional().default('Никогда'),
  }),
  userLimit: yup.string().required('Выберите лимит пользователей'),
  customUserLimit: yup.mixed<number | string>().when('userLimit', {
    is: 'custom_limit',
    then: (schema) =>
      schema
        .required('Укажите лимит пользователей')
        .test('is-valid-limit', 'Должно быть числом больше 0', (value) => {
          const numValue = Number(value)
          return !isNaN(numValue) && numValue > 0 && numValue <= 999999
        })
        .transform((_, originalValue) => {
          const numValue = Number(originalValue)
          return isNaN(numValue) ? originalValue : numValue
        }),
    otherwise: (schema) =>
      schema
        .optional()
        .default('Не ограничено')
        .transform((_, originalValue) =>
          originalValue === '' || originalValue === undefined
            ? 'Не ограничено'
            : originalValue
        ),
  }),
})