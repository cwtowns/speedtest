import * as util from 'util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

export const invokeSpeedTest = async () : Promise<string> => {
    console.log("attempting to invoke process");
    const { stdout } = await exec('speedtest -fjson --accept-license');
    return stdout;
}; 