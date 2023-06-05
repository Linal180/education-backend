import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CronServices } from "./cron.services";

@Controller('cron')
export class cronController {
    constructor(private readonly cronService: CronServices) {}

    @Get('dump')
    async dumpAirtableRecord(): Promise<any> {
        return{
        user:  await this.cronService.dumpAllRecordsOfAirtable(),
        response: {status:200 , message: "dump Records Successfully"}
        }

    }
}