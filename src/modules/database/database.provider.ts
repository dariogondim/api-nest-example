import * as dotenv from 'dotenv';
dotenv.config();

import { BtModel } from './../domain/bt-model/bt-model.entity';
import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './config';
import { User } from '../domain/user/user.entity';
import { Profile } from '../domain/profile/profile.entity';
import { Relationship } from '../domain/relationship/relationship.entity';
import { LastLocation } from '../domain/location/last-location.entity';
import { HistoryLocation } from '../domain/location/history-location.entity';
import { Message } from '../domain/message/message.entity';
import { IgnoredUser } from '../domain/user/ignored-user.entity';
import { BtModelPrivacy } from '../domain/bt-model-privacy/bt-model-privacy.entity';
import { UserPrivacy } from '../domain/user-privacy/user-privacy.entity';
import { NotificationUser } from '../domain/user/notification-user.entity';

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case 'prod':
            case 'production':
                config = databaseConfig.production;
                break;
            case 'dev':
            case 'development':
                config = databaseConfig.development;
                break;
            case 'staging':
                config = databaseConfig.staging;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([
            User,
            Profile,
            BtModel,
            Relationship,
            LastLocation,
            HistoryLocation,
            Message,
            IgnoredUser,
            BtModelPrivacy,
            UserPrivacy,
            NotificationUser
        ]);
        // await sequelize.sync();
        return sequelize;
    },
  },
];