// pages/api/users/create.ts

import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from "../../../models/user";
import { mongooseMiddleware } from '@/middlewares/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await mongooseMiddleware(req, res, async () => {
                const { name, email, image } = req.body;

                // Create a new user
                const newUser = await UserModel.create({
                    name,
                    email,
                    image,
                    comments: [], // Initialize with an empty array of comments
                });

                return res.status(201).json(newUser);
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
