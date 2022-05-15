import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';

import { Output, OutputStats } from 'mochawesome';

import { fileURLToPath } from 'url';
import { createConnection } from 'mysql2';

import { convertToMySQLDateTime } from './utils.js';
import { IMochawesomeResult } from 'mochawesomeResult.model.js';


const __root = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__root);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const pathToReport = path.resolve(__dirname, '..', 'report', 'output.json');

if (!existsSync(pathToReport)) throw 'mochawesome report doesn\'t exists';

const reportFile = readFileSync(pathToReport, { encoding: 'ascii' });
const reportContent: Output = JSON.parse(reportFile);

const con = createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// RUN - RESUME
try {
    await new Promise((resolve, reject) => {
        const sqlCommand = insertRunSQLCommand({ reportStats: reportContent.stats});
        con.query((sqlCommand), (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
} catch (error) {
    throw error;
} finally {
    console.log('Run registered');
}

// RESULTS
try {
    await new Promise((resolve, reject) => {

        for (const result of reportContent.results) {
            const parentFile = result.file;

            for (const suite of result.suites) {
                const parentTitle = suite.title;

                for (const test of suite.tests) {
                    const resultItem: IMochawesomeResult = {
                        ...test,
                        parentTitle,
                        file: parentFile,
                    };

                    const sqlCommand = insertResultSQLCommand({ reportResult: resultItem});
                    con.query((sqlCommand), (err, res) => {
                        if (err) reject(err);
                    });
                }
            }
        }

        resolve('ended');

    });
} catch (error) {
    throw error;
} finally {
    console.log('Results registered');
    process.exit();
}

function insertRunSQLCommand (params: { reportStats: OutputStats }): string {
    const { reportStats } = params;

    const sqlCommand = `
        INSERT INTO runs 
        (
            suites,
            tests,
            passes,
            pending,
            failures,
            start,
            end,
            duration,
            testsRegistered,
            passPercent,
            pendingPercent,
            other,
            skipped
        ) 
        VALUES 
        (
            ${reportStats.suites} ,
            ${reportStats.tests} ,
            ${reportStats.passes} ,
            ${reportStats.pending} ,
            ${reportStats.failures} ,
            '${convertToMySQLDateTime({ datetime: reportStats.start })}' ,
            '${convertToMySQLDateTime({ datetime: reportStats.end })}' ,
            ${reportStats.duration} ,
            ${reportStats.testsRegistered} ,
            ${reportStats.passPercent} ,
            ${reportStats.pendingPercent} ,
            ${reportStats.other} ,
            ${reportStats.skipped}
        );
    `;

    return sqlCommand;
}

function insertResultSQLCommand (params: { reportResult: IMochawesomeResult }): string {
    const { reportResult } = params;

    const sqlCommand = `
        INSERT INTO results 
        (
            uuid,
            parentUUID,
            parentTitle,
            file,
            title,
            fullTitle,
            timeOut,
            duration,
            state,
            speed,
            pass,
            fail,
            pending,
            context,
            err,
            isHook,
            skipped
        )
        VALUES
        (
            '${reportResult.uuid}' ,
            '${reportResult.parentUUID}' ,
            '${reportResult.parentTitle}' ,
            '${reportResult.file}' ,
            '${reportResult.title}' ,
            '${reportResult.fullTitle}' ,
            '${reportResult.timeOut}' ,
            ${reportResult.duration} ,
            '${reportResult.state}' ,
            '${reportResult.speed}' ,
            ${reportResult.pass} ,
            ${reportResult.fail} ,
            ${reportResult.pending} ,
            '${reportResult.context}' ,
            'use the "reportResult.err" - !be careful! this prop returns full callstack' ,
            ${reportResult.isHook} ,
            ${reportResult.skipped}
        )
    `

    return sqlCommand;
}

