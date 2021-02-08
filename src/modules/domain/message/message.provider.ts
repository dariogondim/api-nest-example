import { Message } from './message.entity';

export const messageProvider = [
    {
        provide: 'MessageRepository',
        useValue: Message,
    },
];