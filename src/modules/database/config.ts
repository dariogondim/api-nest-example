import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'eusadb',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: console.log,
        force: true,
        operatorsAliases: false
    },
    staging: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'eusadb',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: console.log,
        force: true,
        operatorsAliases: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false,
        force: true,
        operatorsAliases: false
    }
};