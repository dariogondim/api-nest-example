import {
    Controller, Body, Get, Post, UseInterceptors, Query, HttpStatus, Response, ForbiddenException,
    Put, Delete
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiImplicitBody, ApiResponse, ApiImplicitQuery
} from '@nestjs/swagger';

import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { RetrieveRelationshipQuery } from './query/retrieve-relationship.query';
import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { NOT_NULL, NOT_EMPTY } from '../../../constants/validation-messages.constant';
import { RetrieveRelationshipDto } from './dto/retrieve-relationship.dto';
import { INTERNAL, FORBIDDEN } from '../../../constants/error-messages.constants';
import { LoggerService } from '../../logger/logger.service';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { NOT_CONTENT } from '../../../constants/success-messages.constants';
import { DeleteRelationshipQuery } from './query/delete-relationship.query';
import { TokenPayload } from '../../../decorators/token-payload.decorator';

@ApiUseTags('RELATIONSHIPS')
@ApiBearerAuth()
@Controller('relationships')
export class RelationshipController {

    constructor(
        private readonly relationshipService: RelationshipService,
        private readonly loggerService: LoggerService
    ) { }

    @Get()
    @ApiImplicitQuery({
        name: 'affiliationId',
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveRelationshipDto
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: `${NOT_CONTENT}`
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    async findOne(@Query(new ValidatorPipe()) queryParams: RetrieveRelationshipQuery, @TokenUserId() userId: number, @Response() response) {
        try {
            const retrieveRelationshipDto: RetrieveRelationshipDto = await this.relationshipService.findOne(queryParams, userId);
            if(!retrieveRelationshipDto) {
                response.status(HttpStatus.NO_CONTENT).send(NOT_CONTENT);
            } else {
                response.status(HttpStatus.OK).send(retrieveRelationshipDto);
            }
        } catch(exception) {
            this.loggerService.error(INTERNAL);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
        }
    }

    @Get('pending')
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveRelationshipDto,
        isArray: true
    })
    async findAllPending(@TokenUserId() tokenUserId: number): Promise<RetrieveRelationshipDto[]> {
        return this.relationshipService.findAllPending(tokenUserId);
    }

    @Get('match')
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveRelationshipDto,
        isArray: true
    })
    async findAllMatch(@TokenUserId() tokenUserId: number): Promise<RetrieveRelationshipDto[]> {
        return this.relationshipService.findAllMatch(tokenUserId);
    }

    @Post()
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiImplicitBody({
        name: 'affiliationId',
        type: CreateRelationshipDto
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: RetrieveRelationshipDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    create(@Body(new ValidatorPipe()) relationshipDto: CreateRelationshipDto, @TokenPayload() tokenPayload: any): Promise<RetrieveRelationshipDto> {
        return this.relationshipService.create(relationshipDto, tokenPayload);
    }


    @Put()
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiImplicitBody({
        name: 'affiliationId, isActive',
        type: UpdateRelationshipDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveRelationshipDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async update(@Body(new ValidatorPipe()) relationshipDto: UpdateRelationshipDto, @Response() response, @TokenPayload() tokenPayload: any) {
        try {
            const retrieveRelationshipDto: RetrieveRelationshipDto = await this.relationshipService.update(relationshipDto, tokenPayload);
            response.status(HttpStatus.OK).send(retrieveRelationshipDto);
        } catch(exception) {
            if(exception instanceof ForbiddenException) {
                this.loggerService.error(FORBIDDEN);
                response.status(HttpStatus.FORBIDDEN).send(FORBIDDEN);
            } else {
                this.loggerService.error(INTERNAL);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
            }
        }
    }

    @Delete()
    @ApiImplicitQuery({
        name: 'affiliationId',
        type: Number
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: ' '
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async delete(@Query(new ValidatorPipe()) queryParams: DeleteRelationshipQuery, @TokenUserId() userId: number, @Response() response) {
        try {
            const deletedRelationships: number = await this.relationshipService.delete(userId, queryParams);
            response.status(HttpStatus.OK).send({ deletedRelationships });
        } catch(exception) {
            if(exception instanceof ForbiddenException) {
                this.loggerService.error(FORBIDDEN);
                response.status(HttpStatus.FORBIDDEN).send(FORBIDDEN);
            } else {
                this.loggerService.error(INTERNAL);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
            }
        }
    }
}