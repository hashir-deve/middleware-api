const jwt = require('jsonwebtoken');

JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

function verifyToken(req, res, next) {
    const bearerHeader = req.header('Authorization');
    const token = bearerHeader.replace('Bearer ','');
    if (!token)
    {
        return res.status(401).json({ error: 'Access denied' });
    } 
    try 
    {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } 
    catch (error) 
    {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;