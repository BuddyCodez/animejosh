import connectToMongoDB from '@/middlewares/connection';
import User from '@/models/user';
export default async function handler(req, res) {
    await connectToMongoDB();
    if(req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"});
    }
    const { name, email, image } = req.body;
    if (!name || !email || !image) {
        return res.status(422).json({ message: "Invalid input" });
    }
    const newUser = {
        name,
        email,
        image,
    }
    const user = new User(newUser);
    user.save().then((result) => {
        res.status(201).json({ message: "User created", user: result });
    }).catch((err) => {
        res.status(500).json({ message: "User not created", error: err });
    })
}