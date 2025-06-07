import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

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
router.get('/all', AppointmentController.listAll);

// Todas as outras rotas requerem autenticação
router.use(authMiddleware as any);

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
router.post('/', checkRole(['doctor', 'patient']) as any, AppointmentController.create as any);

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
router.get('/doctor', checkRole(['doctor']) as any, AppointmentController.getDoctorAppointments as any);

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
router.get('/patient', checkRole(['patient']) as any, AppointmentController.getPatientAppointments as any);

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
router.put('/:id', checkRole(['doctor']) as any, AppointmentController.update as any);
router.delete('/:id', checkRole(['doctor']) as any, AppointmentController.delete as any);

export default router; 