import { Controller, Get } from "@nestjs/common";
import { ResourcesService } from "../services/resources.service";
@Controller('resources')
export class ResourcesController {
  constructor(
    private resourcesService: ResourcesService
  ) { }
  @Get('dump')
  async dumpAllResorces(): Promise<void> {
    await this.resourcesService.dumpAllRecordsOfAirtable();
  }
}