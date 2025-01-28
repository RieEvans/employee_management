const sql = require('mssql');
require('dotenv').config();

const sqlConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'Jeonsoft',
    server: process.env.DB_SERVER,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 2019,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false, // For Windows SQL Server
        trustServerCertificate: true,
        enableArithAbort: false,
    },
};

const dbMiddleWare = async (req, res, next) => {
    if (!res.locals.conn) {
        try {
            const pool = await sql.connect(sqlConfig);
            res.locals.conn = pool;
            console.log('Database connection established');
        } catch (error) {
            console.error('Database connection failed:', error.message);
            return res.status(500).json({ message: 'Database connection failed' });
        }
    }
    next();
};

module.exports = dbMiddleWare;
