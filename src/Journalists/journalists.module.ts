import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Journalist } from "./entities/journalist.entity";
import { JournalistsService } from "./journalists.service";




@Module({
    imports: [TypeOrmModule.forFeature([Journalist])],
    providers:[JournalistsService],
    exports:[TypeOrmModule , JournalistsService],

})
export class JournalistsModule {}