import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';

interface TokenPayload {
    id: string;
    role: 'doctor' | 'patient';
    iat: number;
    exp: number;
}

type RequestWithUser = Request & {
    user?: {
        id: string;
        role: 'doctor' | 'patient';
    }
};

export const authMiddleware = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, process.env.JWT_SECRET || 'default_secret') as TokenPayload;
        
        const repository = decoded.role === 'doctor' 
            ? AppDataSource.getRepository(Doctor)
            : AppDataSource.getRepository(Patient);

        const user = await repository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const checkRole = (roles: ('doctor' | 'patient')[]) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden' });
        }

        return next();
    };
}; 