import { BtModelPrivacy } from './bt-model-privacy.entity';

export const btModelPrivacyProvider = [
    {
        provide: 'BtModelPrivacyRepository',
        useValue: BtModelPrivacy
    },
];