import Friendship from '../models/Friendship.js';

export default async (req, res, next) => {
    try {
        const userId = req.user?._id || req.params._id;

        if (!userId) return res.status(400).json({ error: 'Usuário não informado' });

        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        });

        const friendIds = friendships.map(f =>
            f.requester.toString() === userId.toString() ? f.recipient : f.requester
        );

        // Inclui o próprio usuário
        friendIds.push(userId);

        req.friendsIds = friendIds;
        next();
    } catch (err) {
        console.error('Erro ao carregar amigos:', err);
        res.status(500).json({ error: 'Erro ao carregar amigos' });
    }
};