import UserModel, { DocumentExtended } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

export const userRegistr = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const user: DocumentExtended = await new UserModel({
      email: req.body.email,
      password: passwordHash,
      name: req.body.name,
      avatar: req.body.avatar,
    }).save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      { expiresIn: "30 days" }
    );

    const { password, ...userInfo } = user._doc;

    res.json({
      user: userInfo,
      token,
    });
  } catch (e) {
    return res.status(500).json({
      m: "Не удалось зарегестрироваться",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findOne({ email: req.body.email }).populate("favComments")) as DocumentExtended;
    if (!user) {
      return res.status(404).json({
        m: "Не правильный логин или пароль",
      });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password);

    if (!isValidPassword) {
      return res.status(404).json({
        m: "Не правильный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      { expiresIn: "30 days" }
    );

    const { password, ...userInfo } = user._doc;

    res.json({
      user: userInfo,
      token,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось авторизоваться",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userInDb = await UserModel.findById(req.body.userId);
    const { password, email = userInDb?.email, name = userInDb?.name, avatar = userInDb?.avatar } = req.body;
    let passwordHash = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: req.body.userId._id },
      {
        email,
        password: userInDb?.password || passwordHash,
        name,
        avatar,
      },
      { returnDocument: "after" }
    )
      .select("-password")
      .populate("favComments");
    res.json({ user: user });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось обновить пользователя",
    });
  }
};

export const getMyInfo = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findById(req.body.userId).populate("favComments")) as DocumentExtended;
    if (!user) {
      return res.status(404).json({
        m: "Не удалось получить доступ",
      });
    }

    const { password, ...userInfo } = user._doc;

    res.json({ user: userInfo });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось получить доступ",
    });
  }
};
