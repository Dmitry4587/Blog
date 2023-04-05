"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const postValidation = [
    (0, express_validator_1.body)("title", "Заголовок минимум 2 символа").trim().isString().isLength({ min: 2 }),
    (0, express_validator_1.body)("text", "Текст минимум 5 символа").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("tags", "Передать массивом").optional().isArray(),
    (0, express_validator_1.body)("imageUrl").optional(),
];
exports.default = postValidation;
