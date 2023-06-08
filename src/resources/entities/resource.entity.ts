import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column, CreateDateColumn, Entity, Index, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AssessmentType } from "../../assessmentTypes/entities/assessment-type.entity";
import { ClassRoomNeed } from "../../classRoomNeeds/entities/classroom-needs.entity";
import { ContentLink } from "../../contentLinks/entities/content-link.entity";
import { ContentWarning } from "../../contentWarnings/entities/content-warning.entity";
import { EvaluationPreference } from "../../evaluationPreferences/entities/evaluation-preference.entity";
import { Format } from "../../format/entities/format.entity";
import { Grade } from "../../grade/entities/grade-levels.entity";
import { Journalist } from "../../journalists/entities/journalist.entity";
import { NewsLiteracyTopic } from "../../newLiteracyTopic/entities/newliteracy-topic.entity";
import { NLNOTopNavigation } from "../../nlnoTopNavigation/entities/nlno-top-navigation.entity";
import { NlpStandard } from "../../nlpStandards/entities/nlp-standard.entity";
import { Prerequisite } from "../../prerequisite/entities/prerequisite.entity";
import { ResourceType } from "../../resourceType/entities/resource-types.entity";
import { SubjectArea } from "../../subjectArea/entities/subject-areas.entity";

@Entity({ name: "Resources" })
@ObjectType()
export class Resource {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Index({ fulltext: true })
  @Column({ nullable: true, type: 'varchar' })
  @Field({ nullable: true })
  contentTitle: string;

  @Column({ nullable: true})
  recordId: string;


  // @Index({ fulltext: true })
  // @Column({ type: 'tsvector', select: false, nullable: true })
  // contentTitle_tsvector: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  contentDescription: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  linkToDescription: string;

  @Column({ nullable: true })
  @Field({ nullable: true , defaultValue: false})
  onlyOnCheckology: Boolean;

  @Column({ nullable: true })
  @Field({ nullable: true , defaultValue: false})
  featuredInSift: Boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  estimatedTimeToComplete: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  checkologyPoints: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  averageCompletedTime: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  ImageGroup: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  ImageStatus: string;

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


  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  lastReviewDate: string;
  
  @CreateDateColumn({ type: "timestamptz" })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field()
  updatedAt: string;
}
