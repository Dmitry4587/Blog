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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const postController_1 = require("./controllers/postController");
const commentsController_1 = require("./controllers/commentsController");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const checkAuth_1 = __importDefault(require("./utils/checkAuth"));
const userController_1 = require("./controllers/userController");
const checkValidationsErrors_1 = __importDefault(require("./utils/checkValidationsErrors"));
const userValidations_1 = require("./validations/userValidations");
const postValidations_1 = __importDefault(require("./validations/postValidations"));
const cloudinary_1 = require("cloudinary");
mongoose_1.default.connect(`${process.env.MONGO_DB}`);
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const storage = multer_1.default.diskStorage({});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            return cb(new Error("Не правильный тип картинки"));
        }
    },
}).single("image");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err instanceof multer_1.default.MulterError) {
            return res.status(500).json(err);
        }
        else if (err instanceof Error) {
            return res.status(500).json(err.message);
        }
        try {
            if (req.file) {
                const img = yield cloudinary_1.v2.uploader.upload((_a = req.file) === null || _a === void 0 ? void 0 : _a.path, {
                    public_id: req.file.originalname,
                });
                return res.json({
                    url: img.secure_url,
                    imgId: req.file.originalname,
                });
            }
            return res.status(400);
        }
        catch (e) {
            return res.status(500).json(e);
        }
    }));
}));
app.delete("/upload/:img", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const img = req.params.img;
        yield cloudinary_1.v2.uploader.destroy(img);
        res.send(200);
    }
    catch (e) {
        return res.status(500).json({
            m: "Не удалось удалить изображение",
        });
    }
}));
app.get("/tags", postController_1.getTags);
app.post("/user/registr", userValidations_1.registrValidation, checkValidationsErrors_1.default, userController_1.userRegistr);
app.post("/user/login", userValidations_1.loginValidation, checkValidationsErrors_1.default, userController_1.userLogin);
app.patch("/user/update", checkAuth_1.default, userController_1.updateUser);
app.get("/user/me", checkAuth_1.default, userController_1.getMyInfo);
app.post("/posts", checkAuth_1.default, postValidations_1.default, checkValidationsErrors_1.default, postController_1.createPost);
app.get("/posts", postController_1.getAllPosts);
app.post("/comments/:id", checkAuth_1.default, commentsController_1.createComment);
app.get("/comments", commentsController_1.getAllComments);
app.patch("/comments/:id/post/:postId", checkAuth_1.default, commentsController_1.likeOrDislikeComment);
app.delete("/comments/:id/post/:postId", checkAuth_1.default, commentsController_1.deleteComment);
app.get("/posts/:id", postController_1.getOnePost);
app.get("/posts/:id/comment", postController_1.getPostByComment);
app.delete("/posts/:id", checkAuth_1.default, postController_1.deleteOnePost);
app.patch("/posts/:id", checkAuth_1.default, postValidations_1.default, checkValidationsErrors_1.default, postController_1.updateOnePost);
app.listen(process.env.PORT || 8000);
