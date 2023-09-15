import { join } from 'path';
export default () => {
  let database: any;

  if (process.env.NODE_ENV === 'local') {
    console.log("local environment")
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
  } else if (process.env.NODE_ENV === 'staging') {
    database = {
      host: process.env.DATABASE_HOST || 'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: 'postgres',
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'stagingeducation#123',
      database: process.env.DATABASE_NAME || 'education-dev',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };
  } else if (process.env.NODE_ENV === 'production') {

    database = {
      host: process.env.DATABASE_HOST || 'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: 'postgres',
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'stagingeducation#123',
      database: 'education-production',
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
    allowedAPIKeys: process.env.AWS_ALLOWED_API_KEYS,
  }

  const everyAction = {
    apiUrl: process.env.EVERYACTION_API_URL || "https://api.securevan.com",
    appName: process.env.EVERYACTION_APP_NAME || "ea002.newsliteracyproject.api",
    apiKey: process.env.EVERYACTION_API_KEY || "aa4edb74-83e6-336a-548a-509eacab1e88|1",
    educatorActivistCodeId: process.env.EVERYACTION_EDUCATOR_ACTIVIST_CODE_ID || 4537635,
    newsletterActivistCodeId: process.env.EVERYACTION_NEWSLETTER_ACTIVIST_CODE_ID || 4507252,
    newsletterPublicActivistCodeId: process.env.EVERYACTION_NEWSLETTER_PUBLIC_ACTIVIST_CODE_ID || 4507247,
    siftActivistCode: process.env.EVERYACTION_SIFT_ACTIVIST_CODE_ID || 4507252,
    nlnInsiderActivistCode: process.env.EVERYACTION_NLN_INSIDER_ACTIVIST_CODE_ID || 4537703,
    grade3To5ActivistCode: process.env.EVERYACTION_GRADE_3_5_ACTIVIST_CODE_ID || 4708526,
    grade6To8ActivistCode: process.env.EVERYACTION_GRADE_6_8_ACTIVIST_CODE_ID || 4409616,
    grade9To12ActivistCode: process.env.EVERYACTION_GRADE_9_12_ACTIVIST_CODE_ID || 4409511,
    gradeHigherActivistCode: process.env.EVERYACTION_GRADE_HIGHER_ACTIVIST_CODE_ID || 4409617,
    gradeOtherActivistCode: process.env.EVERYACTION_GRADE_OTHER_ACTIVIST_CODE_ID || 5104941,
    subjectArtsActivistCode: process.env.EVERYACTION_SUBJECT_ARTS_ACTIVIST_CODE_ID || 4409545,
    subjectElaActivistCode: process.env.EVERYACTION_SUBJECT_ELA_ACTIVIST_CODE_ID || 4409541,
    subjectJournalismActivistCode: process.env.EVERYACTION_SUBJECT_JOURNALISM_ACTIVIST_CODE_ID || 4463300,
    subjectLibraryAndMediaActivistCode: process.env.EVERYACTION_SUBJECT_LIBRARY_MEDIA_ACTIVIST_CODE_ID || 4409532,
    subjectSocialStudiesActivistCode: process.env.EVERYACTION_SUBJECT_SOCIAL_STUDIES_ACTIVIST_CODE_ID || 4409536,
    subjectStemActivistCode: process.env.EVERYACTION_SUBJECT_STEM_ACTIVIST_CODE_ID || 4409537,
    subjectOthersActivistCode: process.env.EVERYACTION_SUBJECT_OTHER_ACTIVIST_CODE_ID || 5104942,
    // you can find what these activist codes are for at: 
    // https://www.notion.so/newslitproject/Education-EveryAction-sync-318235bb1b114bfd80ea6948393d5d48
  }

  const google = {
    clientId: process.env.GOOGLE_CLIENT_ID || '525188979377-75952fi8nbee5eo87oud3eslf2e0hnt5.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
  }

  const microsoft = {
    clientId: process.env.MICROSOFT_CLIENT_ID || '0fda423c-f7a2-416c-9f49-2c776ff1a95f',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'NAL8Q~tL~U0FhiUfUFKD6QOxuyJJwGqa_URJSb.D'
  }

  const mailgun = {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
    username: process.env.MAILGUN_USERNAME || '',
    from: process.env.MAILGUN_FROM || ''
  }

  return {
    // airtbale
    personalToken: process.env.AT_SECRET_API_TOKEN || '',
    baseId: process.env.AT_BASE_ID || '',
    tableId: process.env.AT_TABLE_ID || '',
    educatorBaseId: process.env.AT_EDUCATOR_BASE_ID || '',
    educatorTableId: process.env.AT_EDUCATOR_TABLE_ID || '',
    addWebHookId: process.env.NEW_RECORD_WEB_HOOK_ID || '',
    updateWebHookId: process.env.UPDATE_RECORD_WEB_HOOK_ID || '',
    removeWebHookId: process.env.DELETED_RECORD_WEB_HOOK_ID || '',
    webHookBaseUrl: (process.env.WEB_HOOK_BASE_URL ?? `${process.env.WEB_HOOK_BASE_URL}/${process.env.AT_TABLE_ID}/webhooks`) || '',
    getRecordBaseUrl: (process.env.GET_RECORD_BASE_URL ?? `${process.env.GET_RECORD_BASE_URL}/${process.env.AT_TABLE_ID}/${process.env.AT_TABLE_ID}`) || '',
    PORT: parseInt(process.env.PORT, 10) || 3001,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
    epNextAppBaseURL: process.env.EP_NEXT_APP_BASE_URL || 'https://educationplatform.vercel.app/',
    database,
    aws,
    everyAction,
    google,
    microsoft,
    defaultPass: 'Admin@123',
    redis: {
      name: "education-backend-redis",
      socket: {
        url: process.env.REDIS_URL || "redis://education-backend-redis.rjmpzx.clustercfg.use1.cache.amazonaws.com:6379",
        keepAlive: 1,
        tls: process.env.NODE_ENV === "production" ? true : false,
        rejectUnauthorized: false,
      },
    },
    mailgun,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',//sendGridAPIkey
    FROM_EMAIL: process.env.FROM_EMAIL || 'arslan.ahmad@kwanso.com',
    templateId: process.env.TEMPLATE_ID || 'd-dfe49380bd224813a2d13d7cd48215c6',
    templateName: process.env.TEMPLATE_NAME || 'ResetEmailTemplate'
  };
};
