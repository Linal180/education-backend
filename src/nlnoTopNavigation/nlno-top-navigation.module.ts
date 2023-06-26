import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NLNOTopNavigation } from "./entities/nlno-top-navigation.entity";
import { NLNOTopNavigationService } from "./nlno-top-navigation.service";

@Module({
  imports: [TypeOrmModule.forFeature([NLNOTopNavigation])],
  providers: [NLNOTopNavigationService],
  exports: [TypeOrmModule, NLNOTopNavigationService],
})
export class NLNOTopNavigationModule { }