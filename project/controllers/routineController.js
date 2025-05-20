import Routines from '../models/Routine.js'

export const createRoutine = async (req, res) => {
    try {
        const routine = new Routines({ ...req.body, userId: req.user._id });
        await routine.save();
        console.log(routine)
        res.status(201).json(routine);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getRoutine = async (req, res) => {
    const routine = await Routines.find({ userId: req.user._id });
    res.json(routine);
};

export const getRoutineById = async (req, res) => {
    const routine = await Routines.findOne({ _id: req.params.id, userId: req.user._id });
    if (!routine) return res.status(404).json({ error: 'Rotina não encontrada' });
    res.json(routine);
};

export const updateRoutine = async (req, res) => {
    const routine = await Routines.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
    );
    if (!routine) return res.status(404).json({ error: 'Rotina não encontrada' });
    res.json(routine);
};

export const deleteRoutine = async (req, res) => {
    const result = await Routines.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Rotina não encontrada' });
    res.json({ message: 'Rotina deletada' });
};

export const getTodayRoutine = async (req, res) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (domingo) a 6 (sábado)
    const routines = await Routines.find({ userId: req.user._id });
    const todayRoutine = routines.filter(routine => routine.frequency.includes(dayOfWeek.toString()));
    res.json(todayRoutine);
}

export const updateTodayRoutine = async (req, res) => {
    const routine = await Routines.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $addToSet: req.body, updatedAt: new Date() },
        { new: true }
    );
    if (!routine) return res.status(404).json({ error: 'Rotina não encontrada' });
    res.json(routine);
}