import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WordWallTerms } from "./entities/word-wall-term.entity";
import { Repository } from "typeorm";

@Injectable()
export class wordWallTermsService {
  constructor(
    @InjectRepository(WordWallTerms)  
    private wordWallTermsRepository: Repository<WordWallTerms>
  ) {}
}