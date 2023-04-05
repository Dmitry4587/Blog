import { Schema, model } from "mongoose";

interface IComment {
  user: Schema.Types.ObjectId;
  text: string;
  commentLikes: number;
}

const commentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentLikes: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    required: true,
  },
});

export default model("Comment", commentSchema);
