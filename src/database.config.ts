import dotenv from 'dotenv';
import path from 'path';

import { createConnection } from 'mysql2';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const con = createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const createDBCommand = `CREATE DATABASE ${process.env.DB_NAME}`;

con.query(createDBCommand, (err, res) => {
    if (err) throw err;
    console.log('Database created');
});

const createTableCommand = `
    CREATE TABLE ${process.env.DB_NAME}.stats
`;
