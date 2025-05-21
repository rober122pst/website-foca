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
import friendshipsRoutes from './routes/friendships.js';
import webRoutes from './routes/webRoutes.js';

import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));


app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/daily-challenge', challengeRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/friendships', friendshipsRoutes);

app.use('/', webRoutes);
app.get('/ws', (req, res) => {
    res.status(426).send('Esta rota é apenas para WebSocket'); // 426 - Upgrade Required
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        server.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));