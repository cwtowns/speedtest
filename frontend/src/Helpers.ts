import { startOfHour, endOfDay, subDays } from "date-fns";

//TODO remove duplicate interface def
export interface SpeedTestQueryRange {
  howFarBack: {
    units: "hour" | "day" | "year";
    value: number;
    startDate: string;
  };
  aggregate: "hourly" | "daily" | "monthly";
}

export enum DataRangeOptions {
  Day,
  Week,
  Month,
  Year,
}

export const getSpeedTestQueryObject = (
  range: DataRangeOptions
): SpeedTestQueryRange => {
  const startDate =
    range === DataRangeOptions.Day
      ? startOfHour(new Date()).toISOString()
      : endOfDay(subDays(new Date(), 1)).toISOString();

  if (range === DataRangeOptions.Day) {
    return {
      howFarBack: {
        units: "day",
        value: 1,
        startDate,
      },
      aggregate: "hourly",
    };
  }

  if (range === DataRangeOptions.Week) {
    return {
      howFarBack: {
        units: "day",
        value: 7,
        startDate,
      },
      aggregate: "daily",
    };
  }

  if (range === DataRangeOptions.Month) {
    return {
      howFarBack: {
        units: "day",
        value: 30,
        startDate,
      },
      aggregate: "daily",
    };
  }
  return {
    howFarBack: {
      units: "year",
      value: 1,
      startDate,
    },
    aggregate: "monthly",
  };
};
