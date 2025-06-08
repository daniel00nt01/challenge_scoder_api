import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import appointmentRoutes from './routes/appointment.routes';
import { AppDataSource } from './config/data-source';
import 'express-async-errors';
import { specs } from './config/swagger';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());

// Configuração básica do Helmet
app.use(helmet.dnsPrefetchControl());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 0, includeSubDomains: false })); // Desabilita HSTS
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(express.json());

// Swagger Documentation
app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    // Remove headers que podem causar problemas
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    res.removeHeader('Cross-Origin-Resource-Policy');
    next();
}, swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'Medical Clinic API Documentation',
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showCommonExtensions: true
    }
}));

// Health Check
app.get('/health', async (req: Request, res: Response) => {
    try {
        // Verifica conexão com o banco
        await AppDataSource.query('SELECT 1');

        // Verifica uso de memória
        const memoryUsage = process.memoryUsage();
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB'
            },
            database: 'connected'
        };

        res.json(healthStatus);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: errorMessage
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

export default app; 