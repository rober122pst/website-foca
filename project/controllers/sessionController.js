import Session from '../models/Session.js'
import WeeklyStats from '../models/WeeklyStats.js'
import { ObjectId } from 'mongodb';

import moment from 'moment';

export const createSession = async (req, res) => {
    try {
        const session = new Session({ ...req.body, userId: req.user._id });
        await session.save();
        console.log(session)
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getSessions = async (req, res) => {
    const sessions = await Session.find({ userId: req.user._id });
    res.json(sessions);
};

export const getSessionById = async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ error: 'Sessão não encontrada' });
    res.json(session);
};

export const updateSession = async (req, res) => {
    const session = await Session.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
    );
    if (!session) return res.status(404).json({ error: 'Sessão não encontrada' });
    res.json(session);
};

export const deleteSession = async (req, res) => {
    const result = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Sessão não encontrada' });
    res.json({ message: 'Sessão deletada' });
};


export const sumSessionTime = async (req, res)=> {
    try {
        const sessions = await Session.find({ userId: req.user._id });
        const total = sessions.reduce((acc, session) => {
            return acc + session.duration;
        }, 0);
        res.json({ totalDuration: total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao calcular a duração total' });
    }
}

export const getWeeklySessions = async (req, res) => {
    try {
        const today = new Date();

        const cachedStats = await WeeklyStats.findOne({ userId: req.user._id }).lean();

        delete cachedStats._id;
        delete cachedStats.userId;

        // Só libera a partir de quinta-feira
        const dayOfWeek = today.getDay(); // domingo = 0, segunda = 1, ..., sábado = 6
        if (dayOfWeek < 4 && cachedStats) {
            return res.json({
                ...cachedStats,
                labels: ['Sexta', 'Sábado', 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta'],
                message: 'O gráfico estará disponível a partir de quinta-feira para garantir uma comparação justa entre as semanas.',
            });
        }

        if (dayOfWeek < 4 && !cachedStats) {
            return res.json({
                labels: ['Sexta', 'Sábado', 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta'],
                thisWeek: [0, 0, 0, 0, 0, 0, 0],
                lastWeek: [0, 0, 0, 0, 0, 0, 0],
                focusStats: {
                    totalThisWeek: 0,
                    totalLastWeek: 0,
                    diffPercent: 0,
                    isIncrease: false
                }
            });
        }

        const now = moment();
        const startOfThisWeek = now.clone().startOf('isoWeek');
        const startOfLastWeek = startOfThisWeek.clone().subtract(7, 'days');
        const endOfLastWeek = startOfThisWeek.clone().subtract(1, 'second');

        const [lastWeekData, thisWeekData] = await Promise.all([
            Session.aggregate([
            {
                $match: {
                    userId: new ObjectId(req.user._id),
                    startTime: { $gte: startOfLastWeek.toDate(), $lte: endOfLastWeek.toDate() },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$startTime' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            ]),
            Session.aggregate([
            {
                $match: {
                    userId: new ObjectId(req.user._id),
                    startTime: { $gte: startOfThisWeek.toDate(), $lte: now.toDate() },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$startTime' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            ]),
        ]);

        const formatData = (rawData) => {
            const result = Array(7).fill(0);
            rawData.forEach(item => {
                const dayIndex = (item._id + 1) % 7; // ajusta pra sexta = 0, quinta = 6
                result[dayIndex] = item.totalDuration;
            });
            return result;
        };

        const totalThisWeek = thisWeek.reduce((sum, val) => sum + val, 0);
        const totalLastWeek = lastWeek.reduce((sum, val) => sum + val, 0);

        // Evita divisão por zero
        const diffPercent = totalLastWeek > 0
        ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100)
        : 100; // Se semana passada foi 0, então é 100% de aumento

        const isIncrease = totalThisWeek >= totalLastWeek;

        await WeeklyStats.findOneAndUpdate(
            { userId: req.user._id },
            {
                labels: ['Sexta', 'Sábado', 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta'],
                thisWeek, 
                lastWeek, 
                updatedAt: new Date(),
                focusStats: {
                    totalThisWeek,
                    totalLastWeek,
                    diffPercent,
                    isIncrease
                } 
            },
            { upsert: true, new: true }
        );


        res.json({
            labels: ['Sexta', 'Sábado', 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta'],
            thisWeek: formatData(thisWeekData),
            lastWeek: formatData(lastWeekData),
            focusStats: {
                totalThisWeek,
                totalLastWeek,
                diffPercent,
                isIncrease
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar dados semanais.' });
    }
}