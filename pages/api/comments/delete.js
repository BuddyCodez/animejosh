import connectToMongoDB from '@/middlewares/connection';
import User from '@/models/user';
import CommentModel from '../../../models/comments';
import Authentication from '../../../middlewares/verification';
 async function handler(req, res) {
    await connectToMongoDB();
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { uid, animeId, msg } = req.query;
    
    if (!uid || !animeId || !msg) {
        return res.status(422).json({ message: "Invalid input" });
    }
    // if has user id, check if user exists
     console.log("Finding User with uid: " + uid);
    if (uid) {
        await User.findById(uid).then((result) => {
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
        }).catch((err) => {
            return res.status(500).json({ message: "User not found", error: err });
        })
    }
    // delete comment
    await CommentModel.findOneAndDelete({ user: uid, animeId, message: msg }).then((result) => {
        if (!result) {
            return res.status(404).json({ message: "Comment not found", type: "error" });
        }
        return res.status(200).json({ message: "Comment deleted", type: "success" });
    }).catch((err) => {
        return res.status(500).json({ message: "Error deleting comment", error: err, type: "error" });
    });

}
export default handler;
