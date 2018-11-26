import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DeleteResult } from 'typeorm';

import { UserBadgeEntity } from '../entities/userBadge.entity';

@Injectable()
export class UserBadgeService
{
    constructor(
        @InjectRepository(UserBadgeEntity)
        private readonly userBadgeRepository: Repository<UserBadgeEntity>) {}

    async giveBadge(userIds: Array<number>, badgeCodes: Array<string>): Promise<boolean>
    {
        if(!userIds || !badgeCodes) throw new Error('invalid_parameters');

        let values: { userId: number, badgeCode: string }[] = [];

        userIds.forEach(user =>
        {
            badgeCodes.forEach(code =>
            {
                values.push({
                    userId: user,
                    badgeCode: code
                });
            });
        });

        if(!values) throw new Error('invalid_badges');

        values.forEach(async value => await this.userBadgeRepository.findOne(value) || await this.userBadgeRepository.save(value));

        return true;
    }

    async removeBadge(userIds: Array<number>, badgeCodes: Array<string>): Promise<DeleteResult>
    {
        if(!userIds || !badgeCodes) return Promise.reject(Error('invalid_parameters'));

        return await this.userBadgeRepository.delete({ userId: In(userIds), badgeCode: In(badgeCodes) });
    }
}