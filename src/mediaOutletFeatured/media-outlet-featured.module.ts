import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaOutletsFeatured } from "./entities/media-outlet-featured.entity";
import { MediaOutletsFeaturedService } from "./media-outlet-featured.service";


@Module({
  imports: [TypeOrmModule.forFeature([MediaOutletsFeatured])],
  providers: [MediaOutletsFeaturedService],
  exports: [TypeOrmModule,MediaOutletsFeaturedService],
})
export class MediaOutletsFeaturedModule {}