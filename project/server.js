import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import userRoutes from './routes/user.js';
import routinesRoutes from './routes/routines.js';
import dotenv from 'dotenv';
import auth from './middlewares/auth.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routines', routinesRoutes);

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
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.CLIENT_URL}/api/user/${id}`, {method: 'GET', headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTdlMjMzZjYzMGFlNTY2MjU2ODg0OCIsInVzZXJuYW1lIjoiUm9iZXIxMjIiLCJpYXQiOjE3NDY2Mzc5OTMsImV4cCI6MTc0NjcyNDM5M30.k8g0_vqeX2R-ET-5-vZJwUQcaThPKcYj2MFJe7gHYO4`}});
        if(!response.ok){
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        const data = await response.json();
        res.render('dashboard', { username: data.username });
    }catch (err){
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
    }
});
app.get('/user/:id/rotina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'routine.html'));;
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));