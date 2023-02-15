import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AssessmentType } from "./assessement-type.entity";
import { ClassRoomNeed } from "./classroom-needs.entity";
import { ContentLink } from "./content-link.entity";
import { ContentWarning } from "./content-warning.entity";
import { EvaluationPreference } from "./evaluation-preference.entity";
import { Format } from "./format.entity";
import { Grade } from "./grade-levels.entity";
import { Journalist } from "./journalist.entity";
import { NewsLiteracyTopic } from "./newliteracy-topic.entity";
import { NLNOTopNavigation } from "./nlno-top-navigation.entity";
import { NlpStandard } from "./nlp-standard.entity";
import { Prerequisite } from "./prerequisite.entity";
import { ResourceType } from "./resource-types.entity";
import { SubjectArea } from "./subject-areas.entity";

@Entity({ name: "Resources" })
@ObjectType()
export class Resource {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  @Field({ nullable: true })
  contentTitle: string;

  @Index({ fulltext: true })
  @Column({ type: 'tsvector', select: false, nullable: true })
  contentTitle_tsvector: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  contentDescription: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  estimatedTimeToComplete: string;

  @Field({ nullable: true })
  journalistId: string;

  @Field(type => [Journalist], { nullable: 'itemsAndList' })
  @ManyToMany(type => Journalist, journalist => journalist.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  journalist: Journalist[];

  @Field(type => [ContentLink], { nullable: 'itemsAndList' })
  @OneToMany(() => ContentLink, contentLink => contentLink.resource)
  linksToContent: ContentLink[];

  @Field({ nullable: true })
  linkToContentId: string;

  @Field(type => [ResourceType], { nullable: 'itemsAndList' })
  @ManyToMany(type => ResourceType, resource => resource.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  resourceType: ResourceType[];

  @Field(type => [NLNOTopNavigation], { nullable: 'itemsAndList' })
  @ManyToMany(type => NLNOTopNavigation, nlnoTopNavigation => nlnoTopNavigation.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  nlnoTopNavigation: NLNOTopNavigation[];

  @Field(type => [Format], { nullable: 'itemsAndList' })
  @ManyToMany(type => Format, format => format.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  format: Format[];

  @Field(type => [Grade], { nullable: 'itemsAndList' })
  @ManyToMany(type => Grade, grade => grade.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  gradeLevel: Grade[];

  @Field(type => [ClassRoomNeed], { nullable: 'itemsAndList' })
  @ManyToMany(type => ClassRoomNeed, classRoomNeed => classRoomNeed.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  classRoomNeed: ClassRoomNeed[];

  @Field(type => [SubjectArea], { nullable: 'itemsAndList' })
  @ManyToMany(type => SubjectArea, subjectArea => subjectArea.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  subjectArea: SubjectArea[];

  @Field(type => [NlpStandard], { nullable: 'itemsAndList' })
  @ManyToMany(type => NlpStandard, nlpStandard => nlpStandard.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  nlpStandard: NlpStandard[];

  @Field(type => [NewsLiteracyTopic], { nullable: 'itemsAndList' })
  @ManyToMany(type => NewsLiteracyTopic, newsLiteracyTopic => newsLiteracyTopic.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  newsLiteracyTopic: NewsLiteracyTopic[];

  @Field(type => [ContentWarning], { nullable: 'itemsAndList' })
  @ManyToMany(type => ContentWarning, contentWarning => contentWarning.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  contentWarning: ContentWarning[];

  @Field(type => [EvaluationPreference], { nullable: 'itemsAndList' })
  @ManyToMany(type => EvaluationPreference, evaluationPreference => evaluationPreference.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  evaluationPreference: EvaluationPreference[];

  @Field(type => [AssessmentType], { nullable: 'itemsAndList' })
  @ManyToMany(type => AssessmentType, assessmentType => assessmentType.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  assessmentType: AssessmentType[];

  @Field(type => [Prerequisite], { nullable: 'itemsAndList' })
  @ManyToMany(type => Prerequisite, prerequisite => prerequisite.resources, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  prerequisite: Prerequisite[];


  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}
