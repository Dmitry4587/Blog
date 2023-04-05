"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
    img: {
        url: String,
        imgId: String,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", postSchema);
