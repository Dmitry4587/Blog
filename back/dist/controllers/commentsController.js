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
exports.likeOrDislikeComment = exports.deleteComment = exports.getAllComments = exports.createComment = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new Comment_1.default({
            user: req.body.userId,
            text: req.body.text,
        });
        const comment = yield doc.save();
        const newPost = yield Post_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $inc: {
                commentsCount: 1,
            },
            $push: { comments: comment },
        }, { returnDocument: "after" })
            .populate({ path: "user", select: ["name", "avatar"] })
            .populate({
            path: "comments",
            populate: { path: "user", select: ["name", "avatar"] },
        });
        res.json({
            newPost,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось создать комментарии",
        });
    }
});
exports.createComment = createComment;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = req.query.tag;
        const findParams = {};
        if (tag) {
            findParams.tags = tag;
        }
        const comments = yield Comment_1.default.find({ commentLikes: { $gte: 1 } })
            .populate({
            path: "user",
            select: ["name", "avatar"],
        })
            .limit(7);
        return res.json(comments);
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось получить комментарии",
        });
    }
});
exports.getAllComments = getAllComments;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Comment_1.default.deleteMany({ _id: req.params.id });
        yield User_1.default.updateMany({}, {
            $pull: { favComments: { $in: [{ _id: req.params.id }] } },
        }, { returnDocument: "after" });
        const post = yield Post_1.default.findOneAndUpdate({ _id: req.params.postId }, {
            $inc: {
                commentsCount: -1,
            },
        }, { returnDocument: "after" })
            .populate({ path: "user", select: ["name", "avatar"] })
            .populate({
            path: "comments",
            populate: { path: "user", select: ["name", "avatar"] },
        });
        res.json(post);
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось удалить комментарий",
        });
    }
});
exports.deleteComment = deleteComment;
const likeOrDislikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentIdQuery = req.params.id;
        const isCommentLiked = yield User_1.default.find({
            _id: req.body.userId,
            favComments: { $in: [{ _id: commentIdQuery }] },
        });
        if (isCommentLiked.length) {
            yield Comment_1.default.findOneAndUpdate({ _id: commentIdQuery }, {
                $inc: {
                    commentLikes: -1,
                },
            }, { returnDocument: "after" });
            yield User_1.default.findOneAndUpdate({ _id: req.body.userId }, {
                $pull: { favComments: { $in: [{ _id: commentIdQuery }] } },
            }, { returnDocument: "after" });
            const post = yield Post_1.default.findById(req.params.postId)
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
        else {
            const comment = yield Comment_1.default.findOneAndUpdate({ _id: req.params.id }, {
                $inc: {
                    commentLikes: 1,
                },
            }, { returnDocument: "after" });
            yield User_1.default.findOneAndUpdate({ _id: req.body.userId }, {
                $push: { favComments: comment },
            }, { returnDocument: "after" }).populate({
                path: "favComments",
                populate: { path: "user", select: ["name", "avatar"] },
            });
            const post = yield Post_1.default.findById(req.params.postId)
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
    }
    catch (e) {
        res.status(500).json({
            m: "Что то пошло не так",
        });
    }
});
exports.likeOrDislikeComment = likeOrDislikeComment;
