import {
    Controller, Put, Body, UseInterceptors, Get, Param, Response, ForbiddenException, HttpStatus
} from '@nestjs/common';
import {
    ApiImplicitBody, ApiUseTags, ApiBearerAuth, ApiImplicitParam, ApiResponse
} from '@nestjs/swagger';

import { BtModelPrivacyService } from './bt-model-privacy.service';
import { UpdateBtModelPrivacyDto } from './dto/update-bt-model-privacy.dto';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { RetrieveBtModelPrivacyDto } from './dto/retrieve-bt-model-privacy';
import { FORBIDDEN, INTERNAL } from '../../../constants/error-messages.constants';
import { LoggerService } from '../../logger/logger.service';
import { RetrieveBtModelDto } from '../bt-model/dto/retrieve-bt-model.dto';

@ApiUseTags('MODELS-PRIVACY')
@ApiBearerAuth()
@Controller('models-privacy')
export class BtModelPrivacyController {

    constructor(
        private readonly btModelPrivacyService: BtModelPrivacyService,
        private readonly loggerService: LoggerService
    ) { }

    @Get(':btModelId')
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveBtModelPrivacyDto
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async findOne(@Param('btModelId') btModelId: number, @TokenUserId() userId:number, @Response() response) {
        try {
            const retrieveBtModelPrivacyDto: RetrieveBtModelPrivacyDto = await this.btModelPrivacyService.findOne(btModelId, userId);
            response.status(HttpStatus.OK).send(retrieveBtModelPrivacyDto);
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

    @Put(':btModelId')
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiImplicitParam({ name: 'btModelId', type: Number })
    @ApiImplicitBody({ name: 'none', type: UpdateBtModelPrivacyDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveBtModelDto
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async update(@Body(new ValidatorPipe()) btModelPrivacyDto: UpdateBtModelPrivacyDto, @Param('btModelId') btModelId: number, @Response() response) {
        try {
            const retrieveBtModelDto: RetrieveBtModelDto = await this.btModelPrivacyService.update(btModelId, btModelPrivacyDto);
            response.status(HttpStatus.OK).send(retrieveBtModelDto);
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