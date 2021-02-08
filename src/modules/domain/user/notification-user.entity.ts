import {
    Model, Table, Column, PrimaryKey, AllowNull, ForeignKey, DataType,
    CreatedAt, UpdatedAt, DeletedAt, Unique, BelongsTo
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'notificationUser' })
export class NotificationUser extends Model<NotificationUser> {

    @PrimaryKey
    @Unique
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;
    
    @AllowNull(false)
    @Column({ field: 'token', type: DataType.TEXT })
    token: string;

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

    @BelongsTo(() => User)
    user: User;
}