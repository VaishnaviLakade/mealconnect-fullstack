import jwt from "jsonwebtoken";

const donorAuthMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Donor:", decoded);  // Log decoded token
        req.donor = decoded; // Attach donor info to request
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: "Invalid Token" });
    }
};

export default donorAuthMiddleware;
