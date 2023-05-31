import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsLiteracyTopic } from "./entities/newliteracy-topic.entity";
import { NewsLiteracyTopicsService } from "./newsliteracy-topics.service";




@Module({
    imports: [TypeOrmModule.forFeature([NewsLiteracyTopic])],
    providers:[NewsLiteracyTopicsService],
    exports:[TypeOrmModule , NewsLiteracyTopicsService],

})
export class NewsLiteracyTopicsModule {}