import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EssentialQuestion } from "./entities/essential-questions.entity";
import { EssentialQuestionsService } from "./essential-questions.service";


@Module({
  imports: [TypeOrmModule.forFeature([EssentialQuestion])],
  providers: [EssentialQuestionsService],
  exports: [TypeOrmModule , EssentialQuestionsService]
})

export class EssentialQuestionsModule {}