import { Entity, PrimaryColumn } from "typeorm";

@Entity('UsersSubjectAreas')
export class UsersSubjectAreas {
    @PrimaryColumn('uuid')
    usersId: string;

    @PrimaryColumn('uuid')
    subjectAreasId: string
}