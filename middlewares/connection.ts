// middlewares/mongooseMiddleware.ts

import mongoose, { ConnectOptions } from 'mongoose';


export const mongooseMiddleware = async (req: any, res: any, next: any) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // Not connected or connecting to the database
            await mongoose.connect("mongodb+srv://admin:JewNsEn6pfKcTw4z@cluster0.jkdpzxh.mongodb.net/AnimeVite?retryWrites=true&w=majority");
            console.log('Connected to MongoDB');
        }
        return next();
    } catch (error) {
        console.error('Mongoose middleware error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
