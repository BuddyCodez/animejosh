// models/comment.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user'; // Import the IUser interface from the user model

export interface IReply extends Document {
    text: string;
    user: IUser['_id'];
    createdAt: Date;
}

export interface IComment extends Document {
    animeId: string;
    text: string;
    user: IUser['_id'];
    replies: IReply['_id'][]; // References to Reply model
    createdAt: Date;
}

const replySchema: Schema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const commentSchema: Schema = new Schema({
    animeId: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }], // References to Reply model
    createdAt: { type: Date, default: Date.now },
});


let ReplyModel: Model<IReply>;
let CommentModel = Model<IComment>;

try {
    ReplyModel = mongoose.model<IReply>('Reply');
    CommentModel = mongoose.model<IComment>('Comment');
} catch {
    ReplyModel = mongoose.model<IReply>('Reply', replySchema);
    CommentModel = mongoose.model<IReply>('Comment', commentSchema);
}

export { CommentModel, ReplyModel };
