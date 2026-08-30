import mongoose from "mongoose";
import { URL_REGEX } from "../utils/urlRegex";
import validator from 'validator'

export interface IUser {
    name: string;
    about: string;
    avatar: string;
    password: string,
    email : string
}

const userSchema = new mongoose.Schema({
    name : {
      type : String,
      required : true,
      minLength : 2,
      maxLength : 60,
      default : "Jack-Eve Custo"
    },
    about : {
      type : String,
      required : true,
      minLength : 2,
      maxLength : 200,
      default : "Explorer"
    },
    avatar : {
      type : String,
      default : 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator : (url : string) => URL_REGEX.test(url),
        message: "Wrong avatar url"
      }
    },
    email : {
      type : String,
      required : true,
      unique : true,
      validate : {
        validator : (email : string) => validator.isEmail(email),
        message : "This is not email"
      }
    },
    password : {
      type : String,
      required : true,
      select : false
    }
})

export default mongoose.model<IUser>( "user", userSchema);