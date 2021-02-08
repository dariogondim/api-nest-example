import {
    Controller, Body, Post, Response, HttpStatus, UnauthorizedException, UseInterceptors, HttpCode, Get, Query
} from '@nestjs/common';
import {
    ApiUseTags, ApiImplicitBody, ApiBearerAuth, ApiResponse, ApiImplicitQuery
} from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { RequestTokenDto } from '../../auth/dto/request-token.dto';
import { ResponseTokenDto } from '../../auth/dto/response-token.dto';
import { AuthService } from '../../auth/auth.service';
import { CreateIgnoredUserDto } from './dto/create-ignored-user.dto';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { NOT_EMPTY, NOT_NULL, MAIL_MUST_BE_VALID, PASSWORD_MIN_LENGTH } from '../../../constants/validation-messages.constant';
import { MAIL_ALREADY_EXISTS, AUTHENTICATION_FAILED, INTERNAL } from '../../../constants/error-messages.constants';
import { NOT_CONTENT } from '../../../constants/success-messages.constants';
import { LoggerService } from '../../logger/logger.service';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
/*import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { RetrieveUserQuery } from './query/retrieve-user.query';
import { RetrieveSearchUserDto } from './dto/retrieve-search-user.dto';*/

@ApiUseTags('USERS')
@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly loggerService: LoggerService,
    ) { }

    @Post()
    @ApiImplicitBody({
        name: 'name, mail, password',
        type: CreateUserDto,
        required: true
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: ResponseTokenDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:`${NOT_NULL}\n${NOT_EMPTY}\n${MAIL_MUST_BE_VALID}\n${PASSWORD_MIN_LENGTH}`
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description:`${MAIL_ALREADY_EXISTS}`
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `${AUTHENTICATION_FAILED}`
    })
    async create(@Body(new ValidatorPipe()) userDto: CreateUserDto, @Response() response) {
        try {
            const requestTokenDto: RequestTokenDto = await this.userService.create(userDto);
            const ResponseTokenDto: ResponseTokenDto = await this.authService.token(requestTokenDto);
            // response.cookie('refresh_token', tokens.refreshToken.refreshToken, { httpOnly: true, path:"/auth/refresh" });
            response.status(HttpStatus.CREATED).send(ResponseTokenDto);
        } catch(exception) {
            if (exception instanceof UnauthorizedException) {
                this.loggerService.error(AUTHENTICATION_FAILED);
                response.status(HttpStatus.UNAUTHORIZED).send(AUTHENTICATION_FAILED);
            } else if(exception instanceof Sequelize.UniqueConstraintError) {
                this.loggerService.error(MAIL_ALREADY_EXISTS);
                response.status(HttpStatus.CONFLICT).send(MAIL_ALREADY_EXISTS);
            } else {
                this.loggerService.error(INTERNAL);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
            }
        }
    }

    @Post('ignore')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiBearerAuth()
    @ApiImplicitBody({
        name: 'ignoredUserId',
        type: CreateIgnoredUserDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: `${NOT_CONTENT}`
    })
    async ignore(@Body(new ValidatorPipe()) ignoredUserDto: CreateIgnoredUserDto) {
        await this.userService.ignore(ignoredUserDto);
    }

    @Post('notification')
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiImplicitBody({
        name: 'token',
        type: CreateNotificationUserDto
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: `${NOT_CONTENT}`
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    async notification(@Body(new ValidatorPipe()) notificationUser: CreateNotificationUserDto) {
        await this.userService.notification(notificationUser);
    }

    /*@Get()
    @ApiBearerAuth()
    @ApiImplicitQuery({ name: 'radius', type: Number, required: false })
    @ApiImplicitQuery({ name: 'longitude', type: Number, required: false })
    @ApiImplicitQuery({ name: 'latitude', type: Number, required: false })
    @ApiImplicitQuery({ name: 'isXperMentor', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'relationType', type: String, required: false })
    @ApiImplicitQuery({ name: 'search', type: String, required: false })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveSearchUserDto,
        isArray: true
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    async findAll(@Query(new ValidatorPipe()) queryParams: RetrieveUserQuery, @TokenUserId() userId: number, @Response() response) {
        try {
            const retrieveSearchUserDto: RetrieveSearchUserDto[] = await this.userService.findAll(queryParams, userId);
            response.status(HttpStatus.OK).send(retrieveSearchUserDto);
        } catch(exception) {
            this.loggerService.error(INTERNAL);
            console.log(exception);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
        }
    }*/
}