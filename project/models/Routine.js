import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    frequency: [{ type: String, enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] }],
    time: Date,
    timeDisplay: String, // Ex: "07:30"
    completedToday: { type: Boolean, default: false },
    lastCompletedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Routine', routineSchema);
