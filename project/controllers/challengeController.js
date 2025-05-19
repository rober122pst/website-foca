import Challenges from '../models/DailyChallenge.js'

export const createChallenge = async (req, res) => {
    try {
        const challenge = new Challenges({ ...req.body });
        await challenge.save();
        console.log(challenge)
        res.status(201).json(challenge);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getChallenge = async (req, res) => {
    const challenge = await Challenges.findOne({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    if (!challenge) return res.status(404).json({ message: 'Sem desafios por hoje!'})
    res.json(challenge);
};

export const getChallengeById = async (req, res) => {
    const challenge = await Challenges.findOne({ _id: req.params.id });
    if (!challenge) return res.status(404).json({ error: 'Desafio não encontrada' });
    res.json(challenge);
};

export const updateChallenge = async (req, res) => {
    const challenge = await Challenges.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );
    if (!challenge) return res.status(404).json({ error: 'Desafio não encontrada' });
    res.json(challenge);
};

export const deleteChallenge = async (req, res) => {
    const result = await Challenges.findOneAndDelete({ _id: req.params.id });
    if (!result) return res.status(404).json({ error: 'Desafio não encontrada' });
    res.json({ message: 'Desafio deletada' });
};