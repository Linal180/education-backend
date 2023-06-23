import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordWallTerms } from "./entities/word-wall-term.entity";
import { WordWallTermsService } from "./word-wall-terms.service";

@Module({
  imports: [TypeOrmModule.forFeature([WordWallTerms])],
  providers: [WordWallTermsService],
  exports: [TypeOrmModule, WordWallTermsService]
})
export class WordWallTermsModule { }