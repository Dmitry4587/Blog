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
exports.getPostByComment = exports.updateOnePost = exports.deleteOnePost = exports.getOnePost = exports.getAllPosts = exports.getTags = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new Post_1.default({
            title: req.body.title,
            text: req.body.text,
            user: req.body.userId,
            img: req.body.img,
            tags: req.body.tags,
        });
        const post = yield doc.save();
        res.json(post);
    }
    catch (e) {
        res.status(500).json({
            m: "не удалость создать пост",
        });
    }
});
exports.createPost = createPost;
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = req.query.tag;
        const posts = yield Post_1.default.find({ viewCount: { $gte: 7 } })
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
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось получить теги",
        });
    }
});
exports.getTags = getTags;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 2 } = req.query;
        const sort = req.query.sort;
        const tag = req.query.tag;
        const userId = req.query.user;
        const searchTitle = req.query.title;
        const findParams = {};
        const sortParam = {};
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
        const posts = yield Post_1.default.find(findParams)
            .populate("user")
            .sort(sortParam)
            .limit(+limit)
            .skip((+page - 1) * +limit);
        const count = yield Post_1.default.find(findParams).countDocuments();
        res.json({
            posts,
            totalPages: Math.ceil(+count / +limit),
            currentPage: +page,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось получить посты",
        });
    }
});
exports.getAllPosts = getAllPosts;
const getOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $inc: {
                viewCount: 1,
            },
        }, { returnDocument: "after" })
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
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось получить пост",
        });
    }
});
exports.getOnePost = getOnePost;
const deleteOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield Post_1.default.findOne({ _id: req.params.id });
        (_a = post === null || post === void 0 ? void 0 : post.comments) === null || _a === void 0 ? void 0 : _a.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield User_1.default.updateMany({}, {
                $pull: { favComments: { $all: item } },
            });
            yield Comment_1.default.deleteOne(item);
        }));
        yield Post_1.default.findByIdAndDelete(req.params.id);
        res.json({
            id: req.params.id,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось удалить пост",
        });
    }
});
exports.deleteOnePost = deleteOnePost;
const updateOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post_1.default.updateOne({ _id: req.params.id }, {
            title: req.body.title,
            text: req.body.text,
            user: req.body.userId,
            img: req.body.img,
            tags: req.body.tags,
        });
        res.json({
            suc: true,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось обновить пост",
        });
    }
});
exports.updateOnePost = updateOnePost;
const getPostByComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = yield Post_1.default.findOne({
            comments: { $in: [{ _id: req.params.id }] },
        }).select("_id");
        res.json({
            postId,
            commentId: req.params.id,
        });
    }
    catch (e) {
        res.status(500).json({
            m: "Не удалось обновить пост",
        });
    }
});
exports.getPostByComment = getPostByComment;
