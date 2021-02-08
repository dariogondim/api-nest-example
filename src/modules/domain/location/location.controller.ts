import {
    Controller, Body, Post, UseInterceptors, HttpStatus
} from '@nestjs/common';
import {
    ApiUseTags, ApiBearerAuth, ApiImplicitBody, ApiResponse
} from '@nestjs/swagger';

import { LocationService } from './location.service';
import { ValidatorPipe } from '../../../pipes/validator.pipe';
import { TokenUserIdToBodyInterceptor } from '../../../interceptors/token-user-id-to-body.interceptor';
import { CreateUpdateLocationDto } from './dto/create-update-location.dto';
import { NOT_NULL, NOT_EMPTY } from '../../../constants/validation-messages.constant';
import { RetrieveLocationDto } from './dto/retrieve-location.dto';

@ApiUseTags('LOCATIONS')
@ApiBearerAuth()
@Controller('locations')
export class LocationController {

    constructor(
        private readonly locationService: LocationService
    ) { }

    @Post()
    @UseInterceptors(TokenUserIdToBodyInterceptor)
    @ApiImplicitBody({ name: 'latitude, longitude', type: CreateUpdateLocationDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: RetrieveLocationDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    create(@Body(new ValidatorPipe()) locationDto: CreateUpdateLocationDto): Promise<RetrieveLocationDto> {
        return this.locationService.createAndUpdate(locationDto);
    }
}