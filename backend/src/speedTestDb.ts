import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import dayjs from 'dayjs'
import { SpeedTestQueryRange } from './types/SpeedTestQueryRange'
import { model } from 'mongoose';

const getDateFormatForAggregate = (queryRange: SpeedTestQueryRange, aggregateFor: "records" | "aggregate"): string | null => {

    if(aggregateFor === "records") {
        //we want the aggregate to calculate the average for whatever grouping has been specified by the client
        switch (queryRange.aggregate) {
            case "daily": return "%d";
            case "hourly": return "%H";
            case "monthly": return "%m";
            default: throw Error("argument out of range:  " + queryRange.aggregate);
        }
    }
    else {        
        return null;  //we want the aggregate to calculate the averages for the entire date range in a single record
    }
};

export class SpeedTestClass {
    @prop({ index: true })
    public executionDate: Date = new Date();
    @prop()
    public packetLoss: number = 0;
    @prop()
    public jitter: number = 0;
    @prop()
    public downloadBandwidthBytes: number = 0;
    @prop()
    public uploadBandwidthBytes: number = 0;
    @prop()
    public latency: number = 0;
    @prop()
    public rawResult: string = "";

    private static getAggregateObject(this: ReturnModelType<typeof SpeedTestClass>, range: SpeedTestQueryRange, aggregateFor: "records" | "aggregate") : object {
        const aggregateInfo: object = {
            $group: {
                "_id": {
                    "$dateToString": {
                        format: getDateFormatForAggregate(range, aggregateFor),
                        date: "$executionDate"
                    }
                },                
                id: {
                    "$dateToString": {
                        format: getDateFormatForAggregate(range, aggregateFor),
                        date: "$executionDate"
                    }
                },
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
        const startTime = new Date(dayjs().subtract(range.howFarBack.value, range.howFarBack.units).toISOString()).toISOString();
        const endTime = new Date(range.howFarBack.startDate).toISOString();

        
        const mainRecords = await this.aggregate([
            {
                "$match": {
                    executionDate: {
                        $gte: startTime,
                        $lte: endTime
                    }
                }
            }, this.getAggregateObject(range, "records")
        ]);

        const aggregateRecords = await this.aggregate([
            {
                "$match": {
                    executionDate: {
                        $gte: startTime,
                        $lte: endTime
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
    public _id: number = 0;

    @prop()
    public maxDownloadBandwidthBytes: number = 0;
    @prop()
    public minDownloadBandwidthBytes: number = 0;
    @prop()
    public averageDownloadBandwidthBytes: number = 0;

    @prop()
    public maxUploadBandwidthBytes: number = 0;
    @prop()
    public minUplodBandwidthBytes: number = 0;
    @prop()
    public averageUploadBandwidthBytes: number = 0;

    @prop()
    public maxLatency: number = 0;
    @prop()
    public minLatency: number = 0;
    @prop()
    public averageLatency: number = 0;

    @prop()
    public maxPacketLoss: number = 0;
    @prop()
    public minPacketLoss: number = 0;
    @prop()
    public averagePacketLoss: number = 0;

    @prop()
    public maxJitter: number = 0;
    @prop()
    public minJitter: number = 0;
    @prop()
    public averageJitter: number = 0;

    @prop()
    public dataPoints: number = 0;
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
};

export const writeResult = async (jsonResults: string): Promise<void> => {
    if (!jsonResults)
        throw Error("Arugment out of range:  jsonResults");

    const resultObject: SpeedTestUtilityResult = {} as SpeedTestUtilityResult;
    let objectData = JSON.parse(jsonResults);
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