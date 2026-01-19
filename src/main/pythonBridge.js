const { spawn } = require('child_process');
const path = require('path');
const EventEmitter = require('events');

class PythonBridge extends EventEmitter {
    constructor() {
        super();
        this.process = null;
        this.buffer = '';
    }

    start() {
        const pythonPath = 'python';
        const scriptPath = path.join(__dirname, '../../backend/main.py');

        this.process = spawn(pythonPath, ['-u', scriptPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.process.stdout.on('data', (data) => {
            this.buffer += data.toString();
            this.processBuffer();
        });

        this.process.stderr.on('data', (data) => {
            const error = data.toString();
            console.error('Python Error:', error);
            this.emit('error', error);
        });

        this.process.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code !== 0 && code !== null) {
                this.emit('error', `Process exited with code ${code}`);
            }
        });

        console.log('Python bridge started');
    }

    processBuffer() {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const event = JSON.parse(line);
                    this.emit('event', event);
                } catch (e) {
                    console.error('Failed to parse JSON:', line);
                }
            }
        }
    }

    sendCommand(command) {
        if (this.process && this.process.stdin.writable) {
            const commandStr = JSON.stringify(command) + '\n';
            this.process.stdin.write(commandStr);
        }
    }

    stop() {
        if (this.process) {
            this.process.kill('SIGTERM');
            this.process = null;
        }
    }
}

module.exports = PythonBridge;
