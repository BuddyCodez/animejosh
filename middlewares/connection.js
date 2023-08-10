import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect("mongodb+srv://admin:JewNsEn6pfKcTw4z@cluster0.jkdpzxh.mongodb.net/AnimeVite?retryWrites=true&w=majority");
        console.log('Connected to MongoDB');
    }
};

export default connectToMongoDB;
