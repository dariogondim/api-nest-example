import { Inject, ForbiddenException, Injectable } from '@nestjs/common';

import { UserPrivacy } from './user-privacy.entity';
import { UpdateUserPrivacyDto } from './dto/update-user-privacy.dto';
import { RetrieveUserPrivacyDto } from './dto/retrieve-user-privacy.dto';

@Injectable()
export class UserPrivacyService {

    constructor(
        @Inject('UserPrivacyRepository') private readonly userPrivacyRepository: typeof UserPrivacy
    ) { }

    async findOne(userId: number): Promise<RetrieveUserPrivacyDto> {
        const userPrivacy: UserPrivacy = await this.userPrivacyRepository.findOne({
            where: { userId }
        });

        if(!userPrivacy)
            throw new ForbiddenException();

        return new RetrieveUserPrivacyDto(userPrivacy);
    }

    async update(userPrivacyDto: UpdateUserPrivacyDto): Promise<RetrieveUserPrivacyDto> {
        const userPrivacy: [number, UserPrivacy[]] = await this.userPrivacyRepository.update(
            userPrivacyDto,
            { where: { userId: userPrivacyDto.userId }, returning: true }
        );

        if(!userPrivacy[1][0])
            throw new ForbiddenException();

        return new RetrieveUserPrivacyDto(userPrivacy[1][0]);
    }
}