import { Injectable, Logger } from '@nestjs/common';
import { Cron , CronExpression} from '@nestjs/schedule';

@Injectable()
export class CronServices{
    private readonly logger = new Logger(CronServices.name);

    @Cron(CronExpression.EVERY_10_SECONDS)//'* * * * * *'
    handleCron() {
        // console.log("Delicious cakes is open for business...")
      this.logger.debug('Called when the current second is 10');
    }

    @Cron(CronExpression.EVERY_10_MINUTES) // "0 */10 * * * *"
    runEveryTenthMinute(){
        this.logger.debug('Called when the current minute is 10');
    }
}