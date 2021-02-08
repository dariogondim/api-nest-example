import { ApiModelProperty } from '@nestjs/swagger';

import { Message } from '../message.entity';

export class RetrieveMessageDto {

    constructor(message: Message) {
        this.id = message.id;
        this.senderId = message.senderId;
        this.receiverId = message.receiverId;
        this.content = message.content;
        this.isRead = message.isRead;
        this.createdAt = message.createdAt;
    }

    @ApiModelProperty()
    id: number;
    
    @ApiModelProperty()
    senderId: number;

    @ApiModelProperty()
    receiverId: number;

    @ApiModelProperty()
    content: string;

    @ApiModelProperty()
    isRead: boolean;

    @ApiModelProperty()
    createdAt: Date;
}