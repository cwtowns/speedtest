import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import dayjs from 'dayjs'
import { SpeedTestQueryRange } from './types/SpeedTestQueryRange'
import { model } from 'mongoose';

const getDateFormatForAggregate = (queryRange: SpeedTestQueryRange, aggregateFor: "records" | "aggregate"): object | null => {

    if(aggregateFor === "records") {
        //we want the aggregate to calculate the average for whatever grouping has been specified by the client
        switch (queryRange.howFarBack.units) {
            case "year": return { "$dateToString" : { "format" : "%m", "date" : "$executionDate"} }; 
            case "hour": return { "$dateToString" : { "format" : "%H", "date" : "$executionDate"} }
            case "day": return { "$dateToString" : { "format" : "%d", "date" : "$executionDate"} }
            default: throw Error("argument out of range:  " + queryRange.aggregate);
        }
    }

    return null;  //we want the aggregate to calculate the averages for the entire date range in a single record
};

export class SpeedTestClass {
    @prop({ index: true })
    public executionDate: Date = new Date();
    @prop()
    public packetLoss = 0;
    @prop()
    public jitter = 0;
    @prop()
    public downloadBandwidthBytes = 0;
    @prop()
    public uploadBandwidthBytes = 0;
    @prop()
    public latency = 0;
    @prop()
    public rawResult = "";

    private static getAggregateObject(this: ReturnModelType<typeof SpeedTestClass>, range: SpeedTestQueryRange, aggregateFor: "records" | "aggregate") : object {
        const aggregateInfo: object = {
            $group: {
                "_id": getDateFormatForAggregate(range, aggregateFor),
                //id: getDateFormatForAggregate(range, aggregateFor),
                averagePacketLoss: {
                    $avg: "$packetLoss"
                },
                averageJitter: {
                    $avg: "$jitter"
                },
                averageDownloadBandwidthBytes: {
                    $avg: "$downloadBandwidthBytes"
                },
                averageUploadBandwidthBytes: {
                    $avg: "$uploadBandwidthBytes"
                },
                averageLatency: {
                    $avg: "$latency"
                },
                maxPacketLoss: {
                    $max: "$packetLoss"
                },
                maxJitter: {
                    $max: "$jitter"
                },
                maxDownloadBandwidthBytes: {
                    $max: "$downloadBandwidthBytes"
                },
                maxUploadBandwidthBytes: {
                    $max: "$uploadBandwidthBytes"
                },
                maxLatency: {
                    $max: "$latency"
                },
                minPacketLoss: {
                    $min: "$packetLoss"
                },
                minJitter: {
                    $min: "$jitter"
                },
                minDownloadBandwidthBytes: {
                    $min: "$downloadBandwidthBytes"
                },
                minUploadBandwidthBytes: {
                    $min: "$uploadBandwidthBytes"
                },
                minLatency: {
                    $min: "$latency"
                },
                dataPoints: {
                    $sum: 1
                }
            }
        };        

        return aggregateInfo;
    }

    public static async findRecordsInRange(this: ReturnModelType<typeof SpeedTestClass>, range: SpeedTestQueryRange): Promise<DetailedQueryResult> {
        const endTime = new Date(range.howFarBack.startDate);
        console.log("endTime " + endTime);
        const startTime = dayjs(endTime).subtract(range.howFarBack.value, range.howFarBack.units).toDate();
        console.log("startTime " + startTime);
        
        const mainRecords = await this.aggregate([
            {
                "$match": {
                    executionDate: {
                        $lte: endTime,
                        $gte: startTime
                    }
                }
            }, this.getAggregateObject(range, "records"),
            { $sort : { _id : 1 } }
        ]);

        const aggregateRecords = await this.aggregate([
            {
                "$match": {
                    executionDate: {
                        $lte: endTime,
                        $gte: startTime
                    }
                }
            }, this.getAggregateObject(range, "aggregate")
        ]);

        const result: DetailedQueryResult = {
            records: mainRecords,
            aggregate: aggregateRecords[0]
        };

        return result;
    }
}

export interface DetailedQueryResult {
    aggregate: SpeedTestAggregate;
    records: SpeedTestAggregate[];
}

export class SpeedTestAggregate {
    @prop()
    public _id = 0;

    @prop()
    public maxDownloadBandwidthBytes = 0;
    @prop()
    public minDownloadBandwidthBytes = 0;
    @prop()
    public averageDownloadBandwidthBytes = 0;

    @prop()
    public maxUploadBandwidthBytes = 0;
    @prop()
    public minUplodBandwidthBytes = 0;
    @prop()
    public averageUploadBandwidthBytes = 0;

    @prop()
    public maxLatency = 0;
    @prop()
    public minLatency = 0;
    @prop()
    public averageLatency = 0;

    @prop()
    public maxPacketLoss = 0;
    @prop()
    public minPacketLoss = 0;
    @prop()
    public averagePacketLoss = 0;

    @prop()
    public maxJitter = 0;
    @prop()
    public minJitter = 0;
    @prop()
    public averageJitter = 0;

    @prop()
    public dataPoints = 0;
}

interface SpeedTestResults {
    records: SpeedTestClass[];
    aggregate: object;
}

export const SpeedTestModel = getModelForClass(SpeedTestClass, { schemaOptions: { timestamps: true, collection: "SpeedTests" } });

/**
 * A partial representation of the json structure returned from the speedtest utility.
 */
interface SpeedTestUtilityResult {
    "timestamp": string;
    "ping": {
        "jitter": number;
        "latency": number;
    };
    "download": {
        "bandwidth": number;
    };
    "upload": {
        "bandwidth": number;
    };
}

export const writeResult = async (jsonResults: string): Promise<void> => {
    if (!jsonResults)
        throw Error("Arugment out of range:  jsonResults");

    const resultObject: SpeedTestUtilityResult = {} as SpeedTestUtilityResult;
    const objectData = JSON.parse(jsonResults);
    Object.assign(resultObject, objectData);

    const instance = new SpeedTestClass();

    instance.executionDate = new Date(Date.parse(resultObject.timestamp));
    instance.latency = resultObject.ping.latency;
    instance.jitter = resultObject.ping.jitter;
    instance.downloadBandwidthBytes = resultObject.download.bandwidth;
    instance.uploadBandwidthBytes = resultObject.upload.bandwidth;
    instance.rawResult = jsonResults;

    const model = new SpeedTestModel(instance);

    await model.save();

    console.log("db results written, new record is " + model._id);
};



export const get = async (query: SpeedTestQueryRange): Promise<DetailedQueryResult> => {
    return await SpeedTestModel.findRecordsInRange(query);
}