import { Organization } from "../../src/users/entities/organization.entity";
import { ORGANIZATION } from "../users/seeds/seed-data";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class OrganizationSeeder implements Seeder {
    public async run (dataSource : DataSource): Promise<void>{
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(); 
        try{
            const orgainzationRepository = dataSource.getRepository(Organization);
            //checking if database does not have any resources
            const organization = await orgainzationRepository.find();
            if(organization.length === 0 ){
                const result = ORGANIZATION.map( async (item) => {
                    await orgainzationRepository.create(item)
                    
                })

                await queryRunner.manager.save(result);
                await queryRunner.commitTransaction();
            }
        }
        catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}