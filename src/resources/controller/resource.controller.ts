import { Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
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
	async dumpAllResources() {
		try {
			//callingSingleResource('NLP content inventory' , "Journalist(s) or SME" , 'SMEs' , 'rec5ZZ5yQIF9ZJZjY')
			const insertedResources = await this.resourcesService.dumpAllRecordsOfAirtable();
			console.log("insertedResources: ",insertedResources)
			return {
				resources: insertedResources ? insertedResources : null,
				response: { status: insertedResources ? 200 : 400, message: insertedResources ? "Records Dumped successfully" : "No Record Dumped" }
			}
		}
		catch (error) {
			throw new InternalServerErrorException(error);
		}
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
			resources: await this.resourcesService.synchronizeAirtableAddedData(payload),
			response: { status: 200, message: "New record notification called successfully" }
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
			user: await this.resourcesService.synchronizeAirtableUpdatedData(payload),
			response: { status: 200, message: "update record notification called successfully" }
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
		const deleted = await this.resourcesService.synchronizeAirtableRemoveData(payload)
		return {
			response: { status: deleted ? 200: 400, message: deleted ? "Records Deleted successfully" : "Records fail to delete" }
		}
	}
}