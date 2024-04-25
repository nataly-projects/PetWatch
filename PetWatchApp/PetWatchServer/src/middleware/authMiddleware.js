require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
    return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    } 
    req.user = user;
    next();
    });
};

module.exports = authenticateToken;
