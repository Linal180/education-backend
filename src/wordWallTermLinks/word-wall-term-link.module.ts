import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordWallTermLink } from "./entities/word-wall-term-link.entity";
import { WordWallTermLinksService } from "./word-wall-term-link.services";

@Module({
  imports: [TypeOrmModule.forFeature([WordWallTermLink])],
  providers:[WordWallTermLinksService],
  exports: [TypeOrmModule , WordWallTermLinksService]
})

export class WordWallTermLinksModule {}