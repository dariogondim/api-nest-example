import { Inject, ForbiddenException, Injectable } from '@nestjs/common';

import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RetrieveProfileDto } from './dto/retrieve-profile.dto';

@Injectable()
export class ProfileService {

    constructor(
        @Inject('ProfileRepository') private readonly profileRepository: typeof Profile,
    ) { }

    async update(profileDto: UpdateProfileDto): Promise<RetrieveProfileDto> {
        const profiles: [number, Profile[]] = await this.profileRepository.update(
            profileDto,
            { where: { userId: profileDto.userId }, returning: true },
        );

        if(!profiles[1][0])
            throw new ForbiddenException();

        return new RetrieveProfileDto(profiles[1][0]);
    }
}