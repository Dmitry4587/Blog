"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        url: String,
        imgId: String,
    },
    favComments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
