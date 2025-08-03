import * as admin from 'firebase-admin'; 
import { Request, Response, NextFunction } from 'express';

export interface AuthentucatedRequestCheck extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const protect = async (req: AuthentucatedRequestCheck, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            req.user = await admin.auth().verifyIdToken(token);
            
            next();
        } catch (error) {
            console.error('Error while verifying Firebase ID token:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};