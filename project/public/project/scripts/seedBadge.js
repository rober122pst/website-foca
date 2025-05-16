import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Badge from '../models/Badges.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI 
const badgesPath = path.join(__dirname, 'badges.json');
const badgeData = JSON.parse(fs.readFileSync(badgesPath, 'utf-8'));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true
})
.then(async () => {
  console.log('Conectado ao MongoDB!');
  await Badge.deleteMany(); // Limpa as badges existentes
  await Badge.insertMany(badgeData); // Insere novas
  console.log('Badges inseridas com sucesso!');
  mongoose.disconnect();
})
.catch(err => {
  console.error('Erro ao conectar:', err);
});
