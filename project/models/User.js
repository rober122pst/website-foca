import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890ABCDEFG', 8)
const userSchema = new mongoose.Schema({
    // Auth basico
    userId: { type: String, unique: true, default: nanoid() },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    // User infos
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    //// Preferencias
    preferences: {
        focusDuration: { type: Number, default: 25 },
        breakDuration: { type: Number, default: 5 },
        notificationsEnabled: { type: Boolean, default: true },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        language: { type: String, default: 'pt-BR' },
        blockedApps: [{ type: String }],
        blockedSites: [{ type: String }],
    },
    //// Produtividade
    productivityStats: {
        totalFocusSessions: { type: Number, default: 0 },
        totalTimeFocused: { type: Number, default: 0 }, // em minutos
        dailyStreak: { type: Number, default: 0 },
        lastSessionDate: Date
    },
    //// Gamificação
    gamification: {
        level: { type: Number, default: 1 },
        experience: { type: Number, default: 0 },
        experienceToNextLevel: { type: Number, default: 100 },
        coins: { type: Number, default: 0 }, // para recompensas e personalizações
        badgesEarned: [{ 
          badgeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Badge'},
          earnedAt: Date
        }],
        quests: [{
          title: String,
          description: String,
          completed: { type: Boolean, default: false },
          rewardXP: Number,
          rewardCoins: Number
        }]
    },      
    //// Perfil
    profile: {
        avatarUrl: { type: String, default: '' },
        bio: { type: String, default: '' },
        links: [{ type: String, default: '' }],
    },
    // Plano
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    planExpiresAt: Date,
    // Segurança e login
    resetToken: String,
    resetTokenExpires: Date,
    failedAttempts: { type: Number, default: 0 },
    lastFailedLogin: Date,
    lockedUntil: Date,
    lastLogin: Date,
});

export default mongoose.model('User', userSchema);
