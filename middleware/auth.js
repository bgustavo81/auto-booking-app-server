const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    // pull the token from header
    const token = req.header("x-auth-token");
    // check if there isn't a token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied!"});
    }

    // verify if there is a token
    try {
        const decoded = jwt.verify(token, process.env.JwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not Valid!"});
    }
};