import { Injectable } from '@nestjs/common';

import { existsSync, mkdirSync } from 'fs';
import mysqldump, { DumpReturn } from 'mysqldump';

import { TimeHelper } from '../helpers';

import { ConfigService } from './config.service';

@Injectable()
export class BackupService
{
    constructor(private readonly configService: ConfigService) {}

    async backupMysql(table?: string): Promise<DumpReturn>
    {
        if(!existsSync('./backups')) mkdirSync('./backups');

        if(!existsSync('./backups/' + table)) mkdirSync('./backups/' + table);

        return await mysqldump({
            connection: {
                host: this.configService.config.database.host,
                user: this.configService.config.database.username,
                password: this.configService.config.database.password,
                database: this.configService.config.database.database
            },
            dump: (table) ? { tables: table.split(null) } : null,
            dumpToFile: (table) ? `./backups/${ table }/${ table }-${ TimeHelper.formatNow('D-M-YY-HH-m') }.sql` : `backups/full-${ TimeHelper.formatNow('D-M-YY-HH-m') }.sql`
        });
    }
}