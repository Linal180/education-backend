import { Module } from "@nestjs/common";
import { EveryActionModule } from "../everyAction/everyAction.module";
import { UsersModule } from "../users/users.module";
import { userEveryActionService } from "./userEveryAction.service";
import { UsersService } from "src/users/users.service";
// import { EveryActionService } from "src/everyAction/everyAction.service";

@Module({
    imports: [EveryActionModule],
    providers: [userEveryActionService],
    exports: [userEveryActionService]
})

export class UserEveryActionModule {}