
import { JournalistInput } from "../../journalists/dto/journalist.input.dto";
import { ResourceTypeInput } from "../../resourceType/dto/resource-type.input.dto";
import { NLNOTopNavigationInput } from "../../nlnoTopNavigation/dto/nlno-top-navigation.input.dto";
import { ClassRoomNeedInput } from "../../classRoomNeeds/dto/classroom-need.input.dto";
import { SubjectAreaInput } from "../../subjectArea/dto/subject-area.input.dto";
import { NewsLiteracyTopicInput } from "../../newLiteracyTopic/dto/newsliteracy-topic.input.dto";
import { ContentWarningInput } from "../../contentWarnings/dto/content-warning.input.dto";
import { EvaluationPreferenceInput } from "../../evaluationPreferences/dto/evaluation-preference.input.dto";
import { AssessmentTypeInput } from "../../assessmentTypes/dto/assessment-type-input.dto";
import { GradeInput } from "../../grade/dto/grade-level.input.dto";
import { WordWallTermInput , WordWallInput} from "../../wordWallTerms/dto/word-wall-terms.input";
import { wordWallTermLinkInput } from "../../wordWallTermLinks/dto/word-wall-term-link.input.dto";
import { MediaOutletFeaturedInput } from "../../mediaOutletFeatured/dto/media-outlet-featured.input.dto";
import { MediaOutletMentiondInput } from "../../mediaOutletMentioned/dto/media-outlet-mentioned.input.dto";
import { EssentialQuestionInput } from "../../essentialQuestions/dto/essential-question.input.dto";
import { FormatInput } from "../../format/dto/format.input.dto";
import { NlpStandardInput } from "../../nlpStandards/dto/nlp-standard.input.dto";
import { LinksToContentInput } from "../../contentLinks/dto/links-to-content.input.dto";

export interface IEveryActionEmail {
  email: string,
  type?: 'W' | 'P';
  isPreferred?: boolean,
}

export interface IEveryActionAddress {
  city: string;
  type: string;
  countryCode: string;
  addressLine1: string;
  addressLine2: string;
  zipOrPostalCode: string;
  stateOrProvince: string;
}

export interface IEveryActionCustomField {
  customFieldId: number;
  customFieldGroupId: number;
  assignedValue: number | string;
}

export interface IEveryActionPayload {
  vanId?: string;
  firstName?: string;
  lastName?: string;
  employer?: string;
  emails?: IEveryActionEmail[];
  addresses?: IEveryActionAddress[];
  customFieldValues?: IEveryActionCustomField[]
}

export type IEveryActionFindPayload = Pick<IEveryActionPayload, 'firstName' | 'lastName' | 'emails' | 'vanId'>

export type NotifyPayload = {
  base: {
    id: string;
  };
  webhook: {
    id: string;
  };
  timestamp: string;
};

export interface AirtablePayloadList {
  timestamp?: string;
  baseTransactionNumber?: number;
  actionMetadata?: object;
  payloadFormat?: string;
  changedTablesById?: any;
  // Rest of the payload fields...
}


export interface WebhookPayload {
  timestamp: string;
  baseTransactionNumber: number;
  actionMetadata: {
    source: string;
    sourceMetadata: {
      user: {
        id: string;
        email: string;
        permissionLevel: string;
        name: string;
        profilePicUrl: string;
      };
    };
  };
  payloadFormat: string;
  changedTablesById: {
    [tableId: string]: {
      changedRecordsById: {
        [recordId: string]: {
          current: {
            cellValuesByFieldId: {
              [fieldId: string]: string | object;
            };
          };
        };
      };
    };
  };
}

type WebhookOptions = {
  filters: {
    changeTypes: string[];
    dataTypes: string[];
    recordChangeScope: string;
    watchDataInFieldIds: string[];
  };
};

type WebhookSpecification = {
  options: WebhookOptions;
};

