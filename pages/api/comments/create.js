import connectToMongoDB from '@/middlewares/connection';
import User from '@/models/user';
import CommentModel from '../../../models/comments';
export default async function handler(req, res) {
    await connectToMongoDB();
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { message, animeId, userId } = req.body;
    if (!message || !animeId || !userId) {
        return res.status(422).json({ message: "Invalid input" });
    }
    // if has user id, check if user exists
    if (userId) {
        await User.findById(userId).then((result) => {
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
        }).catch((err) => {
            return res.status(500).json({ message: "User not found", error: err });
        })
    }
    const newComment = {
        message,
        animeId,
        user: userId,
    };
    const comment = new CommentModel(newComment)
        
        comment.save().then((output) => {
        res.status(200).json({ comment: output });
    }).catch((err) => {
        res.status(500).json({ message: "Error Creating Comment" });
        console.error(err);
    });
}