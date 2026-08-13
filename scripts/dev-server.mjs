import { spawn } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
let hostname = '0.0.0.0';
let port = '3000';

for (let index = 0; index < args.length; index += 1) {
  if ((args[index] === '--host' || args[index] === '--hostname' || args[index] === '-H') && args[index + 1]) hostname = args[++index];
  else if ((args[index] === '--port' || args[index] === '-p') && args[index + 1]) port = args[++index];
}

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'dev', '--hostname', hostname, '--port', port], { stdio: 'inherit', env: process.env });

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => signal ? process.kill(process.pid, signal) : process.exit(code || 0));
