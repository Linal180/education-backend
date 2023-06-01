import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentLink } from "./entities/content-link.entity";
import { ContentLinkService } from "./content-link.service";

@Module({
    imports: [TypeOrmModule.forFeature([ContentLink])],
    providers:[ContentLinkService],
    exports:[TypeOrmModule , ContentLinkService],

})
export class ContentLinkModule {}