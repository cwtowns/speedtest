import express from 'express';
import bodyParser from 'body-parser';
import url from 'url';
import * as queryString from 'querystring';

import { SpeedTestQueryRange, DetailedQueryResult, SpeedTestModel } from './speedTestDb';

//const { parse: parseQuery } = require('querystring');

const router = express.Router();

interface Example {
    foo: 'foobar' | 'bogleg' | 'hyah';
}


const { check, oneOf, validationResult, buildCheckFunction } = require('express-validator');

const checkBodyAndQuery = buildCheckFunction(['query']);

router.get('/example', oneOf([
    checkBodyAndQuery('foo').isIn(['foobar', 'bogleg', 'hyah'])
]), (req, res, next) => {
  try {
    validationResult(req).throw();


    const exampleFoo : Example = req.query.foo;
    

    const bar = exampleFoo.foo
  } catch (err) {
    // Oh noes. This user doesn't have enough skills for this...
    res.status(400).json(...);
  }
});



router.get('/speedtest', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const aggregate: string = req.query['aggregate'] as string;
    const howFarBackUnits: string = req.query['howFarBackUnits'] as string;
    const howFarBackValue: number = parseInt(req.query['howFarBackValue'] as string); //this is wrong
    const howFarBackStartDate: string = req.query['howFarBackStartDate'] as string;  //need to calculate this

    if(!aggregate || (aggregate !== 'hourly' && aggregate !== 'daily' && aggregate != 'monthly')) {
        res.send("error aggregate");
        return;
    }

    if(!howFarBackUnits || (howFarBackUnits !== 'hour'&& howFarBackUnits !== 'day' && howFarBackUnits !== 'year')) {
        res.send("error howFarBackUnits");
        return;
    }

    const requestQuery : SpeedTestQueryRange = {
        aggregate : aggregate,
        howFarBack : {
            units: howFarBackUnits,
            value: howFarBackValue,
            startDate: howFarBackStartDate
        }
    };

    const result : DetailedQueryResult = await SpeedTestModel.findRecordsInRange(requestQuery);

    res.send(JSON.stringify(result));

    //res.send('Hello World from speedtest!')
});

export default router;