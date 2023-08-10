import connectToMongoDB from '@/middlewares/connection';
import User from '@/models/user';
import CommentModel from '../../../models/comments';
export default async function handler(req, res) {
    await connectToMongoDB();
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    // console.log(req)
    const { animeId } = req.body;
    if (!animeId) return res.status(500).json({ message: "Invalid animeId" });
    console.log("Finding Comments with animeId: " + animeId);
    const comments = await CommentModel.find({ animeId: animeId });
    if (!comments) return res.status(200).json({ comments: [] });
    let cmts = comments.map(async (c) => {
        return {
            _id: c._id,
            message: c.message,
            user: await User.findById(c.user),
            animeId: c.animeId,
            createdAt: c.createdAt,
        }
    })
    cmts = await Promise.all(cmts);
    // console.log(cmts);
    return res.status(200).json({ comments: cmts });
}