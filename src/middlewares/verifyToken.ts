import { Request, Response, NextFunction } from 'express';
import Jwt, { Secret } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any; 
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        if (!jwtSecretKey) {
            throw new Error('JWT secret key is not defined');
        }

        const decoded = Jwt.verify(token, jwtSecretKey as Secret);
        req.user = decoded;
        
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    return next();
};
