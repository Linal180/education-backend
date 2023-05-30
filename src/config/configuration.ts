import { join } from 'path';
export default () => {
  let database: any;

  if (process.env.NODE_ENV === 'local') {
    database = {
      host: 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: 'postgres',
      username: 'postgres',
      password: 'password',
      database: 'education-platform',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };
  } else {
    database = {
      host: 'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: 'postgres',
      username: 'postgres',
      password: 'stagingeducation#123',
      database: 'education-platform',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };
  }

  const aws = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    version: process.env.AWS_VERSION,
    clientId: process.env.AWS_CLIENT_ID,
    clientSecret: process.env.AWS_CLIENT_SECRET,
    userPoolId: process.env.AWS_USER_POOL_ID,
    redirectUri: process.env.AWS_AUTH_TOKEN_REDIRECT_URI,
    AuthEndpoint: process.env.AWS_AUTH_TOKEN_ENDPOINT,
  }

  const everyAction = {
    apiUrl: process.env.EVERYACTION_API_URL,
    appName: process.env.EVERYACTION_APP_NAME,
    apiKey: process.env.EVERYACTION_API_KEY,
    educatorActivistCodeId: process.env.EVERYACTION_EDUCATOR_ACTIVIST_CODE_ID,
    newsletterActivistCodeId: process.env.EVERYACTION_NEWSLETTER_ACTIVIST_CODE_ID,
    newsletterPublicActivistCodeId: process.env.EVERYACTION_NEWSLETTER_PUBLIC_ACTIVIST_CODE_ID,
    siftActivistCode: process.env.EVERYACTION_SIFT_ACTIVIST_CODE_ID,
    nlnInsiderActivistCode: process.env.EVERYACTION_NLN_INSIDER_ACTIVIST_CODE_ID,
    grade3To5ActivistCode: process.env.EVERYACTION_GRADE_3_5_ACTIVIST_CODE_ID,
    grade6To8ActivistCode: process.env.EVERYACTION_GRADE_6_8_ACTIVIST_CODE_ID,
    grade9To12ActivistCode: process.env.EVERYACTION_GRADE_9_12_ACTIVIST_CODE_ID,
    gradeHigherActivistCode: process.env.EVERYACTION_GRADE_HIGHER_ACTIVIST_CODE_ID,
    gradeOtherActivistCode: process.env.EVERYACTION_GRADE_OTHER_ACTIVIST_CODE_ID,
    subjectArtsActivistCode: process.env.EVERYACTION_SUBJECT_ARTS_ACTIVIST_CODE_ID,
    subjectElaActivistCode: process.env.EVERYACTION_SUBJECT_ELA_ACTIVIST_CODE_ID,
    subjectJournalismActivistCode: process.env.EVERYACTION_SUBJECT_JOURNALISM_ACTIVIST_CODE_ID,
    subjectLibraryAndMediaActivistCode: process.env.EVERYACTION_SUBJECT_LIBRARY_MEDIA_ACTIVIST_CODE_ID,
    subjectSocialStudiesActivistCode: process.env.EVERYACTION_SUBJECT_SOCIAL_STUDIES_ACTIVIST_CODE_ID,
    subjectStemActivistCode: process.env.EVERYACTION_SUBJECT_STEM_ACTIVIST_CODE_ID,
    subjectOthersActivistCode: process.env.EVERYACTION_SUBJECT_OTHER_ACTIVIST_CODE_ID,
    // you can find what these activist codes are for at: 
    // https://www.notion.so/newslitproject/Education-EveryAction-sync-318235bb1b114bfd80ea6948393d5d48
  }

  return {
    // airtbale
    personalToken: (process.env.AT_SECRET_API_TOKEN) || '',
    baseId: process.env.AT_BASE_ID ||  '',
    tableId:  process.env.AT_TABLE_ID ||  '',
    addWebHookId: process.env.NEW_RECORD_WEB_HOOK_ID || '',
    removeWebHookId: process.env.DELETED_RECORD_WEB_HOOK_ID || '',
    webHookBaseUrl: ( process.env.WEB_HOOK_BASE_URL ?? `${process.env.WEB_HOOK_BASE_URL}/${process.env.AT_TABLE_ID}/webhooks` )|| '',
    getRecordBaseUrl: ( process.env.GET_RECORD_BASE_URL ?? `${process.env.GET_RECORD_BASE_URL}/${process.env.AT_TABLE_ID}/${process.env.AT_TABLE_ID}`) || '',
    PORT: parseInt(process.env.PORT, 10) || 3001,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
    database,
    aws,
    everyAction
  };
};
