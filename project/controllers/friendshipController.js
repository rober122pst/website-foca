import Friendship from '../models/Friendship.js'

export const createFriendship = async (req, res) => {
    try {
        const friendship = new Friendship({ ...req.body, userId: req.user._id });
        await friendship.save();
        console.log(friendship)
        res.status(201).json(friendship);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// export const getTasks = async (req, res) => {
//     const tasks = await Task.find({ userId: req.user._id });
//     res.json(tasks);
// };

// export const getTaskById = async (req, res) => {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
//     res.json(task);
// };

// export const updateTask = async (req, res) => {
//     const task = await Task.findOneAndUpdate(
//         { _id: req.params.id, userId: req.user._id },
//         req.body,
//         { new: true }
//     );
//     if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
//     res.json(task);
// };

// export const deleteTask = async (req, res) => {
//     const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     if (!result) return res.status(404).json({ error: 'Tarefa não encontrada' });
//     res.json({ message: 'Tarefa deletada' });
// };
