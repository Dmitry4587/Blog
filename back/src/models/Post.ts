import { Schema, model } from "mongoose";

interface IPost {
  title: string;
  text: string;
  img?: {
    url: string;
    imgId: string;
  };
  tags?: string[];
  comments?: [{ type: Schema.Types.ObjectId }];
  user: {
    ref: string;
    type: Schema.Types.ObjectId;
  };
  viewCount: number;
  commentsCount?: number;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
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
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    img: {
      url: String,
      imgId: String,
    },
  },
  { timestamps: true }
);

export default model("Post", postSchema);
