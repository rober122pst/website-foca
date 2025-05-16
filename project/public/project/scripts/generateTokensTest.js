// generateToken.js
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const user = {
    _id: '6817e233f630ae5662568848', // ID de algum usuário real do seu banco
    email: 'teste@foca.com',
    role: 'user'
};

const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' }); // mesma secret do seu backend

console.log('Token de teste:', token);
