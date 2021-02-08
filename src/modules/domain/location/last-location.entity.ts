import {
    Model, Table, Column, PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo,
    CreatedAt, DataType, UpdatedAt, DeletedAt
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'lastLocation' })
export class LastLocation extends Model<LastLocation> {

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