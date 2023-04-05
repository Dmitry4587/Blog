import { body } from "express-validator";

export const registrValidation = [
  body("email", "Неправильный email").isEmail(),
  body("avatar").optional(),
  body("password", "Пароль минимум 4 символа").isLength({ min: 4 }),
  body("name", "Имя минимум 2 символа максимум 12").isLength({ min: 2 }).isLength({ max: 12 }),
];

export const loginValidation = [
  body("email", "Неправильный email").isEmail(),
  body("password", "Пароль минимум 4 символа").isLength({ min: 4 }),
];
