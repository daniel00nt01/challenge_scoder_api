import { Router } from 'express';
import { AppDataSource } from '../config/data-source';

const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
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

export default healthRouter; 