import { HistoryLocation } from './history-location.entity';

export const historyLocationProvider = [
    {
        provide: 'HistoryLocationRepository',
        useValue: HistoryLocation
    },
];