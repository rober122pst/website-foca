import User from '../models/User.js'

export const getUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
};

export const getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const publicData = {
        _id: user._id,
        username: user.username,
        gamification: user.gamification,
        profile: user.profile,
    };
    res.json(publicData);
};

export const updateUser = async (req, res) => {
    const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
};

export const deleteUser = async (req, res) => {
    const result = await User.findOneAndDelete({ _id: req.params.id });
    if (!result) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário deletado' });
};
