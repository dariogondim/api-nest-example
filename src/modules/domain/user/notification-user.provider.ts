import { NotificationUser } from './notification-user.entity';

export const notificationUserProvider = [
    {
        provide: 'NotificationUserRepository',
        useValue: NotificationUser,
    },
];