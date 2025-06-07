"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const data_source_1 = require("../config/data-source");
const Doctor_1 = require("../entities/Doctor");
const Patient_1 = require("../entities/Patient");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || 'default_secret');
        const repository = decoded.role === 'doctor'
            ? data_source_1.AppDataSource.getRepository(Doctor_1.Doctor)
            : data_source_1.AppDataSource.getRepository(Patient_1.Patient);
        const user = yield repository.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        return next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});
exports.authMiddleware = authMiddleware;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden' });
        }
        return next();
    };
};
exports.checkRole = checkRole;
