import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EssentialQuestions } from "./entities/essential-questions.entity";
import { EssentialQuestionsService } from "./essential-questions.service";


@Module({
  imports: [TypeOrmModule.forFeature([EssentialQuestions])],
  providers: [EssentialQuestionsService],
  exports: [TypeOrmModule , EssentialQuestionsService]
})

export class EssentialQuestionsModule {}