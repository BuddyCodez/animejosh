const mongoose = require("mongoose");
const ReplySchemma = mongoose.Schema({

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

});
const ReplyModel = mongoose.models.replies || mongoose.model("replies", ReplySchemma);
module.exports = ReplyModel;
