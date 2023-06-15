import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  DataSource,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import { UsersService } from '../users.service';
import { generate } from 'generate-password';
// import { EveryActionService } from '../../everyAction/everyAction.service';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly connection: DataSource,
    // private readonly usersService: UsersService,
    // private readonly everyActionService: EveryActionService
  ) {
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    event.entity.password = await bcrypt.hash(
      event.entity.password ?? generate({ length: 10, numbers: true }) ,
      await bcrypt.genSalt(),
    );
  }

  // async afterInsert(event: InsertEvent<User>): Promise<void> {
  //   const { entity , manager } = event;
  //   console.log("here we go to the after Insert event")
  //   console.log("after Insert: " + entity.id )

  //   // Delay execution for 1 second
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   // Defer execution to allow transaction to commit
  //   let userRelated;
  //   setImmediate(async () => {
  //     userRelated = await this.usersService.getRelatedEntities(entity.id, ['gradeLevel', 'subjectArea']);
  //     // Use the user object as needed
  //   });
  //   // const userRelated = await this.usersService.getRelatedEntities(entity.id , ['gradeLevel' , 'subjectArea'])
  //   console.log("user related: " + userRelated);
  //   const grade = ['3-5']
  //   const subjectArea = ['Arts']
  //   const [, userEveryActionResponse ] = await Promise.all([
  //     await this.usersService.mapUserRoleToCognito(entity),
  //     await this.everyActionService.send(entity),
  //     await this.everyActionService.applyActivistCodes({ user:entity, grades: grade, subjects: subjectArea })
  //   ])
  //   const { userLog, meta } = userEveryActionResponse
  //   await this.usersService.updateById(entity.id, { log: userLog, meta: JSON.stringify(meta) })
    
  // }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    const emailGotUpdated = event.updatedColumns.find(
      (value) => value.propertyName,
      User.prototype.email,
    );

    if (emailGotUpdated) {
      if (event.databaseEntity.email !== event.entity.email) {
        const user = event.entity;
        Logger.log(
          `Email changed from 
        ${event.databaseEntity.email} to 
				${event.entity.email}`,
          'Email Got Updated',
        );
        event.entity.emailVerified = false;
      }
    }
  }
}
