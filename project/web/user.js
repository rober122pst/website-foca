import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import User from '../models/User.js'

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {       
        const user = await response.json();
        res.render('dashboard', { username: data.username });
    }catch (err){
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
    }
});


