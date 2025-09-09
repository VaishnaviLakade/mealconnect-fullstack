import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.receiver = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
