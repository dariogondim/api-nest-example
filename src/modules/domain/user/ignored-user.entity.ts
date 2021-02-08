import {
    Model, Table, Column, PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo, DataType,
    CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'ignoredUser' })
export class IgnoredUser extends Model<IgnoredUser> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ field: 'id', type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => User)
    @Column({ field: 'ignoredUserId', type: DataType.INTEGER })
    ignoredUserId: number;

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