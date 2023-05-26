import { join } from 'path';
export default () => {
  let database: any;

  // if (process.env.NODE_ENV === 'local') {
  //   database = {
  //     host: 'localhost',
  //     port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //     type: 'postgres',
  //     username: 'postgres',
  //     password: 'password',
  //     database: 'education-platform',
  //     synchronize: false,
  //     migrationsRun: true,
  //     autoLoadEntities: true,
  //     logging: true,
  //     migrations: [join(__dirname, '../migrations', '*{ts,js}')],
  //     entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  //     seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
  //   };
  // } else {
    database = {
      host:  'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type:  'postgres',
      username:  'postgres',
      password:  'stagingeducation#123',
      database: 'education-platform-1',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };

  //   database = {
  //     host:  'localhost',
  //     port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //     type:  'postgres',
  //     username:  'postgres',
  //     password:  'password',
  //     database: 'education-platform-2',
  //     synchronize: false,
  //     migrationsRun: true,
  //     autoLoadEntities: true,
  //     logging: true,
  //     migrations: [join(__dirname, '../migrations', '*{ts,js}')],
  //     entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  //     seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
  //   };
  // }

  //   database = {
  //     host:  'localhost',
  //     port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //     type:  'postgres',
  //     username:  'postgres',
  //     password:  'password',
  //     database: 'education-platform-2',
  //     synchronize: false,
  //     migrationsRun: true,
  //     autoLoadEntities: true,
  //     logging: true,
  //     migrations: [join(__dirname, '../migrations', '*{ts,js}')],
  //     entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  //     seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
  //   };
  // }

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
  };
};
