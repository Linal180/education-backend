import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('UserGrades')
export class UserGrades {
    @Column('uuid')
    usersId: string;

    @PrimaryColumn('uuid')
    gradesId: string
}