import { LastLocation } from './last-location.entity';

export const lastLocationProvider = [
    {
        provide: 'LastLocationRepository',
        useValue: LastLocation,
    },
];