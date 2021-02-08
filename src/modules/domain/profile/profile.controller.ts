import {
    Controller, Body, Put, UseInterceptors, HttpStatus, Response, ForbiddenException
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiImplicitBody, ApiResponse
} from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { LoggerService } from '../../logger/logger.service';
import { RetrieveProfileDto } from './dto/retrieve-profile.dto';
import { FORBIDDEN, INTERNAL } from '../../../constants/error-messages.constants';

@ApiUseTags('PROFILES')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService,
        private readonly loggerService: LoggerService
    ) { }

    @Put()
    @ApiImplicitBody({
        name: 'none',
        type: UpdateProfileDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveProfileDto
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    async update(@Body(new ValidatorPipe()) updateProfileDto: UpdateProfileDto, @Response() response) {
        try {
            const retrieveProfileDto: RetrieveProfileDto = await this.profileService.update(updateProfileDto);
            response.status(HttpStatus.OK).send(retrieveProfileDto);
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