import User from '../models/User.js';
import Session from '../models/Session.js';
import Task from '../models/Task.js'
import { ObjectId } from 'mongodb'

export const getRankingGeral = async (req, res) => {
    try {

        const focoTotal = await Session.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalFoco: { $sum: "$duration" }
                }
            }
        ]);
        const tarefasTotal = await Task.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalTarefas: { $sum: 1 }
                }
            }
        ]);
        // Mapeia { jogadorId -> totalFoco }
        const focoMap = {};
        focoTotal.forEach(entry => {
            focoMap[entry._id.toString()] = entry.totalFoco;
        });

        const tarefasMap = {};
        tarefasTotal.forEach(entry => {
            tarefasMap[entry._id.toString()] = entry.totalTarefas;
        });
        // Ordena por XP decrescente, depois foco, depois tarefas
        const jogadores = await User.find();

        // Adiciona a posição dinamicamente
        const ranking = jogadores.map(jogador => {
            const focus = focoMap[jogador._id.toString()] || 0;
            const tasks = tarefasMap[jogador._id.toString()] || 0;
            return {
                username: jogador.username,
                level: jogador.gamification.level,
                xp: jogador.gamification.experience,
                focus,
                tasks,
                avatar: jogador.profile.avatarUrl
            };
        });
        ranking.sort((a, b) =>
            b.xp - a.xp || b.focus - a.focus || b.tasks - a.tasks
        );
        ranking.forEach((j, i) => j.pos = i + 1);
        res.json(ranking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
};

export const getRankingFriends = async (req, res) => {
    try {
        const amigosIds = req.friendsIds;
        const focoTotal = await Session.aggregate([
            { $match: { jogadorId: { $in: amigosIds } } },
            {
                $group: {
                    _id: "$userId",
                    totalFoco: { $sum: "$duration" }
                }
            }
        ]);
        const tarefasTotal = await Task.aggregate([
            { $match: { jogadorId: { $in: amigosIds } } },
            {
                $group: {
                    _id: "$userId",
                    totalTarefas: { $sum: 1 }
                }
            }
        ]);
        // Mapeia { jogadorId -> totalFoco }
        const focoMap = {};
        focoTotal.forEach(entry => {
            focoMap[entry._id.toString()] = entry.totalFoco;
        });

        const tarefasMap = {};
        tarefasTotal.forEach(entry => {
            tarefasMap[entry._id.toString()] = entry.totalTarefas;
        });
        // Ordena por XP decrescente, depois foco, depois tarefas
        const jogadores = await User.find({ _id: { $in: amigosIds } });

        // Adiciona a posição dinamicamente
        const ranking = jogadores.map(jogador => {
            const focus = focoMap[jogador._id.toString()] || 0;
            const tasks = tarefasMap[jogador._id.toString()] || 0;
            return {
                username: jogador.username,
                level: jogador.gamification.level,
                xp: jogador.gamification.experience,
                focus,
                tasks,
                avatar: jogador.profile.avatarUrl
            };
        });
        ranking.sort((a, b) =>
            b.xp - a.xp || b.focus - a.focus || b.tasks - a.tasks
        );
        ranking.forEach((j, i) => j.pos = i + 1);
        res.json(ranking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Erro ao gerar ranking dos amigos' });
    }
};