import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaOutletsMentioned } from "./entities/media-outlet-mentioned.entity";
import { MediaOutletsMentionedService } from "./media-outlet-mentioned.service";

@Module({
  imports: [TypeOrmModule.forFeature([MediaOutletsMentioned])],
  providers:[MediaOutletsMentionedService],
  exports: [ TypeOrmModule , MediaOutletsMentionedService]
})
export class MediaOutletsMentionedModule {}