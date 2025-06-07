import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Appointment } from '../entities/Appointment';
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dtos/appointment.dto';

type RequestWithUser = Request & {
    user?: {
        id: string;
        role: 'doctor' | 'patient';
    }
};

export class AppointmentController {
    static async listAll(req: Request, res: Response) {
        try {
            const appointmentRepository = AppDataSource.getRepository(Appointment);

            const appointments = await appointmentRepository.find({
                relations: ['doctor', 'patient'],
                order: { appointment_date: 'ASC' },
                select: {
                    id: true,
                    appointment_date: true,
                    notes: true,
                    status: true,
                    doctor: {
                        id: true,
                        name: true,
                        crm: true,
                        specialization: true
                    },
                    patient: {
                        id: true,
                        name: true,
                        phone: true,
                        health_insurance: true
                    }
                }
            });

            return res.json({
                total: appointments.length,
                appointments: appointments.map(appointment => ({
                    id: appointment.id,
                    date: appointment.appointment_date,
                    notes: appointment.notes,
                    status: appointment.status,
                    doctor: {
                        id: appointment.doctor.id,
                        name: appointment.doctor.name,
                        crm: appointment.doctor.crm,
                        specialization: appointment.doctor.specialization
                    },
                    patient: {
                        id: appointment.patient.id,
                        name: appointment.patient.name,
                        phone: appointment.patient.phone,
                        health_insurance: appointment.patient.health_insurance
                    }
                }))
            });
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async create(req: RequestWithUser, res: Response) {
        try {
            const appointmentData: CreateAppointmentDto = req.body;
            const appointmentRepository = AppDataSource.getRepository(Appointment);
            const doctorRepository = AppDataSource.getRepository(Doctor);
            const patientRepository = AppDataSource.getRepository(Patient);

            const doctor = await doctorRepository.findOne({
                where: { id: appointmentData.doctorId }
            });

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            const patient = await patientRepository.findOne({
                where: { id: appointmentData.patientId }
            });

            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const appointment = appointmentRepository.create({
                doctor,
                patient,
                appointment_date: new Date(appointmentData.appointment_date),
                notes: appointmentData.notes,
                status: 'scheduled'
            });

            await appointmentRepository.save(appointment);
            return res.status(201).json(appointment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getDoctorAppointments(req: RequestWithUser, res: Response) {
        try {
            if (!req.user || req.user.role !== 'doctor') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const doctorId = req.user.id;
            const appointmentRepository = AppDataSource.getRepository(Appointment);

            const appointments = await appointmentRepository.find({
                where: { doctor: { id: doctorId } },
                relations: ['patient'],
                order: { appointment_date: 'ASC' },
                select: {
                    id: true,
                    appointment_date: true,
                    notes: true,
                    status: true,
                    patient: {
                        id: true,
                        name: true,
                        phone: true,
                        health_insurance: true
                    }
                }
            });

            return res.json({
                total: appointments.length,
                appointments: appointments.map(appointment => ({
                    id: appointment.id,
                    date: appointment.appointment_date,
                    notes: appointment.notes,
                    status: appointment.status,
                    patient: {
                        id: appointment.patient.id,
                        name: appointment.patient.name,
                        phone: appointment.patient.phone,
                        health_insurance: appointment.patient.health_insurance
                    }
                }))
            });
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getPatientAppointments(req: RequestWithUser, res: Response) {
        try {
            if (!req.user || req.user.role !== 'patient') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const patientId = req.user.id;
            const appointmentRepository = AppDataSource.getRepository(Appointment);

            const appointments = await appointmentRepository.find({
                where: { patient: { id: patientId } },
                relations: ['doctor'],
                order: { appointment_date: 'ASC' }
            });

            return res.json(appointments);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async update(req: RequestWithUser, res: Response) {
        try {
            const { id } = req.params;
            const updateData: UpdateAppointmentDto = req.body;
            const appointmentRepository = AppDataSource.getRepository(Appointment);

            const appointment = await appointmentRepository.findOne({
                where: { id },
                relations: ['doctor', 'patient']
            });

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            // Check if user has permission to update
            if (!req.user || (req.user.role === 'patient' && appointment.patient.id !== req.user.id) ||
                (req.user.role === 'doctor' && appointment.doctor.id !== req.user.id)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            if (updateData.appointment_date) {
                appointment.appointment_date = new Date(updateData.appointment_date);
            }
            if (updateData.notes !== undefined) {
                appointment.notes = updateData.notes;
            }
            if (updateData.status) {
                appointment.status = updateData.status;
            }

            await appointmentRepository.save(appointment);
            return res.json(appointment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async delete(req: RequestWithUser, res: Response) {
        try {
            const { id } = req.params;
            const appointmentRepository = AppDataSource.getRepository(Appointment);

            const appointment = await appointmentRepository.findOne({
                where: { id },
                relations: ['doctor', 'patient']
            });

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            // Check if user has permission to delete
            if (!req.user || (req.user.role === 'patient' && appointment.patient.id !== req.user.id) ||
                (req.user.role === 'doctor' && appointment.doctor.id !== req.user.id)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            await appointmentRepository.remove(appointment);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
} 