import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';

import * as db from './speedTestDb';
import * as program from './speedTestProgram';

const scheduler = new ToadScheduler()
const task = new Task('Speedtest', async () => { 
    console.log("Task executing");
    //TODO attempt to write to the database if we can't perform either?    
    //TODO how do we catch when we're stopping and abort the speedtest if its in progress?  
    //TODO investigate this:  https://github.com/kibertoad/toad-scheduler#:~:text=Note%20that%20in%20order%20to%20avoid%20memory%20leaks%2C%20it%20is%20recommended%20to%20use%20promise%20chains%20instead%20of%20async/await%20inside%20task%20definition.%20See%20talk%20on%20common%20Promise%20mistakes%20for%20more%20details.
    const result: string = await program.invokeSpeedTest();
    console.log("Speedtest results obtained");
    await db.writeResult(result);
    console.log("Speedtest results written");
});

export const startScheduler = () : ToadScheduler => {
    console.log("Creating new scheduler.");
    const job = new SimpleIntervalJob({ hours: 1, runImmediately: true}, task)
    scheduler.addSimpleIntervalJob(job);
    return scheduler;
}
 
export default startScheduler;
 