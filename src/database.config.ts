import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
import { createConnection } from 'mysql2/promise';

const __root = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__root);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const conn = await createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const createDBCommand = `CREATE DATABASE ${process.env.DB_NAME}`;
const createRUNSCommand = `
    CREATE TABLE ${process.env.DB_NAME}.runs 
    (
        id int NOT NULL AUTO_INCREMENT,
        suites int,
        tests int,
        passes int,
        pending int,
        failures int,
        start DATETIME,
        end DATETIME,
        duration int,
        testsRegistered int,
        passPercent int,
        pendingPercent int,
        other int,
        skipped int,
        PRIMARY KEY (id)
    );
`;

const createRESULTSCommand = `
    CREATE TABLE ${process.env.DB_NAME}.results
    (
        id int NOT NULL AUTO_INCREMENT,
        uuid VARCHAR(36) NOT NULL,
        parentUUID VARCHAR(36) NOT NULL,
        parentTitle VARCHAR(255),
        file VARCHAR(255),
        title VARCHAR(255),
        fullTitle VARCHAR(255),
        timeOut VARCHAR(255),
        duration int,
        state VARCHAR(100),
        speed VARCHAR(100),
        pass boolean,
        fail boolean,
        pending boolean,
        context VARCHAR(255),
        err LONGTEXT,
        isHook boolean,
        skipped boolean,
        dt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );
`;

try {
    await conn.execute(createDBCommand);
} catch (error) {
    throw error;
} finally {
    console.log('Database created');
}

try {
    await conn.execute(createRUNSCommand);
} catch (error) {
    throw error;
} finally {
    console.log('Table RUNS created');
}

try {
    await conn.execute(createRESULTSCommand);
} catch (error) {
    throw error;
} finally {
    console.log('Table RESULTS created');
}

process.exit();
