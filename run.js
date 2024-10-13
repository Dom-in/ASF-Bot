const { spawn } = require('child_process');
const path = require('path');

function runFile(filePath) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(filePath);
        console.log(`Running file: ${fileName}`);
        
        const process = spawn('node', [filePath]);

        let stderrOutput = '';
        let stdoutOutput = '';

        process.stdout.on('data', (data) => {
            stdoutOutput += data.toString();
            console.log(`Output from ${fileName}: ${data.toString().trim()}`);
        });

        process.stderr.on('data', (data) => {
            stderrOutput += data.toString();
            console.error(`Error from ${fileName}: ${data.toString().trim()}`);
        });

        process.on('close', (code) => {
            console.log(`${fileName} exited with code ${code}`);
            if (code === 0) {
                if (stderrOutput) {
                    console.warn(`Warnings occurred while running ${fileName}:\n${stderrOutput}`);
                }
                resolve(stdoutOutput);
            } else {
                reject(new Error(`Execution of ${fileName} failed with exit code ${code}.\nErrors:\n${stderrOutput}`));
            }
        });

        process.on('error', (err) => {
            reject(new Error(`Error while running ${fileName}: ${err.message}`));
        });
    });
}



async function run() {
    try {
        console.log('Executing regcmd.js...');
        await runFile(`${__dirname}/regcmd.js`);
        console.log('regcmd.js executed successfully.');
        
        console.log('Executing index.js...');
        
        const mainProcess = spawn('node', [`${__dirname}/index.js`]);

        mainProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(output);
        });

        mainProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            console.error(`index.js error: ${output}`);
        });

        mainProcess.on('close', (code) => {
            console.log(`index.js exited with code ${code}`);
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

run();