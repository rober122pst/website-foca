import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
    name: String,
    description: String,
    cost: Number,
    image: String,
    ownedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Reward', rewardSchema);