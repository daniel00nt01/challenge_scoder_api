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
exports.AuthController = void 0;
const data_source_1 = require("../config/data-source");
const Doctor_1 = require("../entities/Doctor");
const Patient_1 = require("../entities/Patient");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    // Método para listar usuários (apenas para teste)
    static listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorRepository = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
                const patientRepository = data_source_1.AppDataSource.getRepository(Patient_1.Patient);
                const doctors = yield doctorRepository.find();
                const patients = yield patientRepository.find();
                return res.json({
                    doctors: doctors.map(d => ({
                        id: d.id,
                        name: d.name,
                        email: d.email,
                        crm: d.crm,
                        specialization: d.specialization
                    })),
                    patients: patients.map(p => ({
                        id: p.id,
                        name: p.name,
                        email: p.email,
                        birth_date: p.birth_date,
                        health_insurance: p.health_insurance
                    }))
                });
            }
            catch (error) {
                console.error('Error listing users:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static registerDoctor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorData = req.body;
                const doctorRepository = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
                const existingDoctor = yield doctorRepository.findOne({
                    where: { email: doctorData.email }
                });
                if (existingDoctor) {
                    return res.status(400).json({ message: 'Email already registered' });
                }
                const hashedPassword = yield (0, bcryptjs_1.hash)(doctorData.password, 10);
                const doctor = doctorRepository.create(Object.assign(Object.assign({}, doctorData), { password: hashedPassword, role: 'doctor' }));
                yield doctorRepository.save(doctor);
                return res.status(201).json({
                    message: 'Doctor registered successfully',
                    id: doctor.id
                });
            }
            catch (error) {
                console.error('Error registering doctor:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static registerPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patientData = req.body;
                const patientRepository = data_source_1.AppDataSource.getRepository(Patient_1.Patient);
                const existingPatient = yield patientRepository.findOne({
                    where: { email: patientData.email }
                });
                if (existingPatient) {
                    return res.status(400).json({ message: 'Email already registered' });
                }
                const hashedPassword = yield (0, bcryptjs_1.hash)(patientData.password, 10);
                const patient = patientRepository.create(Object.assign(Object.assign({}, patientData), { password: hashedPassword, role: 'patient' }));
                yield patientRepository.save(patient);
                return res.status(201).json({
                    message: 'Patient registered successfully',
                    id: patient.id
                });
            }
            catch (error) {
                console.error('Error registering patient:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const doctorRepository = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
                const patientRepository = data_source_1.AppDataSource.getRepository(Patient_1.Patient);
                const doctor = yield doctorRepository.findOne({ where: { email } });
                const patient = yield patientRepository.findOne({ where: { email } });
                const user = doctor || patient;
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const passwordMatch = yield (0, bcryptjs_1.compare)(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const secret = process.env.JWT_SECRET || 'default_secret';
                const token = (0, jsonwebtoken_1.sign)({ id: user.id, role: doctor ? 'doctor' : 'patient' }, secret, { expiresIn: '1d' });
                return res.json({
                    token,
                    id: user.id,
                    role: doctor ? 'doctor' : 'patient'
                });
            }
            catch (error) {
                console.error('Error during login:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.AuthController = AuthController;
