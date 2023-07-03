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

	/**
	 * @description New Record Notify is here
	 * @param payload 
	 * @returns 
	 */
	@Post('/new-record')
	async addNotification(@Body() payload: any) {
		console.log("add -record payload: ", payload);
		const newResources = await this.cronServices.checkNewRecord()
		let newResourcesEntities = []
		if(newResources) {
			const cleanResources = await this.resourcesService.cleanResources(newResources);
			for(let resource of cleanResources) {
				const newResource =await this.resourcesService.createResource(resource)
				if(newResource){
					newResourcesEntities.push(newResource)
				}
			}
			console.log("newResources: ",newResourcesEntities)	
		}
		
		return {
			resources:  await this.resourcesService.saveEntities(newResourcesEntities) ,
			response: { status: 200, message: "New record notification  called successfully" }
		}
	}

	/**
	 * @description update a record notification
	 * @param payload 
	 * @returns 
	 */
	@Post('/update-record')
	async updateNotification(@Body() payload: any) {
		console.log("update-payload: ", payload);
		return {
			user:  this.resourcesService.airtableUpdateRecords(),
			response: { status: 200, message: "update record notification  called successfully" }
		}
	}

	/**
	 * @description remove a record from
	 * @param payload 
	 * @returns 
	 */
	@Post('/remove-record')
	async deleteNotification(@Body() payload: any) {
		console.log("delete-payload: ", payload);
		const detroyIds = await this.cronServices.removeRecords()
		console.log("<------------------delete-destroyIds------------------>: ", detroyIds)
		const checkResourcesDeleted = await this.resourcesService.deleteMany(detroyIds)


		return {
			// user:  await this.resourcesService.deleteMany(detroyIds) ,
			response: { status: 200, message: checkResourcesDeleted ? "Records Deleted successfully" : "Delete record notification  called successfully" }
		}
	}
}