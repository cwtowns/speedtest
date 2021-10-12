/* tslint:disable */
// generated by typescript-json-validator
import {inspect} from 'util';
import Ajv from 'ajv';
import SpeedTestQueryRange from './SpeedTestQueryRange';
export const ajv = new Ajv({"allErrors":true,"coerceTypes":false,"format":"fast","nullable":true,"unicode":true,"uniqueItems":true,"useDefaults":true});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export {SpeedTestQueryRange};
export const SpeedTestQueryRangeSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "defaultProperties": [
  ],
  "properties": {
    "aggregate": {
      "enum": [
        "daily",
        "hourly",
        "monthly"
      ],
      "type": "string"
    },
    "howFarBack": {
      "defaultProperties": [
      ],
      "properties": {
        "startDate": {
          "type": "string"
        },
        "units": {
          "enum": [
            "day",
            "hour",
            "year"
          ],
          "type": "string"
        },
        "value": {
          "type": "number"
        }
      },
      "required": [
        "startDate",
        "units",
        "value"
      ],
      "type": "object"
    }
  },
  "required": [
    "aggregate",
    "howFarBack"
  ],
  "type": "object"
};
export type ValidateFunction<T> = ((data: unknown) => data is T) & Pick<Ajv.ValidateFunction, 'errors'>
export const isSpeedTestQueryRange = ajv.compile(SpeedTestQueryRangeSchema) as ValidateFunction<SpeedTestQueryRange>;
export default function validate(value: unknown): SpeedTestQueryRange {
  if (isSpeedTestQueryRange(value)) {
    return value;
  } else {
    throw new Error(
      ajv.errorsText(isSpeedTestQueryRange.errors!.filter((e: any) => e.keyword !== 'if'), {dataVar: 'SpeedTestQueryRange'}) +
      '\n\n' +
      inspect(value),
    );
  }
}