import {
    Controller, Put, UseInterceptors, Body, Get, HttpStatus, Response, ForbiddenException
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiImplicitBody, ApiResponse
} from '@nestjs/swagger';

import { UserPrivacyService } from './user-privacy.service';
import { UpdateUserPrivacyDto } from './dto/update-user-privacy.dto';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { RetrieveUserPrivacyDto } from './dto/retrieve-user-privacy.dto';
import { FORBIDDEN, INTERNAL } from '../../../constants/error-messages.constants';
import { LoggerService } from '../../logger/logger.service';
import { NOT_NULL, NOT_EMPTY } from '../../../constants/validation-messages.constant';

@ApiUseTags('USERS-PRIVACY')
@ApiBearerAuth()
@Controller('users-privacy')
export class UserPrivacyController {

    constructor(
        private readonly userPrivacyService: UserPrivacyService,
        private readonly loggerService: LoggerService
    ) { }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveUserPrivacyDto
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async findOne(@TokenUserId() userId: number): Promise<RetrieveUserPrivacyDto> {
        return this.userPrivacyService.findOne(userId);
    }

    @Put()
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiImplicitBody({ name: 'none', type: UpdateUserPrivacyDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveUserPrivacyDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async update(@Body(new ValidatorPipe()) userPrivacyDto: UpdateUserPrivacyDto, @Response() response) {
        try {
            const retrieveUserPrivacyDto: RetrieveUserPrivacyDto = await this.userPrivacyService.update(userPrivacyDto);
            response.status(HttpStatus.OK).send(retrieveUserPrivacyDto);
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