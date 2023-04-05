"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registrValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registrValidation = [
    (0, express_validator_1.body)("email", "Неправильный email").isEmail(),
    (0, express_validator_1.body)("avatar").optional(),
    (0, express_validator_1.body)("password", "Пароль минимум 4 символа").isLength({ min: 4 }),
    (0, express_validator_1.body)("name", "Имя минимум 2 символа максимум 12").isLength({ min: 2 }).isLength({ max: 12 }),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email", "Неправильный email").isEmail(),
    (0, express_validator_1.body)("password", "Пароль минимум 4 символа").isLength({ min: 4 }),
];
