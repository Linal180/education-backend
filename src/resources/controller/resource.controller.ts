import { Body, Controller, Get, Post } from "@nestjs/common";
import { ResourcesService } from "../services/resources.service";
import { CronServices } from "../../cron/cron.services";
import { NotifyPayload } from "../../util/interfaces"



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

	/**
	 * @description New Record Notify is here
	 * @param payload 
	 * @returns 
	 */
	@Post('/new-record')
	async addNotification(@Body() payload: NotifyPayload) {
		console.log("add -record payload: ", payload);
		return {
			resources:  await this.resourcesService.synchronizeAirtableAddedData(payload),
			response: { status: 200, message: "New record notification  called successfully" }
		}
	}

	/**
	 * @description update a record notification
	 * @param payload 
	 * @returns 
	 */
	@Post('/update-record')
	async updateNotification(@Body() payload: NotifyPayload) {
		console.log("updateNotification is called: ", payload);
		return {
			user:  await this.resourcesService.synchronizeAirtableUpdatedData(payload),
			response: { status: 200, message: "update record notification  called successfully" }
		}
	}

	/**
	 * @description remove a record from
	 * @param payload 
	 * @returns 
	 */
	@Post('/remove-record')
	async deleteNotification(@Body() payload: NotifyPayload) {
		console.log("delete-payload: ", payload);
		return {
			// user:  await this.resourcesService.deleteMany(detroyIds) ,
			response: { status: 200, message: await this.resourcesService.synchronizeAirtableRemoveData(payload) ? "Records Deleted successfully" : "Delete record notification  called successfully" }
		}
	}
}