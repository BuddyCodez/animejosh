const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
    animeId: {
        type: "string",
        required: true,
    },
    message: {
        type: "string",
    },
    //user refers to user model.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replies: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "replies",
            },
        ],
    }
});
const CommentModel = mongoose.models.comments || mongoose.model("comments", commentSchema);
module.exports = CommentModel;
