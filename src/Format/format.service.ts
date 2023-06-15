import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Format, FormatInput } from "./entities/format.entity";
import { Repository } from "typeorm";


@Injectable()
export class FormatService {
    constructor(
        @InjectRepository(Format)
        private readonly formatRepository: Repository<Format>
    ) { }

    async findOneOrCreate(formatInput:FormatInput):Promise<Format>{
        try{
            const { name } = formatInput;
            const format = this.formatRepository.findOne({ where: { name } });
            if(!format){
                const formatInstance = this.formatRepository.create({ name });
                return await this.formatRepository.save(formatInstance) || null;
            }
            return format
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllByNameOrCreate(formats:FormatInput[]):Promise<Format[]>{
        try{
            const newFormats = []
            for(let format of formats){ 
                const validFormat = await this.findOneOrCreate(format)
                if(validFormat){
                    newFormats.push(validFormat) 
                }
            }
            return newFormats
        }
        catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async findAllDistinctByName(): Promise<string[]> {
        try{
            const formats = await this.formatRepository.find({
                select: ['name'],
            });
            const distinctFormats = Array.from(new Set(formats.map(format => format.name)));
            return distinctFormats
        }
        catch(error) {
            throw new InternalServerErrorException(error);
        }
    }
}