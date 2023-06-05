import { Injectable } from "@nestjs/common";
import { EveryActionService } from "src/everyAction/everyAction.service";
import { ApplyActivistCodes } from "src/users/dto/apply-activist-code.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";



@Injectable()
export class userEveryActionService {
    constructor(

        // private readonly userService: UsersService,
        private readonly everyActionService: EveryActionService

    ) {}

    
    async sendUserToEveryAction(user : User) : Promise<any> {

        return await this.everyActionService.send(user);
    }

    async applyActivistCodesToEveryAction({ userId, grades, subjects }: ApplyActivistCodes) : Promise<void> {
        // this.everyActionService.applyActivistCodes({ userId, grades, subjects })
        // return await this.everyActionService.apply(user);
    }

    async userSetMeta(metaData: string, { key, value }: { key: string, value: string }):Promise<string>{
        return "hello"
        // return await this.userService.setMeta(metaData, {key, value});
    }
    async userGetMeta(user: User ,  key: string  , defaultVal = ''):Promise<string>{
        return "hello"
        // return await this.userService.getMeta( user , key  , defaultVal );
    }
}