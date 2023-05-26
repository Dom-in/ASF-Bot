const { spawn } = require('child_process');

function runFile(filePath) {
    return new Promise((resolve, reject) => {
        const process = spawn('node', [filePath]);

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Execution of ${filePath} failed with exit code ${code}`));
            }
        });

        process.on('error', (err) => {
            reject(err);
        });
        
        process.stderr.on('data', (data) => {
            const errorOutput = data.toString().trim(); // Remove leading and trailing whitespace
            reject(new Error(errorOutput));
        });
    });
}

async function run() {
    try {
        console.log('Executing regcmd.js...');
        await runFile('regcmd.js');
        console.log('regcmd.js executed successfully.');

        console.log('Executing index.js...');
        const mainProcess = spawn('node', ['index.js']);

        mainProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`${output}`);
        });

        mainProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            console.error(`index.js error: ${output}`);
        });

        mainProcess.on('close', (code) => {
            console.log(`index.js exited with code ${code}`);
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

run();