import * as util from 'util';

const exec = util.promisify(require('child_process').exec);

export const invokeSpeedTest = async () : Promise<string> => {
    console.log("attempting to invoke process");
    const { stdout, stderr } = await exec('speedtest -fjson --accept-license');
    return stdout;
}; 