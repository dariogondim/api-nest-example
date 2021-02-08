import { IgnoredUser } from './ignored-user.entity';

export const ignoredUserProvider = [
    {
        provide: 'IgnoredUserRepository',
        useValue: IgnoredUser,
    },
];