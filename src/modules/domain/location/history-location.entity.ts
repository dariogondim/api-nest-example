import {
    Table, Model, PrimaryKey, AutoIncrement, AllowNull, Column, DataType, ForeignKey, CreatedAt, UpdatedAt, DeletedAt, BelongsTo
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'historyLocation' })
export class HistoryLocation extends Model<HistoryLocation> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ field: 'id', type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;

    @AllowNull(false)
    @Column({ field: 'latitude', type: DataType.NUMERIC })
    latitude: number;

    @AllowNull(false)
    @Column({ field: 'longitude', type: DataType.NUMERIC })
    longitude: number;

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