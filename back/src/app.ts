import path from "path";
import cors from "cors";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  getPostByComment,
  getTags,
  updateOnePost,
} from "./controllers/postController";
import { createComment, getAllComments, deleteComment, likeOrDislikeComment } from "./controllers/commentsController";
import { Request, Response } from "express";
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth";
import { getMyInfo, updateUser, userLogin, userRegistr } from "./controllers/userController";
import checkValidationsErrors from "./utils/checkValidationsErrors";
import { loginValidation, registrValidation } from "./validations/userValidations";
import postValidation from "./validations/postValidations";
import { v2 as cloudinary } from "cloudinary";

mongoose.connect(`${process.env.MONGO_DB}`);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Не правильный тип картинки"));
    }
  },
}).single("image");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/upload", async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err instanceof Error) {
      return res.status(500).json(err.message);
    }
    try {
      if (req.file) {
        const img = await cloudinary.uploader.upload(req.file?.path, {
          public_id: req.file.originalname,
        });
        return res.json({
          url: img.secure_url,
          imgId: req.file.originalname,
        });
      }
      return res.status(400);
    } catch (e) {
      return res.status(500).json(e);
    }
  });
});

app.delete("/upload/:img", async (req: Request, res: Response) => {
  try {
    const img = req.params.img;
    await cloudinary.uploader.destroy(img);
    res.send(200);
  } catch (e) {
    return res.status(500).json({
      m: "Не удалось удалить изображение",
    });
  }
});

app.get("/tags", getTags);
app.post("/user/registr", registrValidation, checkValidationsErrors, userRegistr);
app.post("/user/login", loginValidation, checkValidationsErrors, userLogin);
app.patch("/user/update", checkAuth, updateUser);
app.get("/user/me", checkAuth, getMyInfo);
app.post("/posts", checkAuth, postValidation, checkValidationsErrors, createPost);
app.get("/posts", getAllPosts);
app.post("/comments/:id", checkAuth, createComment);
app.get("/comments", getAllComments);
app.patch("/comments/:id/post/:postId", checkAuth, likeOrDislikeComment);
app.delete("/comments/:id/post/:postId", checkAuth, deleteComment);
app.get("/posts/:id", getOnePost);
app.get("/posts/:id/comment", getPostByComment);
app.delete("/posts/:id", checkAuth, deleteOnePost);
app.patch("/posts/:id", checkAuth, postValidation, checkValidationsErrors, updateOnePost);
app.listen(process.env.PORT || 8000);
