import { promisify } from 'node:util';
import { spawn, exec as execCallback } from 'child_process';
import { setDiceSide, getDices } from '../state/state.js';
const exec = promisify(execCallback);

/**
 * MAC-ADDRESSES:
 * 94:B9:7E:FE:F3:96
 * 94:B9:7E:FE:F8:EA
 * <?>
 * <?>
 */


// todo get mac-address and binding number from env
const { stdout, stderr } = await exec('sudo rfcomm bind 1 94:B9:7E:FE:F3:96');
console.log('bind', { stdout, stderr })

process.on('SIGINT', async () => {});
process.on('SIGTERM', () => {});

// todo get binding number from env
const picocom = spawn('picocom', ['/dev/rfcomm1', '-b', '115200']);
picocom.stdout.on('data', (data) => {
	setDiceSide(data);
	console.log(getDices());
});
picocom.stderr.on('data', (data) => console.error(`stderr: ${data}`));


// todo get binding number from env
picocom.on('exit', async () => {
	const { stdout, stderr } = await exec('sudo rfcomm release rfcomm1');
	console.log('release',{ stdout, stderr })
});