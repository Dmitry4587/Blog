"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyInfo = exports.updateUser = exports.userLogin = exports.userRegistr = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRegistr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(req.body.password, salt);
        const user = yield new User_1.default({
            email: req.body.email,
            password: passwordHash,
            name: req.body.name,
            avatar: req.body.avatar,
        }).save();
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, "secret", { expiresIn: "30 days" });
        const _a = user._doc, { password } = _a, userInfo = __rest(_a, ["password"]);
        res.json({
            user: userInfo,
            token,
        });
    }
    catch (e) {
        return res.status(500).json({
            m: "Не удалось зарегестрироваться",
        });
    }
});
exports.userRegistr = userRegistr;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield User_1.default.findOne({ email: req.body.email }).populate("favComments"));
        if (!user) {
            return res.status(404).json({
                m: "Не правильный логин или пароль",
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(req.body.password, user._doc.password);
        if (!isValidPassword) {
            return res.status(404).json({
                m: "Не правильный логин или пароль",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
        }, "secret", { expiresIn: "30 days" });
        const _b = user._doc, { password } = _b, userInfo = __rest(_b, ["password"]);
        res.json({
            user: userInfo,
            token,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось авторизоваться",
        });
    }
});
exports.userLogin = userLogin;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInDb = yield User_1.default.findById(req.body.userId);
        const { password, email = userInDb === null || userInDb === void 0 ? void 0 : userInDb.email, name = userInDb === null || userInDb === void 0 ? void 0 : userInDb.name, avatar = userInDb === null || userInDb === void 0 ? void 0 : userInDb.avatar } = req.body;
        let passwordHash = "";
        if (password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            passwordHash = yield bcrypt_1.default.hash(password, salt);
        }
        const user = yield User_1.default.findOneAndUpdate({ _id: req.body.userId._id }, {
            email,
            password: (userInDb === null || userInDb === void 0 ? void 0 : userInDb.password) || passwordHash,
            name,
            avatar,
        }, { returnDocument: "after" })
            .select("-password")
            .populate("favComments");
        res.json({ user: user });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось обновить пользователя",
        });
    }
});
exports.updateUser = updateUser;
const getMyInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield User_1.default.findById(req.body.userId).populate("favComments"));
        if (!user) {
            return res.status(404).json({
                m: "Не удалось получить доступ",
            });
        }
        const _c = user._doc, { password } = _c, userInfo = __rest(_c, ["password"]);
        res.json({ user: userInfo });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось получить доступ",
        });
    }
});
exports.getMyInfo = getMyInfo;
