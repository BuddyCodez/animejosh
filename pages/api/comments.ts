// pages/api/comments.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { CommentModel, IComment } from '../../models/comment';
import UserModel from '../../models/user';
import { mongooseMiddleware } from '@/middlewares/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await mongooseMiddleware(req, res, async () => {
    switch (method) {

      case 'POST':
        try {
          const { animeId, text, userId } = req.body;
          console.log('animeId:', animeId); // Debugging log

          // Find the user
          const user = await UserModel.findById(userId) as any;

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          if (!user.comments) {
            user.comments = [];
          }

          // Create a new comment
          const newCommentData = {
            animeId: animeId,
            text,
            user: userId,
            replies: [],
          };

          const newComment = await CommentModel.create(newCommentData);
          console.log('newCommentData:', newCommentData); // Debugging log

          // Add the comment to the user's comments
          user.comments.push(newComment._id); // Make sure user is defined
          await user.save(); // Save the user with the updated comments array

          return res.status(201).json(newComment);
        } catch (error) {
          console.error('Error adding comment:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      case 'DELETE':
        try {
          // Extract comment ID from the query parameter
          const { id } = req.query;

          // Find the comment
          const comment = await CommentModel.findById(id);

          if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
          }

          // Remove the comment ID from the user's comments array using $pull operation
          await UserModel.updateOne({ _id: comment.user }, { $pull: { comments: comment._id } });

          // Delete the comment
          await CommentModel.deleteOne({ _id: id });

          return res.status(204).end();
        } catch (error) {
          console.error('Error deleting comment:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
        break;
    }
  });
}
