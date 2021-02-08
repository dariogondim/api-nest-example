import { BtModel } from './bt-model.entity';

export const btModelProvider = [
    {
        provide: 'BtModelRepository',
        useValue: BtModel,
    },
];