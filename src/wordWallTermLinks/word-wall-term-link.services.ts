import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { wordWallTermLinks } from "./entities/word-wall-term-link.entity";
import { Repository } from "typeorm";


@Injectable()
export class wordWallTermLinksService{
  constructor(
    @InjectRepository(wordWallTermLinks)
    private wordWallTermLinksRepository: Repository<wordWallTermLinks>
  ){}


}