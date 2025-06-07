import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { RegisterDoctorDto, RegisterPatientDto, LoginDto } from '../dtos/auth.dto';

export class AuthController {
    // Método para listar usuários (apenas para teste)
    static async listUsers(req: Request, res: Response): Promise<Response> {
        try {
            const doctorRepository = AppDataSource.getRepository(Doctor);
            const patientRepository = AppDataSource.getRepository(Patient);

            const doctors = await doctorRepository.find();
            const patients = await patientRepository.find();

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
        } catch (error) {
            console.error('Error listing users:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async registerDoctor(req: Request, res: Response): Promise<Response> {
        try {
            const doctorData: RegisterDoctorDto = req.body;
            const doctorRepository = AppDataSource.getRepository(Doctor);

            const existingDoctor = await doctorRepository.findOne({
                where: { email: doctorData.email }
            });

            if (existingDoctor) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await hash(doctorData.password, 10);
            const doctor = doctorRepository.create({
                ...doctorData,
                password: hashedPassword,
                role: 'doctor'
            });

            await doctorRepository.save(doctor);
            return res.status(201).json({ 
                message: 'Doctor registered successfully',
                id: doctor.id
            });
        } catch (error) {
            console.error('Error registering doctor:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async registerPatient(req: Request, res: Response): Promise<Response> {
        try {
            const patientData: RegisterPatientDto = req.body;
            const patientRepository = AppDataSource.getRepository(Patient);

            const existingPatient = await patientRepository.findOne({
                where: { email: patientData.email }
            });

            if (existingPatient) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await hash(patientData.password, 10);
            const patient = patientRepository.create({
                ...patientData,
                password: hashedPassword,
                role: 'patient'
            });

            await patientRepository.save(patient);
            return res.status(201).json({ 
                message: 'Patient registered successfully',
                id: patient.id
            });
        } catch (error) {
            console.error('Error registering patient:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password }: LoginDto = req.body;
            const doctorRepository = AppDataSource.getRepository(Doctor);
            const patientRepository = AppDataSource.getRepository(Patient);

            const doctor = await doctorRepository.findOne({ where: { email } });
            const patient = await patientRepository.findOne({ where: { email } });
            const user = doctor || patient;

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const passwordMatch = await compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const secret = process.env.JWT_SECRET || 'default_secret';
            const token = sign(
                { id: user.id, role: doctor ? 'doctor' : 'patient' },
                secret,
                { expiresIn: '1d' }
            );

            return res.json({ 
                token,
                id: user.id,
                role: doctor ? 'doctor' : 'patient'
            });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
} 