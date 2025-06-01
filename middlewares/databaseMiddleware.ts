import { Request, Response, NextFunction } from 'express';
import Database from '../db/database';

export const databaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const db = Database.getInstance();
    const originalSend = res.send;
    
    res.send = function(body?: any): Response {
        res.send = originalSend;
        return originalSend.call(this, body);
    };
    
    next();
};
