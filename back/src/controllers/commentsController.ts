import { Response, Request } from "express";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";
import { IFindParams } from "../types/types";
import User from "../models/User";

export const createComment = async (req: Request, res: Response) => {
  try {
    const doc = new CommentModel({
      user: req.body.userId,
      text: req.body.text,
    });

    const comment = await doc.save();

    const newPost = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: {
          commentsCount: 1,
        },

        $push: { comments: comment },
      },
      { returnDocument: "after" }
    )
      .populate({ path: "user", select: ["name", "avatar"] })
      .populate({
        path: "comments",
        populate: { path: "user", select: ["name", "avatar"] },
      });

    res.json({
      newPost,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось создать комментарии",
    });
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const tag = req.query.tag as string;
    const findParams: IFindParams = {};

    if (tag) {
      findParams.tags = tag;
    }

    const comments = await CommentModel.find({ commentLikes: { $gte: 1 } })
      .populate({
        path: "user",
        select: ["name", "avatar"],
      })
      .limit(7);

    return res.json(comments);
  } catch (e) {
    res.status(500).json({
      m: "Не удалось получить комментарии",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    await CommentModel.deleteMany({ _id: req.params.id });
    await User.updateMany(
      {},
      {
        $pull: { favComments: { $in: [{ _id: req.params.id }] } },
      },
      { returnDocument: "after" }
    );

    const post = await PostModel.findOneAndUpdate(
      { _id: req.params.postId },
      {
        $inc: {
          commentsCount: -1,
        },
      },
      { returnDocument: "after" }
    )
      .populate({ path: "user", select: ["name", "avatar"] })
      .populate({
        path: "comments",
        populate: { path: "user", select: ["name", "avatar"] },
      });

    res.json(post);
  } catch (e) {
    res.status(500).json({
      m: "Не удалось удалить комментарий",
    });
  }
};

export const likeOrDislikeComment = async (req: Request, res: Response) => {
  try {
    const commentIdQuery = req.params.id;

    const isCommentLiked = await User.find({
      _id: req.body.userId,
      favComments: { $in: [{ _id: commentIdQuery }] },
    });
    if (isCommentLiked.length) {
      await CommentModel.findOneAndUpdate(
        { _id: commentIdQuery },
        {
          $inc: {
            commentLikes: -1,
          },
        },
        { returnDocument: "after" }
      );
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $pull: { favComments: { $in: [{ _id: commentIdQuery }] } },
        },
        { returnDocument: "after" }
      );
      const post = await PostModel.findById(req.params.postId)
        .populate({ path: "user", select: ["name", "avatar"] })
        .populate({
          path: "comments",
          populate: { path: "user", select: ["name", "avatar"] },
        });
      return res.status(200).json({
        post,
        isLike: true,
      });
    } else {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: {
            commentLikes: 1,
          },
        },
        { returnDocument: "after" }
      );
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $push: { favComments: comment },
        },
        { returnDocument: "after" }
      ).populate({
        path: "favComments",
        populate: { path: "user", select: ["name", "avatar"] },
      });
      const post = await PostModel.findById(req.params.postId)
        .populate({ path: "user", select: ["name", "avatar"] })
        .populate({
          path: "comments",
          populate: { path: "user", select: ["name", "avatar"] },
        });
      return res.status(200).json({
        post,
        isLike: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      m: "Что то пошло не так",
    });
  }
};
