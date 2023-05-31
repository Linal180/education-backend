import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentLink } from "./entities/content-link.entity";
import { ContentLinksService } from "./content-links.service";




@Module({
    imports: [TypeOrmModule.forFeature([ContentLink])],
    providers:[ContentLinksService],
    exports:[TypeOrmModule , ContentLinksService],

})
export class ContentLinksModule {}