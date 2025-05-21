import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth', 'login.html'));
});
router.get('/auth/verify', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth', 'verify.html'));
});
router.get('/auth/forgot', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth', 'forgot.html'));
});
router.get('/auth/reset', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth', 'reset.html'));
});
router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'dashboard.html'));;
});
router.get('/user/rotina', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'routine.html'));;
});
router.get('/user/session', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'session.html'));;
});
router.get('/user/tarefas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'task.html'));;
});
router.get('/profile/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views', 'profile.html'));;
});

export default router;