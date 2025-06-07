"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - doctorId
 *         - patientId
 *         - date
 *       properties:
 *         doctorId:
 *           type: string
 *           format: uuid
 *           description: ID do médico
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID do paciente
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora da consulta
 *         description:
 *           type: string
 *           description: Descrição ou notas da consulta
 *         status:
 *           type: string
 *           enum: [SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED]
 *           description: Status da consulta
 */
/**
 * @swagger
 * /api/appointments/all:
 *   get:
 *     summary: Lista todas as consultas (rota pública)
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de consultas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/all', appointment_controller_1.AppointmentController.listAll);
// Todas as outras rotas requerem autenticação
router.use(auth_middleware_1.authMiddleware);
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Cria uma nova consulta
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', (0, auth_middleware_1.checkRole)(['doctor', 'patient']), appointment_controller_1.AppointmentController.create);
/**
 * @swagger
 * /api/appointments/doctor:
 *   get:
 *     summary: Lista todas as consultas do médico
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas do médico
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/doctor', (0, auth_middleware_1.checkRole)(['doctor']), appointment_controller_1.AppointmentController.getDoctorAppointments);
/**
 * @swagger
 * /api/appointments/patient:
 *   get:
 *     summary: Lista todas as consultas do paciente
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas do paciente
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/patient', (0, auth_middleware_1.checkRole)(['patient']), appointment_controller_1.AppointmentController.getPatientAppointments);
/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualiza uma consulta
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Consulta não encontrada
 *   delete:
 *     summary: Remove uma consulta
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta removida com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Consulta não encontrada
 */
router.put('/:id', (0, auth_middleware_1.checkRole)(['doctor']), appointment_controller_1.AppointmentController.update);
router.delete('/:id', (0, auth_middleware_1.checkRole)(['doctor']), appointment_controller_1.AppointmentController.delete);
exports.default = router;
