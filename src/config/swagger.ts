import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Medical Clinic API',
            version: '1.0.0',
            description: 'API para gerenciamento de clínica médica',
            contact: {
                name: 'API Support',
                email: 'support@medicalclinic.com'
            }
        },
        servers: [
            {
                url: 'https://167.99.230.88',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        './dist/routes/*.js',
        './dist/entities/*.js',
        './src/routes/*.ts',
        './src/entities/*.ts'
    ]
};

export const specs = swaggerJsdoc(options); 