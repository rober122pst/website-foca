const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.CLIENT_URL}/auth/verify.html?token=${token}`;

  await transporter.sendMail({
    from: `"Foca" <${process.env.EMAIL_USER}>`,
    to: email,
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


// Registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email já cadastrado.' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, verified: false });
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        await newUser.save();
        
        await sendVerificationEmail(newUser.email, verificationToken);
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
    if (!isMatch) return res.status(401).json({ message: 'Senha incorreta.' });

    if (!user.verified) {
      return res.status(403).json({ error: 'Conta não verificada. Verifique seu e-mail.' });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
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
      expiresIn: '1d',
    });
    sendVerificationEmail(email, verificationToken);

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

module.exports = router;
