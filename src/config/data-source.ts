import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const entitiesExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
const entitiesDir = process.env.NODE_ENV === 'production' ? 'dist/entities' : 'src/entities';
const migrationsDir = process.env.NODE_ENV === 'production' ? 'dist/migrations' : 'src/migrations';
const subscribersDir = process.env.NODE_ENV === 'production' ? 'dist/subscribers' : 'src/subscribers';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Danie#2230',
    database: process.env.DB_DATABASE || 'medical_clinic',
    synchronize: false,
    logging: true,
    entities: [`${entitiesDir}/**/*.${entitiesExtension}`],
    migrations: [`${migrationsDir}/**/*.${entitiesExtension}`],
    subscribers: [`${subscribersDir}/**/*.${entitiesExtension}`],
}); 