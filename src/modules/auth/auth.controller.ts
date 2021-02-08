import {
    ApiUseTags, ApiImplicitBody, ApiResponse
} from '@nestjs/swagger';
import {
    Controller, Post, Body, UnauthorizedException, HttpStatus
} from '@nestjs/common';

import { ValidatorPipe } from '../../pipes/validator.pipe';
import { RequestTokenDto } from './dto/request-token.dto';
import { AuthService } from './auth.service';
import { ResponseTokenDto } from './dto/response-token.dto';
import { AUTHENTICATION_FAILED, INTERNAL } from '../../constants/error-messages.constants';
import { NOT_NULL, NOT_EMPTY } from '../../constants/validation-messages.constant';
import { LoggerService } from '../logger/logger.service';

@ApiUseTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly loggerService: LoggerService
    ) { }

    @Post('token')
    @ApiImplicitBody({
        name: 'mail, password',
        type: RequestTokenDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ResponseTokenDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `${NOT_NULL}\n${NOT_EMPTY}`
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `${AUTHENTICATION_FAILED}`
    })
    async token(@Body(new ValidatorPipe()) requestToken: RequestTokenDto, @Response() response) {
        try {
            const responseTokenDto: ResponseTokenDto = await this.authService.token(requestToken);
            // response.cookie('refresh_token', tokens.refreshToken.refreshToken, { httpOnly: true, path:"/auth/refresh" });
            response.status(HttpStatus.OK).send(responseTokenDto);
        } catch (exception) {
            if (exception instanceof UnauthorizedException) {
                this.loggerService.error(AUTHENTICATION_FAILED);
                response.status(HttpStatus.UNAUTHORIZED).send(AUTHENTICATION_FAILED);
            } else {
                this.loggerService.error(INTERNAL);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(INTERNAL);
            }
        }
    }

    /*@Get('refresh')
    @ApiResponse({ status: 200, description: 'Access Token (body) e Refresh Token (cookie) são retornados' })
    @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
    async refresh(@Request() request, @Response() response) {
        try {
            if(!request.headers.cookie || request.headers.cookie == '') {
                response.status(HttpStatus.UNAUTHORIZED).send('Cookie RefreshToken não está contido na requisição.');
            }
            const refreshToken: string = request.headers.cookie.split('=')[1];
            const tokens = await this.authService.refresh(refreshToken);
            response.cookie('refresh_token', tokens.refreshToken.refreshToken, { httpOnly: true, path:"/auth/refresh" });
            response.status(HttpStatus.OK).send(tokens.accessToken);
        } catch(exception) {
            if(exception instanceof UnauthorizedException) {
                response.status(HttpStatus.UNAUTHORIZED).send('Cookie RefreshToken é inválido.');
            } else if(exception instanceof ServiceUnavailableException) {
                response.status(HttpStatus.SERVICE_UNAVAILABLE).send('Não foi possível renovar o token de autenticação.');
            } else {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Um erro inesperado ocorreu.');
            }
        }
    }

    @Delete('revoke')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'RefreshToken foi revogado' })
    @ApiResponse({ status: 400, description: 'Acesso não autorizado' })
    async revoke(@TokenUserId() tokenUserId, @Response() response) {
        try {
            const revoked: boolean = await this.authService.revoke(tokenUserId);
            response.cookie('refresh_token', '', { httpOnly: true, path:"/auth/refresh" });
            response.status(HttpStatus.OK).send('RefreshToken foi revogado');
        } catch (exception) {
            if(exception instanceof UnauthorizedException) {
                response.status(HttpStatus.BAD_REQUEST).send('Cookie RefreshToken é inválido')
            } else if(exception instanceof ServiceUnavailableException) {
                response.status(HttpStatus.SERVICE_UNAVAILABLE).send('Não foi possível realizar desautenticação. Por favor, tente novamente.');
            } else {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Um erro inesperado ocorreu.');
            }
        }
    }*/
}