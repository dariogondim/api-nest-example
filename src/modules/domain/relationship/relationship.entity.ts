import {
    Model, Table, Column, PrimaryKey, AutoIncrement, AllowNull, ForeignKey, DataType,
    CreatedAt, UpdatedAt, DeletedAt, Default,
} from 'sequelize-typescript';

import { User } from '../user/user.entity';

@Table({ tableName: 'relationship' })
export class Relationship extends Model<Relationship> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ field: 'id', type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => User)
    @Column({ field: 'userId', type: DataType.INTEGER })
    userId: number;

    @ForeignKey(() => User)
    @Column({ field: 'affiliationId', type: DataType.INTEGER })
    affiliationId: number;
    
    /*@Column({
        field: 'relationType',
        type: DataType.ENUM(
            RelationType[RelationType.INVESTOR],
            RelationType[RelationType.EMPLOYEE],
            RelationType[RelationType.LIBERAL_PROFESSIONAL],
            RelationType[RelationType.STARTUP_OWNER],
            RelationType[RelationType.COMPANY_OWNER]
        )
    })
    relationType: RelationType;*/

    @Default(false)
    @Column({ field: 'isActive', type: DataType.BOOLEAN })
    isActive: boolean;

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