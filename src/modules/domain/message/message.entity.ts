import {
    Model, Table, Column, PrimaryKey, AutoIncrement, AllowNull, DataType, ForeignKey,
    Default, CreatedAt, UpdatedAt, DeletedAt
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'message' })
export class Message extends Model<Message> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ field: 'id', type: DataType.BIGINT })
    id: number;

    @ForeignKey(() => User)
    @Column({ field: 'senderId', type: DataType.INTEGER })
    senderId: number;

    @ForeignKey(() => User)
    @Column({ field: 'receiverId', type: DataType.INTEGER })
    receiverId: number;

    /*@BelongsTo(() => User)
    user: User;*/

    @AllowNull(false)
    @Column({ field: 'content', type: DataType.TEXT })
    content: string;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'isRead', type: DataType.BOOLEAN })
    isRead: boolean;

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