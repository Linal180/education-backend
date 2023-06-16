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
import { UsersService } from '../users.service';
import { generate } from 'generate-password';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly connection: DataSource,
    private readonly usersService: UsersService,
  ) {
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    event.entity.password = await bcrypt.hash(
      event.entity.password ?? generate({ length: 10, numbers: true }),
      await bcrypt.genSalt(),
    );
  }

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
