import {
    UnauthorizedException, OnModuleInit, OnModuleDestroy, ServiceUnavailableException, Inject, Injectable
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt-nodejs';

import { RequestTokenDto } from './dto/request-token.dto';
import { User } from '../domain/user/user.entity';
import { UserService } from '../domain/user/user.service';
import { ResponseTokenDto } from './dto/response-token.dto';
import { BtModel } from '../domain/bt-model/bt-model.entity';
import { AccessToken } from './dto/access-token.dto';
import { BtModelPrivacy } from '../domain/bt-model-privacy/bt-model-privacy.entity';
import { RetrieveBtModelDto } from '../domain/bt-model/dto/retrieve-bt-model.dto';
import { RetrieveProfileDto } from '../domain/profile/dto/retrieve-profile.dto';
import { RetrieveUserPrivacyDto } from '../domain/user-privacy/dto/retrieve-user-privacy.dto';
import { RetrieveBtModelPrivacyDto } from '../domain/bt-model-privacy/dto/retrieve-bt-model-privacy';

@Injectable()
export class AuthService /*implements OnModuleInit, OnModuleDestroy*/ {

    // redisClient = null;

    constructor(
        private readonly userService: UserService,
        @Inject('BtModelRepository') private readonly btModelRepository: typeof BtModel
    ) { }

    /*onModuleInit() {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        this.redisClient = redis.createClient();
    }

    onModuleDestroy() {
        if(this.redisClient) {
            this.redisClient.quit();
        }
    }*/

    token(requestToken: RequestTokenDto): Promise<ResponseTokenDto> {
        return this.authenticate(requestToken).then(
            async user => {
                const accessToken: AccessToken = this.generateAccessToken(user);
                // const refreshToken: RefreshToken = this.generateRefreshToken(user);
                if(!accessToken /*|| !refreshToken*/) {
                    throw new UnauthorizedException();
                }
                /*this.redisClient.setAsync(user.id, refreshToken.refreshToken).then(
                    () => { }
                );*/
                const retrieveUserProfile: RetrieveProfileDto = new RetrieveProfileDto(user.profile);
                const retrieveUserPrivacy: RetrieveUserPrivacyDto = new RetrieveUserPrivacyDto(user.privacy);
                const btModels: BtModel[] = await this.btModelRepository.findAll({
                    where: { userId: user.id },
                    include: [{
                        model: BtModelPrivacy
                    }]
                });

                const retrieveBtModelsDto: RetrieveBtModelDto[] = [];

                for(let btModel of btModels) {
                    let retrieveBtModel: RetrieveBtModelDto = new RetrieveBtModelDto(btModel);
                    let retrieveBtModelPrivacyDto: RetrieveBtModelPrivacyDto = new RetrieveBtModelPrivacyDto(btModel.privacy);
                    retrieveBtModel.privacy = retrieveBtModelPrivacyDto;

                    retrieveBtModelsDto.push(retrieveBtModel);
                }
                
                return {
                    accessToken,
                    userProfile: retrieveUserProfile,
                    userPrivacy: retrieveUserPrivacy,
                    btModels: retrieveBtModelsDto,
                    /*, refreshToken*/
                } as ResponseTokenDto;
            }
        );
    }

    /*refresh(refreshToken: string): Promise<ResponseTokenDto> {
        const payload = jwt.verify(refreshToken, 'r3fr35ht0k3n53cr3tk3y', function(error, decoded) {
            if(error) {
                throw new UnauthorizedException();
            }
            return decoded;
        });
        return this.redisClient.getAsync(payload.id).then(
            storedRefreshToken => {
                if(!storedRefreshToken) {
                    throw new UnauthorizedException();
                }
                const user: User = { id: payload.id, mail: payload.mail, profile: { name: payload.name } } as User;
                const accessToken: AccessToken = this.generateAccessToken(user);
                const refreshToken: RefreshToken = this.generateRefreshToken(user);
                this.redisClient.setAsync(user.id, refreshToken.refreshToken).then(
                    () => { }
                );
                return { accessToken, refreshToken } as ResponseTokenDto;
            }
        ).catch(
            () => {
                throw new UnauthorizedException();
            }
        );
    }

    revoke(tokenUserId: number): Promise<boolean> {
        if(!tokenUserId) {
            throw new UnauthorizedException();
        }
        return this.redisClient.delAsync(tokenUserId).then(
            () => {
                console.log('Usuário desautenticado com sucesso.');
                return true;
            }
        ).catch(
            () => { throw new ServiceUnavailableException() }
        );
    }*/

    private authenticate(requestToken: RequestTokenDto): Promise<User> {
        return this.userService.findByMail(requestToken.mail.toLowerCase()).then(
            (user) => {
                if (!bcrypt.compareSync(requestToken.password, user.password)) {
                    throw new UnauthorizedException();
                }
                return user;
            }
        ).catch(
            () => {
                throw new UnauthorizedException();
            }
        );
    }

    private generateAccessToken(user: User): AccessToken {
        const expiresIn: number = 60 * 60 * 24 * 360;
        const secretOrKey: string = '4cc355t0k3n53cr3tk3y';
        const accessToken: string = jwt.sign(
            { id: user.id, mail: user.mail, name: user.profile.name }, // jwt payload
            secretOrKey,
            { expiresIn }
        );
        return { expiresIn, accessToken };
    }

    /*private generateRefreshToken(user: User): RefreshToken {
        const expiresIn = 60 * 60 * 24 * 180, secretOrKey = 'r3fr35ht0k3n53cr3tk3y';
        const refreshToken = jwt.sign(
            { id: user.id, mail: user.mail, name: user.profile.name }, // jwt payload
            secretOrKey,
            { expiresIn }
        );
        return { expiresIn, refreshToken };
    }*/
}