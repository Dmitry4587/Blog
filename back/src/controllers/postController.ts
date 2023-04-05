import { Response, Request } from "express";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";
import User from "../models/User";
import { IFindParams } from "../types/types";

export const createPost = async (req: Request, res: Response) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      user: req.body.userId,
      img: req.body.img,
      tags: req.body.tags,
    });
    const post = await doc.save();

    res.json(post);
  } catch (e) {
    res.status(500).json({
      m: "не удалость создать пост",
    });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const tag = req.query.tag as string;
    const posts = await PostModel.find({ viewCount: { $gte: 7 } })
      .limit(9)
      .exec();
    const tags = posts.map((post) => {
      if (post.tags) {
        return post.tags.slice(0, 2);
      }
    });
    if (tag) {
      return res.status(200).json([tag]);
    }
    return res.status(200).json(tags.flat());
  } catch (e) {
    res.status(500).json({
      m: "Не удалось получить теги",
    });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const sort = req.query.sort as string;
    const tag = req.query.tag as string;
    const userId = req.query.user as string;
    const searchTitle = req.query.title as string;
    const findParams: IFindParams = {};
    const sortParam = {} as { createdAt?: "desc"; viewCount?: "desc" };

    if (tag) {
      findParams.tags = tag;
    }
    if (userId) {
      findParams.user = { _id: userId };
    }
    if (searchTitle) {
      findParams.title = { $regex: searchTitle, $options: "i" };
    }

    if (sort === "new") {
      sortParam.createdAt = "desc";
    }
    if (sort === "popular") {
      sortParam.viewCount = "desc";
    }

    const posts = await PostModel.find(findParams)
      .populate("user")
      .sort(sortParam)
      .limit(+limit)
      .skip((+page - 1) * +limit);
    const count = await PostModel.find(findParams).countDocuments();
    res.json({
      posts,
      totalPages: Math.ceil(+count / +limit),
      currentPage: +page,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось получить посты",
    });
  }
};

export const getOnePost = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: {
          viewCount: 1,
        },
      },
      { returnDocument: "after" }
    )
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user", select: ["name", "avatar"] },
      });

    if (!posts) {
      return res.status(404).json({
        m: "Не удалось получить пост",
      });
    }

    res.json(posts);
  } catch (e) {
    res.status(500).json({
      m: "Не удалось получить пост",
    });
  }
};

export const deleteOnePost = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.id });

    post?.comments?.forEach(async (item) => {
      await User.updateMany(
        {},
        {
          $pull: { favComments: { $all: item } },
        }
      );
      await CommentModel.deleteOne(item);
    });

    await PostModel.findByIdAndDelete(req.params.id);

    res.json({
      id: req.params.id,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось удалить пост",
    });
  }
};

export const updateOnePost = async (req: Request, res: Response) => {
  try {
    await PostModel.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        text: req.body.text,
        user: req.body.userId,
        img: req.body.img,
        tags: req.body.tags,
      }
    );

    res.json({
      suc: true,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось обновить пост",
    });
  }
};

export const getPostByComment = async (req: Request, res: Response) => {
  try {
    const postId = await PostModel.findOne({
      comments: { $in: [{ _id: req.params.id }] },
    }).select("_id");

    res.json({
      postId,
      commentId: req.params.id,
    });
  } catch (e) {
    res.status(500).json({
      m: "Не удалось обновить пост",
    });
  }
};
