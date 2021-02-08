import { UserPrivacy } from './user-privacy.entity';

export const userPrivacyProvider = [
    {
        provide: 'UserPrivacyRepository',
        useValue: UserPrivacy
    },
];