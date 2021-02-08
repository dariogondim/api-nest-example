import {
    Table, Model, PrimaryKey, AllowNull, Column, DataType, CreatedAt, UpdatedAt,
    DeletedAt, Unique, ForeignKey, Default
} from 'sequelize-typescript';

import { RelationType } from '../relation-type/relation-type.enum';
import { User } from '../user/user.entity';

@Table({ tableName: 'profile'})
export class Profile extends Model<Profile> {

    @PrimaryKey
    @Unique
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;

    @AllowNull(false)
    @Column({ field: 'name', type: DataType.TEXT })
    name: string;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'xperMentor', type: DataType.BOOLEAN })
    xperMentor: boolean;

    @Column({ field: 'imgAvatar', type: DataType.TEXT })
    imgAvatar: string;

    @Column({ field: 'phone', type: DataType.TEXT })
    phone: string;

    @Column({ field: 'country', type: DataType.TEXT })
    country: string;

    @Column({ field: 'city', type: DataType.TEXT })
    city: string;

    @Column({ field: 'company', type: DataType.TEXT })
    company: string;

    @Column({
        field: 'relationType',
        type: DataType.ENUM(
            RelationType[RelationType.INVESTOR],
            RelationType[RelationType.EMPLOYEE],
            RelationType[RelationType.LIBERAL_PROFESSIONAL],
            RelationType[RelationType.STARTUP_OWNER],
            RelationType[RelationType.COMPANY_OWNER]
        )
    })
    relationType: RelationType;

    @Column({ field: 'linkedinProfile', type: DataType.TEXT })
    linkedinProfile: string;

    @Column({ field: 'facebookProfile', type: DataType.TEXT })
    facebookProfile: string;

    @Column({ field: 'twitterProfile', type: DataType.TEXT })
    twitterProfile: string;

    @Column({ field: 'instagramProfile', type: DataType.TEXT })
    instagramProfile: string;

    @Column({ field: 'nearbyRadiusDistance', type: DataType.INTEGER })
    nearbyRadiusDistance: number;

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