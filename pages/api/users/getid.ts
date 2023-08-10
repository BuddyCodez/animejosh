// pages/api/users/getUserIdByEmail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../../models/user';
import { mongooseMiddleware } from '@/middlewares/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        await mongooseMiddleware(req, res, async () => {
            try {
                const { email } = req.query;

                // Find the user by email
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return res.status(200).json({ userId: null }); // Return null if user is not found
                }

                return res.status(200).json({ userId: user._id });
            } catch (error) {
                console.error('Error retrieving user:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}