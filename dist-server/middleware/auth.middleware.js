import { verifyToken } from "../utils/jwt";
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
