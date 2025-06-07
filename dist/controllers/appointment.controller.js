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
exports.AppointmentController = void 0;
const data_source_1 = require("../config/data-source");
const Appointment_1 = require("../entities/Appointment");
const Doctor_1 = require("../entities/Doctor");
const Patient_1 = require("../entities/Patient");
class AppointmentController {
    static listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const appointments = yield appointmentRepository.find({
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
            }
            catch (error) {
                console.error('Error fetching all appointments:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentData = req.body;
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const doctorRepository = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
                const patientRepository = data_source_1.AppDataSource.getRepository(Patient_1.Patient);
                const doctor = yield doctorRepository.findOne({
                    where: { id: appointmentData.doctorId }
                });
                if (!doctor) {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
                const patient = yield patientRepository.findOne({
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
                yield appointmentRepository.save(appointment);
                return res.status(201).json(appointment);
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static getDoctorAppointments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || req.user.role !== 'doctor') {
                    return res.status(403).json({ message: 'Unauthorized' });
                }
                const doctorId = req.user.id;
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const appointments = yield appointmentRepository.find({
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
            }
            catch (error) {
                console.error('Error fetching doctor appointments:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static getPatientAppointments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user || req.user.role !== 'patient') {
                    return res.status(403).json({ message: 'Unauthorized' });
                }
                const patientId = req.user.id;
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const appointments = yield appointmentRepository.find({
                    where: { patient: { id: patientId } },
                    relations: ['doctor'],
                    order: { appointment_date: 'ASC' }
                });
                return res.json(appointments);
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const appointment = yield appointmentRepository.findOne({
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
                yield appointmentRepository.save(appointment);
                return res.json(appointment);
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
                const appointment = yield appointmentRepository.findOne({
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
                yield appointmentRepository.remove(appointment);
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.AppointmentController = AppointmentController;
