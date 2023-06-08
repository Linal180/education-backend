import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { wordWallTermLinks } from "./entities/word-wall-term-link.entity";
import { wordWallTermLinksService } from "./word-wall-term-link.services";

@Module({
  imports: [TypeOrmModule.forFeature([wordWallTermLinks])],
  providers:[wordWallTermLinksService],
  exports: [TypeOrmModule , wordWallTermLinksService]
})

export class wordWallTermLinksModule {}