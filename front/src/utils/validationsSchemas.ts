import * as yup from 'yup';

export const loginShema = yup.object({
  email: yup.string().trim().email('Неправильный email').required('Обязательное поле'),
  password: yup.string().trim().min(4, 'Минимум 4 символа').required('Обязательное поле'),
});

export const registrSchema = yup.object({
  email: yup.string().trim().email('Неправильный email').required('Обязательное поле'),
  name: yup
    .string()
    .trim()
    .min(2, 'минимум 2 символа')
    .max(12, 'максимум 12 символов')
    .required('Обязательное поле'),
  password: yup.string().trim().min(4, 'минимум 4 символа').required('Обязательное поле'),
});
