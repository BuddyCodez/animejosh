// pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            // Find the user and delete
            const deletedUser = await UserModel.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(204).end();
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
