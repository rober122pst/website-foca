import mongoose from "mongoose";

const FriendshipSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    friendsSince: Date
});

export default mongoose.model('Friendship', FriendshipSchema);