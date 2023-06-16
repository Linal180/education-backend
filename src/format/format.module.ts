import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Format } from "./entities/format.entity";
import { FormatService } from "./format.service";
@Module({
    imports: [TypeOrmModule.forFeature([Format])],
    providers:[FormatService],
    exports:[TypeOrmModule , FormatService],

})
export class FormatModule {}