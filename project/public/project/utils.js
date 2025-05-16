import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();


// Limita 5 tentativas a cada 10 minutos por IP
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 10 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

async function sendEmail(email, emailContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Foca" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
  });
}


async function sendVerificationEmail(email, token) {
  const url = `${process.env.CLIENT_URL}/auth/verify.html?token=${token}`;
  await sendEmail(email, {
    subject: 'Confirme seu cadastro',
    html: `
      <h2>Bem-vindo(a) ao Foca!</h2>
      <p>Confirme seu e-mail clicando no link abaixo:</p>
      <a href="${url}">Confirmar meu e-mail</a>
      <p>Se você não criou essa conta, apenas ignore.</p>
      <p>Atenciosamente,</p>
      <p>Equipe Foca</p>`,
  });
}  

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

import crypto from 'crypto';

function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex'); // gera token seguro
}

export default { sendVerificationEmail, sendEmail, hashPassword, generateToken, loginLimiter }