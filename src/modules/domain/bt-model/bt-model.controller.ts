import {
    Controller, Body, Get, UseInterceptors, Put, Param, Query, ForbiddenException, Response, HttpStatus
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiImplicitParam, ApiImplicitQuery, ApiImplicitBody, ApiResponse
} from '@nestjs/swagger';

import { BtModelService } from './bt-model.service';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { UpdateBtModelDto } from './dto/update-bt-model.dto';
import { TokenUserId } from '../../../decorators/token-user-id.decorator';
import { RetrieveBtModelDto } from './dto/retrieve-bt-model.dto';
import { RetrieveBtModelQuery } from './query/retrieve-bt-model.query';
import { RetrieveSearchBtModelDto } from './dto/retrieve-search-bt-model.dto';
import { LoggerService } from '../../logger/logger.service';
import { FORBIDDEN, INTERNAL } from '../../../constants/error-messages.constants';
import { NOT_NULL, NOT_EMPTY } from '../../../constants/validation-messages.constant';
import { RelationType } from '../relation-type/relation-type.enum';

@ApiBearerAuth()
@Controller('models')
export class BtModelController {

    constructor(
        private readonly btModelService: BtModelService,
        private readonly loggerService: LoggerService
    ) { }

    @ApiUseTags('DEPRECATED')
    @Get('nearby')
    @ApiImplicitQuery({ name: 'radius', type: Number, required: false })
    @ApiImplicitQuery({ name: 'longitude', type: Number, required: true })
    @ApiImplicitQuery({ name: 'latitude', type: Number, required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveSearchBtModelDto,
        isArray: true
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    findNearby(@Query(new ValidatorPipe()) queryParams: RetrieveBtModelQuery, @TokenUserId() tokenUserId: number): Promise<RetrieveSearchBtModelDto[]> {
        return this.btModelService.findAll(queryParams, tokenUserId);
    }

    @ApiUseTags('MODELS')
    @Get(':btModelId')
    @ApiImplicitParam({ name: 'btModelId', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveBtModelDto,
        isArray: true
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    findOne(@Param('btModelId') btModelId: number): Promise<RetrieveBtModelDto> {
        return this.btModelService.findOne(btModelId);
    }

    /*
    *   No MVP não será possível possuir mais de um BtModel por User.
    *   BtModel está sendo criado durante a criação do User.
    
    @Post()
    @ApiImplicitBody({ name: 'purpose, valueOffer, problemsOpportunities', type: CreateBtModelDto, required: true })
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    create(@Body(new ValidatorPipe()) btModelDto: CreateBtModelDto): Promise<BtModel> {
        return this.btModelService.create(btModelDto);
    }*/

    @ApiUseTags('MODELS')
    @Put(':id')
    @ApiImplicitParam({ name: 'id', type: Number })
    @ApiImplicitBody({ name: 'none', type: UpdateBtModelDto })
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiResponse({
        status: 200,
        type: RetrieveBtModelDto
    })
    @ApiResponse({
        status: 400,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: `${FORBIDDEN}`
    })
    async update(@Param('id') id: number, @Body(new ValidatorPipe()) btModelDto: UpdateBtModelDto, @Response() response ) {
        try {
            const retrieveBtModelDto: RetrieveBtModelDto = await this.btModelService.update(id, btModelDto);
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

    @ApiUseTags('MODELS')
    @Get()
    @ApiImplicitQuery({ name: 'byInsights', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byNegativeExternalities', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byCosts', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byPositiveImpacts', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byRevenue', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byAssets', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byProcesses', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byEcosystem', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byClients', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byJourney', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byChannels', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byProblemsOpportunities', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byValueOffer', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byPurpose', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byCompany', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'byName', type: Boolean, required: false })
    @ApiImplicitQuery({ name: 'radius', type: Number, required: false })
    @ApiImplicitQuery({ name: 'longitude', type: Number, required: false })
    @ApiImplicitQuery({ name: 'latitude', type: Number, required: false })
    @ApiImplicitQuery({ name: 'isXperMentor', type: Boolean, required: false })
    @ApiImplicitQuery({
        name: 'relationType',
        type: `
            ${RelationType.INVESTOR},
            ${RelationType.EMPLOYEE},
            ${RelationType.LIBERAL_PROFESSIONAL},
            ${RelationType.STARTUP_OWNER},
            ${RelationType.COMPANY_OWNER}
        `,
        required: false
    })
    @ApiImplicitQuery({ name: 'search', type: String, required: false })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RetrieveSearchBtModelDto,
        isArray: true
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    async findAll(@Query(new ValidatorPipe()) queryParams: RetrieveBtModelQuery, @TokenUserId() userId: number, @Response() response) {
        try {
            const retrieveSearchBtModelsDto: RetrieveSearchBtModelDto[] = await this.btModelService.findAll(queryParams, userId);
            response.status(HttpStatus.OK).send(retrieveSearchBtModelsDto);
        } catch(exception) {
            this.loggerService.error(INTERNAL);
            console.log(exception);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
        }
    }
}