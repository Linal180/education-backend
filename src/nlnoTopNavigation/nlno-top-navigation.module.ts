import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NLNOTopNavigation } from "./entities/nlno-top-navigation.entity";
import { NLNOTopNavigationsService } from "./nlno-top-navigation.service";




@Module({
    imports: [TypeOrmModule.forFeature([NLNOTopNavigation])],
    providers:[NLNOTopNavigationsService],
    exports:[TypeOrmModule , NLNOTopNavigationsService],

})
export class NLNOTopNavigationsModule {}