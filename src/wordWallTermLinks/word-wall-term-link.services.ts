import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTermLinks } from "./entities/word-wall-term-link.entity";
import { Repository } from "typeorm";


@Injectable()
export class WordWallTermLinksService{
  constructor(
    @InjectRepository(WordWallTermLinks)
    private wordWallTermLinksRepository: Repository<WordWallTermLinks>
  ){}


}