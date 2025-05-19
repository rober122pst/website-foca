import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import userRoutes from './routes/user.js';
import routinesRoutes from './routes/routines.js';
import sessionRoutes from './routes/sessions.js';
import challengeRoutes from './routes/dailyChallenge.js';
import rankingRoutes from './routes/ranking.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/daily-challenge', challengeRoutes);
app.use('/api/ranking', rankingRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth', 'login.html'));
});
app.get('/auth/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth', 'verify.html'));
});
app.get('/auth/forgot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth', 'forgot.html'));
});
app.get('/auth/reset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth', 'reset.html'));
});
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'dashboard.html'));;
});
app.get('/user/rotina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'routine.html'));;
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));