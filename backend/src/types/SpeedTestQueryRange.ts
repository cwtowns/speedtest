//regenerate the validator with npx typescript-json-validator src/types/SpeedTestQueryRange.ts SpeedTestQueryRange
export interface SpeedTestQueryRange {
    howFarBack: {
        units: 'hour' | 'day' | 'year';
        value: number;
        startDate: string;
    }
    aggregate: 'hourly' | 'daily' | 'monthly';
}

export default SpeedTestQueryRange