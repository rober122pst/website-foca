import mongoose from 'mongoose';
import { defaultMaxListeners } from 'nodemailer/lib/xoauth2';

const routineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    frequency: [{ type: String, enum: ['0', '1', '2', '3', '4', '5', '6'], default: ['0', '1', '2', '3', '4', '5', '6'] }],
    timeStart: Date,
    timeEnd: Date,
    //timeDisplay: String, // Ex: "07:30"
    completedToday: { type: Boolean, default: false },
    lastCompletedAt: Date,
    completedDays: [{ type: Date }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Routine', routineSchema);
