import { body } from "express-validator";

const postValidation = [
  body("title", "Заголовок минимум 2 символа").trim().isString().isLength({ min: 2 }),
  body("text", "Текст минимум 5 символа").trim().isLength({ min: 5 }),
  body("tags", "Передать массивом").optional().isArray(),
  body("imageUrl").optional(),
];

export default postValidation;
