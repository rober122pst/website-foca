import Task from '../models/User.js'

export const getUsers = async (req, res) => {
    const users = await User.find({ _id: req.user._id });
    res.json(users);
};

export const getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
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
