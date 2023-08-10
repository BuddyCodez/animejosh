// pages/api/comments/all.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { CommentModel } from '../../../models/comment';
import { mongooseMiddleware } from '@/middlewares/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        await mongooseMiddleware(req, res, async () => {
            try {
                const { animeId } = req.query;
                // Retrieve all comments
                const comments = await CommentModel.find({ animeId }).populate('user').populate('replies');

                return res.status(200).json(comments);
            } catch (error) {
                console.error('Error retrieving comments:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
