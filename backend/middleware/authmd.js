import jwt from "jsonwebtoken";

export const authmd = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach donor_id from decoded token to req.body
    req.body.donor_id = decoded.userId; // Ensure the token contains userId

    next(); // Pass control to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
