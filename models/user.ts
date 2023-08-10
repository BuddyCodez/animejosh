// models/user.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IComment } from './comment';

export interface IUserExtended extends Document, IUser {
    comments: Array<IComment['_id']>;
}
export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
}


const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
});

let UserModel: Model<IUser>;

try {
    UserModel = mongoose.model<IUser>('User');
} catch {
    UserModel = mongoose.model<IUser>('User', userSchema);
}

export default UserModel;
