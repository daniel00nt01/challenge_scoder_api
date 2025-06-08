"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = require("dotenv");
const swagger_ui_express_1 = __importDefault(require("U-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
require("express-async-errors");
const swagger_1 = require("./config/swagger");
// Load environment variables
(0, dotenv_1.config)();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Swagger Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/appointments', appointment_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
exports.default = app;
