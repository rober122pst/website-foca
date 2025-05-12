import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export default (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token ausente' });

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // deve conter o _id
        // console.log(req.user)
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
