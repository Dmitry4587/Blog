"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    try {
        const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
        if (!token) {
            return res.status(403).json({
                m: "Нет доступа",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, "secret");
        req.body.userId = decoded;
        next();
    }
    catch (e) {
        return res.status(500).json({
            m: "Нет доступа",
        });
    }
};
