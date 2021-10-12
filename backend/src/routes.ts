import express from 'express';
import bodyParser from 'body-parser';
import url from 'url';
import * as queryString from 'querystring';
import { DetailedQueryResult, SpeedTestModel } from './speedTestDb';
import { SpeedTestQueryRange } from './types/SpeedTestQueryRange';
import validate from './types/SpeedTestQueryRange.validator';
import {StatusCodes} from 'http-status-codes';
import ajv, { ValidationError } from 'ajv';

const router = express.Router();


router.get('/speedtest', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const requestQuery : SpeedTestQueryRange = validate(req.query);

        if(requestQuery) {
           console.log("data"); 
        }
        else {
            console.log("nope");
        }

        const result: DetailedQueryResult = await SpeedTestModel.findRecordsInRange(requestQuery);
        res.send(JSON.stringify(result));        
    }
    catch(err) {
        if(err instanceof Error) {
            res.status(StatusCodes.BAD_REQUEST).send(err.message);
        }
        
        res.status(StatusCodes.BAD_REQUEST).send();
    }
});

export default router;