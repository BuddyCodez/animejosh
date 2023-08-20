import connectToMongoDB from '@/middlewares/connection';
import User from '@/models/user';
import Authentication from '../../../middlewares/verification';
 async function handler(req, res) {
    await connectToMongoDB();
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
     const { email } = req.body;
    if (!email) return res.status(500).json({ message: "Invalid email address" });
    console.log("Finding User with email: " + email);
    let users = await User.find();
    let found = false;
    users.forEach(user => {
        if (user.email == email) {
            found = true;
            return res.status(200).json({ userId: user._id.toString() });
        }
    });
    if (!found) return res.status(200).json({ userId: false });
}
export default handler;
