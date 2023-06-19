import { Body, Controller, Get, Post } from "@nestjs/common";
import { ResourcesService } from "../services/resources.service";
import { CronServices } from "../../cron/cron.services";



@Controller('resources')
export class ResourcesController {
	constructor(
		private resourcesService: ResourcesService,
		private readonly cronServices: CronServices
	) { }
	@Get('dump')
	async dumpAllResorces(): Promise<void> {
		await this.resourcesService.dumpAllRecordsOfAirtable();
	}

	@Post('/new-record')
	async addNotification(@Body() payload: any) {
		// Handle the webhook notification here
		console.log("add -record payload: ", payload);
		const newResources = await this.cronServices.checkNewRecord()

		if(newResources) {
			console.log("newResources: ",newResources)
			this.resourcesService.dumpAllRecordsOfAirtable(newResources)
		}
		
		return {
			// user:  await this.usersService.deleteOnAwsSub(awsSub) ,
			response: { status: 200, message: "New record notification  called successfully" }
		}
	}

	@Post('/update-record')
	async updateNotification(@Body() payload: any) {
		// Handle the webhook notification here
		console.log("update-payload: ", payload);

		// Process the payload and trigger the necessary actions in your app
		return {
			// user:  await this.usersService.deleteOnAwsSub(awsSub) ,
			response: { status: 200, message: "update record notification  called successfully" }
		}
	}

	@Post('/remove-record')
	async deleteNotification(@Body() payload: any) {
		console.log("delete-payload: ", payload);
		const detroyIds = await this.cronServices.removeRecords()
		console.log("<------------------delete-detroyIds------------------>: ", detroyIds)
		const checkResourcesDeleted = await this.resourcesService.deleteMany(detroyIds)


		return {
			// user:  await this.resourcesService.deleteMany(detroyIds) ,
			response: { status: 200, message: checkResourcesDeleted ? "Records Deleted successfully" : "Delete record notification  called successfully" }
		}
	}
}