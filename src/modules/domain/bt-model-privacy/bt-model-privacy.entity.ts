import {
    Table, Model, Column, PrimaryKey, AllowNull, ForeignKey, DataType,
    CreatedAt, UpdatedAt, DeletedAt, Unique, Default
} from 'sequelize-typescript';

import { User } from '../user/user.entity';
import { BtModel } from '../bt-model/bt-model.entity';

@Table({ tableName: 'btModelPrivacy' })
export class BtModelPrivacy extends Model<BtModelPrivacy> {

    @PrimaryKey
    @Unique
    @AllowNull(false)
    @ForeignKey(() => BtModel)
    @Column({ field: 'btModelId' })
    btModelId: number;

    @Unique
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({ field: 'userId' })
    userId: number;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'valueOfferPublic' })
    valueOfferPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'problemsOpportunitiesPublic' })
    problemsOpportunitiesPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'channelsPublic' })
    channelsPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'journeyPublic' })
    journeyPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'clientsPublic' })
    clientsPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'ecosystemPublic' })
    ecosystemPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'processesPublic' })
    processesPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'assetsPublic' })
    assetsPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'revenuePublic' })
    revenuePublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'positiveImpactsPublic' })
    positiveImpactsPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'costsPublic' })
    costsPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'negativeExternalitiesPublic' })
    negativeExternalitiesPublic: boolean;

    @AllowNull(false)
    @Default(false)
    @Column({ field: 'insightsPublic' })
    insightsPublic: boolean;

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