import express, { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (!token) {
      return res.status(403).json({
        m: "Нет доступа",
      });
    }

    const decoded = jwt.verify(token, "secret");

    req.body.userId = decoded;

    next();
  } catch (e) {
    return res.status(500).json({
      m: "Нет доступа",
    });
  }
};
