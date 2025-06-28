import * as yup from 'yup'

export const EditLinkSchema = yup.object().shape({
  name: yup.string().trim().default(''),
  isActive: yup.boolean().default(true),
  isRequest: yup.boolean().default(false),
  consumption: yup
    .number()
    .typeError('Введите число')
    .positive('Сумма должна быть больше 0')
    .max(999999999, 'Максимальное значение 999999999')
    .required('Обязательное поле'),
  period: yup.string().required('Выберите срок действия ссылки'),
  customPeriod: yup
    .number()
    .nullable()
    .when('period', {
      is: 'other_period',
      then: schema =>
        schema
          .typeError('Введите число')
          .min(1, 'Должно быть не менее 1')
          .required('Укажите срок действия'),
      otherwise: schema => schema.nullable().optional()
    }),
  userLimit: yup.string().required('Выберите лимит пользователей'),
  customUserLimit: yup
    .number()
    .nullable()
    .when(['userLimit', 'isRequest'], {
      is: (userLimit: string, isRequest: boolean) =>
        userLimit === 'other_users' && !isRequest,
      then: schema =>
        schema
          .typeError('Введите число')
          .min(1, 'Должно быть не менее 1')
          .required('Укажите лимит пользователей'),
      otherwise: schema => schema.nullable().optional()
    })
})
