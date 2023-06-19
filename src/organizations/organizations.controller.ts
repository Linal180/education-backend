import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('users')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

}

