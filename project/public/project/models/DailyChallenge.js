import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    rewardXP: Number,
    rewardCoins: Number,
    date: { type: Date, default: Date.now },
    usersCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Challenge', challengeSchema);