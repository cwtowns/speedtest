import axios from 'axios'
import { startOfHour, endOfDay, subDays } from 'date-fns'

const API = 'http://localhost:3000/api/speedtest'

//TODO remove duplicate interface def
interface SpeedTestQueryRange {
  howFarBack: {
    units: 'hour' | 'day' | 'year'
    value: number
    startDate: string
  }
  aggregate: 'hourly' | 'daily' | 'monthly'
}

export interface DetailedQueryResult {
  aggregate: SpeedTestAggregate
  records: SpeedTestAggregate[]
}

export class SpeedTestAggregate {
  public _id = 0

  public maxDownloadBandwidthBytes = 0
  public minDownloadBandwidthBytes = 0
  public averageDownloadBandwidthBytes = 0

  public maxUploadBandwidthBytes = 0
  public minUplodBandwidthBytes = 0
  public averageUploadBandwidthBytes = 0

  public maxLatency = 0
  public minLatency = 0
  public averageLatency = 0

  public maxPacketLoss = 0
  public minPacketLoss = 0
  public averagePacketLoss = 0

  public maxJitter = 0
  public minJitter = 0
  public averageJitter = 0

  public dataPoints = 0
}

export enum DataRangeOptions {
  Day,
  Week,
  Month,
  Year,
}

const getSpeedTestQueryObject = (
  range: DataRangeOptions
): SpeedTestQueryRange => {
  const startDate =
    range === DataRangeOptions.Day
      ? startOfHour(new Date()).toISOString()
      : endOfDay(subDays(new Date(), 1)).toISOString()

  if (range === DataRangeOptions.Day) {
    return {
      howFarBack: {
        units: 'day',
        value: 1,
        startDate,
      },
      aggregate: 'hourly',
    }
  }

  if (range === DataRangeOptions.Week) {
    return {
      howFarBack: {
        units: 'day',
        value: 7,
        startDate,
      },
      aggregate: 'daily',
    }
  }

  if (range === DataRangeOptions.Month) {
    return {
      howFarBack: {
        units: 'day',
        value: 30,
        startDate,
      },
      aggregate: 'daily',
    }
  }
  return {
    howFarBack: {
      units: 'year',
      value: 1,
      startDate,
    },
    aggregate: 'monthly',
  }
}

export const getData = async (
  range: DataRangeOptions
): Promise<DetailedQueryResult> => {
  const request = getSpeedTestQueryObject(range)
  console.log('getData', { request })
  const result = await axios.post(API, request)

  if (result.status !== 200) {
    throw new Error('getData:  backend responded ' + result.status)
  }
  const response = result.data
  console.log('getData', { response })
  return result.data as DetailedQueryResult
}
