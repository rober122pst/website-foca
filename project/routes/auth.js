import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import utils from '../utils.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Registro
router.post('/register', utils.loginLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email já cadastrado.' });
        
        const hashedPassword = await utils.hashPassword(password)
        const newUser = new User({ username, email, password: hashedPassword, verified: false });
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        await newUser.save();
        
        await utils.sendVerificationEmail(newUser.email, verificationToken);
        res.status(201).json({ message: `Usuário ${email} criado com sucesso`, verificationToken });
        console.log(req.body);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno ' + err });
        console.log(req.body);
    }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      return res.status(403).json({ error: 'Conta bloqueada. Tente mais tarde.' });
    }
    if (!isMatch) {
      user.failedAttempts += 1;
      user.lastFailedLogin = Date.now();

      if (user.failedAttempts >= 5) {
        user.lockedUntil = Date.now() + 10 * 60 * 1000; // 10 min
      }

      await user.save();
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Conta não verificada. Verifique seu e-mail.' });
    }

    user.failedAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { 
        _id: user._id, 
        userId: user.userId, 
        username: user.username, 
        role: user.role, 
        plan: user.plan,
        preferences: {
          language: user.preferences.language, 
          theme: user.preferences.theme, 
        } 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
    console.error(err);
  }
});

router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).send('Usuário não encontrado');
    if (user.verified) return res.send('Conta já verificada.');

    user.verified = true;
    await user.save();

    res.send('Conta verificada com sucesso!');
  } catch (err) {
    res.status(400).send('Conta não encontrada ou expirada.');
  }
});

router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Este e-mail já foi verificado.' });
    }

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    utils.sendVerificationEmail(email, verificationToken);

    res.json({ message: 'E-mail de verificação reenviado com sucesso!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

router.post('/check-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ error: 'E-mail não enviado' });

  const user = await User.findOne({ email });

  if (!user) return res.json({ notFound: true });
  if (user.verified) return res.json({ verified: true });

  return res.json({ verified: false });
});

router.post('/forgot-password', async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});

  if(!user) return res.json({message: 'Se existir, o link será enviado.'})

  const token = utils.generateToken();
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 *60 *30; // 30 min
  await user.save();

  utils.sendEmail(email, {
    subject: 'Redefinição de senha',
    html: `
      <h2>Clique no botão para redefinir sua senha.</h2>
      <a href="http://127.0.0.1:5500/auth/reset.html?token=${token}"><button>Redefinir senha</button></a>
    `
  });
  console.log(email)
  res.json({menssage: 'Se existir, o link será enviado.'});
});

router.post('/reset-password', async (req, res) => {
  const {token, newPassword} = req.body;
  const user = await User.findOne({resetToken: token});
  console.log(user)
  if(!user || user.resetTokenExpires < Date.now()) {
    return res.status(400).json({error: 'Link inválido ou expirado.'})
  }

  user.password = await utils.hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined
  await user.save();
  
  res.json({message: 'Senha alterada com sucesso!'})
});

export default router;
