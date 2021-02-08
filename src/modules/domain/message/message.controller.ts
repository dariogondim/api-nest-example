import {
    Controller, Body, Get, Post, HttpStatus, UseInterceptors, Param, Put, HttpCode
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiResponse, ApiImplicitBody, ApiImplicitParam
} from '@nestjs/swagger';

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TokenSenderIdToBodyInterceptor } from '../../../interceptors/token-sender-id-to-body.interceptor';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { NOT_NULL, NOT_EMPTY } from '../../../constants/validation-messages.constant';
import { RetrieveMessageDto } from './dto/retrieve-message.dto';
import { UpdateReadMessageDto } from './dto/update-read-message.dto';
import { NOT_CONTENT } from '../../../constants/success-messages.constants';
import { TokenPayload } from '../../../decorators/token-payload.decorator';

@ApiUseTags('MESSAGES')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {

    constructor(
        private readonly messageService: MessageService
    ) { }

    @Get(':receiverId')
    @ApiImplicitParam({
        name: 'receiverId',
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveMessageDto,
        isArray: true
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    findAllByUser(@TokenUserId() senderId, @Param('receiverId') receiverId: number): Promise<RetrieveMessageDto[]> {
        return this.messageService.findAllByUser(senderId, receiverId);
    }

    @Post()
    @UseInterceptors(TokenSenderIdToBodyInterceptor)
    @ApiImplicitBody({
        name: 'receiverId',
        type: CreateMessageDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveMessageDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    create(@Body(new ValidatorPipe()) messageDto: CreateMessageDto, @TokenPayload() tokenPayload: any): Promise<RetrieveMessageDto> {
        return this.messageService.create(messageDto, tokenPayload);
    }

    @Put('read')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiImplicitBody({
        name: 'messageIds',
        type: UpdateReadMessageDto
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: `${NOT_CONTENT}`
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    markAsRead(@Body(new ValidatorPipe()) updateReadMessageDto: UpdateReadMessageDto, @TokenUserId() tokenUserId: number) {
        this.messageService.markAsRead(updateReadMessageDto, tokenUserId);
    }
}