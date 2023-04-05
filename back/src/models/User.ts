import { Schema, model, Document } from "mongoose";

export interface DocumentExtended extends Document {
  _doc?: any;
}

interface IUser {
  name: string;
  email: string;
  avatar?: {
    url: string;
    imgId: string;
  };
  password: string;
  favComments?: [{ type: Schema.Types.ObjectId }];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      url: String,
      imgId: String,
    },
    favComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default model("User", userSchema);
