"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     DoctorRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - specialty
 *         - crm
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do médico
 *         email:
 *           type: string
 *           format: email
 *           description: Email do médico
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do médico
 *         specialty:
 *           type: string
 *           description: Especialidade médica
 *         crm:
 *           type: string
 *           description: Número do CRM
 *     PatientRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - cpf
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do paciente
 *         email:
 *           type: string
 *           format: email
 *           description: Email do paciente
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do paciente
 *         cpf:
 *           type: string
 *           description: CPF do paciente
 *         phone:
 *           type: string
 *           description: Telefone do paciente
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 */
/**
 * @swagger
 * /api/auth/register/doctor:
 *   post:
 *     summary: Registra um novo médico
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorRegister'
 *     responses:
 *       201:
 *         description: Médico registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já registrado
 */
router.post('/register/doctor', auth_controller_1.AuthController.registerDoctor);
/**
 * @swagger
 * /api/auth/register/patient:
 *   post:
 *     summary: Registra um novo paciente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientRegister'
 *     responses:
 *       201:
 *         description: Paciente registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já registrado
 */
router.post('/register/patient', auth_controller_1.AuthController.registerPatient);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', auth_controller_1.AuthController.login);
/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Lista todos os usuários (apenas para teste)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/users', auth_controller_1.AuthController.listUsers);
exports.default = router;
