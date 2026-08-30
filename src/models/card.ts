import mongoose, { Types } from "mongoose";
import { URL_REGEX } from "../utils/urlRegex";

interface ICard {
    name: string;
    link: string;
    owner: Types.ObjectId;
    likes: Types.ObjectId[];
    createdAt: Date;
}

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link : {
        type : String,
        required : true,
        validate: {
          validator : (url : string) => URL_REGEX.test(url),
          message: "Wrong link url"
        }
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required : true,
    },
    likes : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        default: [],
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ICard>("card", cardSchema);