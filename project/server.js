import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import userRoutes from './routes/user.js';
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
        const response = await fetch(`https://vigilant-fishstick-4x5p4vqr95jcjpr6-4000.app.github.dev/api/user/${id}`);
        if(!response.ok){
            return res.status(404).render('erro', { mensagem: 'Usuário não encontrado' });
        }
        const userData = await response.json();
        res.render('dashboard', { username: data.username });
    }catch (err){
        console.error(err);
        res.status(500).render('erro', { mensagem: 'Erro ao buscar usuário.' });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));