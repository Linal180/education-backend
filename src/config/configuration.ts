import { join } from 'path';
export default () => {
  let database: any;
  
  if (process.env.NODE_ENV === 'local') {
    database = {
      type: process.env.DATABASE_TYPE || 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };
  } else {
    database = {
      host:  'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type:  'postgres',
      username:  'postgres',
      password:  'stagingeducation#123',
      database: 'education-platform',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };

    // database = {
    //   host:  'localhost',
    //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    //   type:  'postgres',
    //   username:  'postgres',
    //   password:  'password',
    //   database: 'education-platform',
    //   synchronize: false,
    //   migrationsRun: true,
    //   autoLoadEntities: true,
    //   logging: true,
    //   migrations: [join(__dirname, '../migrations', '*{ts,js}')],
    //   entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    //   seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    // };
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
  
  return {
    PORT: parseInt(process.env.PORT, 10) || 3001,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
    database,
    aws,
  };
};