export type Webhook = {
  id: string;
  specification: WebhookSpecification;
  notificationUrl: string;
  cursorForNextPayload: number;
  lastNotificationResult: any | null;
  areNotificationsEnabled: boolean;
  lastSuccessfulNotificationTime: string | null;
  isHookEnabled: boolean;
  expirationTime: string;
};



export type resourceOperations = "Add" | "Update"

export type AirtablePayload = {
  recordId?: string;
  checkologyPoints?: number;
  averageCompletedTime?: string;
  shouldGoToDormant?: string;
  status?: string;
  imageGroup?: string;
  imageStatus?: string;
  auditStatus?: string;
  auditLink?: string;
  userFeedBack?: string;
  linkToTranscript?: string;
  contentTitle?: string;
  contentDescription?: string;
  linkToDescription?: string;
  onlyOnCheckology?: boolean | string;
  featuredInSift?: boolean | string;
  estimatedTimeToComplete?: number | string;
  formats?: Array<FormatInput> | null | [];
  journalist?: Array<JournalistInput> | null | [];
  resourceType?: Array<ResourceTypeInput> | null;
  nlnoTopNavigation?: Array<NLNOTopNavigationInput> | null;
  classRoomNeed?: Array<ClassRoomNeedInput> | null;
  nlpStandard?: Array<NlpStandardInput> | null;
  subjectArea?: Array<SubjectAreaInput> | null;
  newsLiteracyTopic?: Array<NewsLiteracyTopicInput> | null;
  contentWarning?: Array<ContentWarningInput> | null;
  evaluationPreference?: Array<EvaluationPreferenceInput> | null;
  assessmentType?: Array<AssessmentTypeInput> | null;
  prerequisite?: string | null;
  gradeLevel?: Array<GradeInput> | null;
  wordWallTerms?: Array<WordWallTermInput | WordWallInput> | null;
  wordWallTermLinks?: Array<wordWallTermLinkInput> | null;
  mediaOutletsFeatured?: Array<MediaOutletFeaturedInput> | null;
  mediaOutletsMentioned?: Array<MediaOutletMentiondInput> | null;
  essentialQuestions?: Array<EssentialQuestionInput> | null;
  linksToContent?: Array<LinksToContentInput> | null;
}

export type UpdateCleanPayload = AirtablePayload

export type RawResource = {
  "id"?: string;
  "Resource ID"?: number;
  'Checkology points'?: number;
  "Average completion times"?: string;
  "Why should it go dormant?"?: string;
  "Status"?: string;
  "Image group"?: string;
  "Image status"?: string;
  "Audit status"?: string;
  "Link to audit"?: string;
  "User feedback"?: string;
  "Link to transcript"?: string;
  "Content title"?: string;
  '"About" text'?: string;
  "Link to description"?: string;
  "Only on Checkology"?: boolean | string;
  "Format(s)"?: Array<string> | null | [];
  "Journalist(s) or SME"?: null | string;
  "Journalist or SME organization(s)"?: null | string;
  "Name of link"?: string;
  "Link to content (1)"?: string;
  "Name of link (2)"?: string;
  "Link to content (2)"?: string;
  "NLP standards"?: Array<string> | null | [];
  "Resource type (USE THIS)"?: Array<string> | null;
  "NLNO top navigation"?: Array<string> | null;
  "Classroom needs"?: Array<string> | null;
  "Subject areas"?: Array<string> | null;
  "News literacy topics"?: Array<string> | null;
  "Content warnings"?: Array<string> | null;
  "Evaluation preference"?: Array<string> | null;
  "Assessment types"?: Array<string> | null;
  "Prerequisites/related"?: string | null;
  "Grade level/band"?: Array<string> | null;
  "Word wall terms"?: Array<string> | null;
  "Word wall terms to link"?: string | null;
  " Media outlets featured"?: Array<string> | null;
  " Media outlets mentioned"?: Array<string> | null;
}