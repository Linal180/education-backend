import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsLiteracyTopic } from "./entities/newliteracy-topic.entity";
import { NewsLiteracyTopicService } from "./newsliteracy-topic.service";

@Module({
  imports: [TypeOrmModule.forFeature([NewsLiteracyTopic])],
  providers: [NewsLiteracyTopicService],
  exports: [TypeOrmModule, NewsLiteracyTopicService],
})
export class NewsLiteracyTopicModule { }