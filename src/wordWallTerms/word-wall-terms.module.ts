import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordWallTerms } from "./entities/word-wall-term.entity";
import { wordWallTermsService } from "./word-wall-terms.service";

@Module({
  imports: [TypeOrmModule.forFeature([WordWallTerms])],
  providers:[wordWallTermsService],
  exports: [TypeOrmModule, wordWallTermsService]
})
export class wordWallTermsModule {}