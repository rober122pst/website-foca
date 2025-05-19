import mongoose from 'mongoose';

const weeklyStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thisWeek: [{ type: Number, default: [0,0,0,0,0,0,0] }],
    lastWeek: [{ type: Number, default: [0,0,0,0,0,0,0] }],
    updateAt: { type: Date, default: Date.now},
    focusStats: {
        totalThisWeek: Number,
        totalLastWeek: Number,
        diffPercent: Number,
        isIncrease:{ type: Boolean, default: false }
    } 
});

export default mongoose.model('WeeklyStats', weeklyStatsSchema);