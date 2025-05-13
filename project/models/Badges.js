import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iconUrl: { type: String }, // opcional
    description: { type: String },
    rewardXP: { type: Number, default: 0 },
    rewardCoins: { type: Number, default: 0 },
    type: { type: String, enum: ['meta', 'evento', 'especial'], default: 'meta' } // exemplo
});

export default mongoose.model('Badge', badgeSchema);
