import {
    Table, Model, Column, PrimaryKey, AutoIncrement, AllowNull, BelongsTo, ForeignKey, DataType,
    CreatedAt, UpdatedAt, DeletedAt, HasOne
} from 'sequelize-typescript';

import { User } from '../user/user.entity';
import { BtModelPrivacy } from '../bt-model-privacy/bt-model-privacy.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Table({ tableName: 'btModel' })
export class BtModel extends Model<BtModel> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ field: 'id' })
    id: number;

    @ForeignKey(() => User)
    @Column({ field: 'userId' })
    userId: number;

    @AllowNull(false)
    @Column({ field: 'purpose', type: DataType.TEXT })
    purpose: string;

    @Column({ field: 'valueOffer', type: DataType.TEXT })
    valueOffer: string;

    @Column({ field: 'problemsOpportunities', type: DataType.TEXT })
    problemsOpportunities: string;

    @Column({ field: 'channels', type: DataType.TEXT })
    channels: string;

    @Column({ field: 'journey', type: DataType.TEXT })
    journey: string;

    @Column({ field: 'clients', type: DataType.TEXT })
    clients: string;

    @Column({ field: 'ecosystem', type: DataType.TEXT })
    ecosystem: string;

    @Column({ field: 'processes', type: DataType.TEXT })
    processes: string;

    @Column({ field: 'assets', type: DataType.TEXT })
    assets: string;

    @Column({ field: 'revenue', type: DataType.TEXT })
    revenue: string;

    @Column({ field: 'positiveImpacts', type: DataType.TEXT })
    positiveImpacts: string;

    @Column({ field: 'costs', type: DataType.TEXT })
    costs: string;

    @Column({ field: 'negativeExternalities', type: DataType.TEXT })
    negativeExternalities: string;

    @Column({ field: 'insights', type: DataType.TEXT })
    insights: string;

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

    @HasOne(() => BtModelPrivacy)
    privacy: BtModelPrivacy;
}