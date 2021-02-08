import {
    Table, Model, Column, PrimaryKey, AllowNull, ForeignKey, DataType,
    CreatedAt, UpdatedAt, DeletedAt, Unique, Default
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'userPrivacy' })
export class UserPrivacy extends Model<UserPrivacy> {

    @PrimaryKey
    @Unique
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;

    @AllowNull(false)
    @Default(true)
    @Column({ field: 'imgAvatarPublic', type: DataType.BOOLEAN })
    imgAvatarPublic: boolean;

    @AllowNull(false)
    @Default(true)
    @Column({ field: 'cityPublic', type: DataType.BOOLEAN })
    cityPublic: boolean;

    @AllowNull(false)
    @Default(true)
    @Column({ field: 'companyPublic', type: DataType.BOOLEAN })
    companyPublic: boolean;

    @AllowNull(false)
    @Default(true)
    @Column({ field: 'relationTypePublic', type: DataType.BOOLEAN })
    relationTypePublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'linkedinProfilePublic', type: DataType.BOOLEAN })
    linkedinProfilePublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'facebookProfilePublic', type: DataType.BOOLEAN })
    facebookProfilePublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'twitterProfilePublic', type: DataType.BOOLEAN })
    twitterProfilePublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'instagramProfilePublic', type: DataType.BOOLEAN })
    instagramProfilePublic: boolean;

    @CreatedAt
    @AllowNull(false)
    @Column({ field: 'createdAt', type: DataType.DATE })
    createdAt: Date;

    @UpdatedAt
    @AllowNull(false)
    @Column({ field: 'updatedAt', type: DataType.DATE })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deletedAt', type: DataType.DATE })
    deletedAt: Date;
}