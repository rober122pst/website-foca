import mongoose from 'mongoose';
import User from '../models/user.js';
import Badge from '../models/Badges.js';
import dotenv from 'dotenv';
dotenv.config(); // Lê o .env

// console.log(process.env.MONGO_URI)
// Conecta ao banco
await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
});


// Exemplo de IDs
const userId = '6817e233f630ae5662568848';
const badgeId = '68192716b9ba96fcdb26cb57';

// Atualiza o usuário, adicionando a badge
await User.findByIdAndUpdate(
    userId,
    { $push: { 'gamification.badgesEarned': badgeId } }
);

const user = await User.findById(userId).populate('gamification.badgesEarned');
console.log(user)

await mongoose.disconnect();