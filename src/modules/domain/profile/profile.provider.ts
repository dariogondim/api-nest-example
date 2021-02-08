import { Profile } from './profile.entity';

export const profileProvider = [
    {
        provide: 'ProfileRepository',
        useValue: Profile,
    },
];