import {
    Table, Column, Model, PrimaryKey, AutoIncrement, AllowNull, DataType,
    CreatedAt, UpdatedAt, DeletedAt, Unique, HasOne,
} from 'sequelize-typescript';

import { Profile } from '../profile/profile.entity';
import { UserPrivacy } from '../user-privacy/user-privacy.entity';

@Table({ tableName: 'user' })
export class User extends Model<User> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    id: number;

    @Unique
    @Column
    mail: string;

    @Column
    password: string;

    @HasOne(() => Profile)
    profile: Profile;

    @HasOne(() => UserPrivacy)
    privacy: UserPrivacy;

    @CreatedAt
    @AllowNull(false)
    @Column({ type: DataType.DATE })
    createdAt: Date;

    @UpdatedAt
    @AllowNull(false)
    @Column({ type: DataType.DATE })
    updatedAt: Date;

    @DeletedAt
    @Column({ type: DataType.DATE })
    deletedAt: Date;

}