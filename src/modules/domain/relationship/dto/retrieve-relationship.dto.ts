import { ApiModelProperty } from '@nestjs/swagger';

import { Relationship } from '../relationship.entity';
import { Message } from '../../message/message.entity';

export class RetrieveRelationshipDto {

    constructor(relationship: Relationship, name?:string, btModelId?: number, lastMessage?: Message, newMessages?:number) {
        this.userId = relationship.userId;
        this.affiliationId = relationship.affiliationId;
        this.isActive = relationship.isActive;
        this.name = name;
        this.btModelId = btModelId;
        this.newMessages = newMessages;
        if(lastMessage) {
            this.lastMessage = lastMessage.content;
            this.lastMessageDt = lastMessage.createdAt;
        }
    }

    @ApiModelProperty()
    userId: number;

    @ApiModelProperty()
    affiliationId: number;

    @ApiModelProperty()
    isActive: boolean;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    btModelId: number;

    @ApiModelProperty()
    newMessages: number;

    @ApiModelProperty()
    lastMessage: string;

    @ApiModelProperty()
    lastMessageDt: Date;
}