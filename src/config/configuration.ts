import { join } from 'path';
export default () => {
  let database: any;

  if (process.env.NODE_ENV === 'production') {
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
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: process.env.DATABASE_TYPE || 'postgres',
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
  }

  return {
    PORT: parseInt(process.env.PORT, 10) || 3001,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s',
    PORTAL_APP_BASE_URL:
      process.env.PORTAL_APP_BASE_URL || 'http://localhost:3000/',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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',
    INVITATION_TEMPLATE_ID: process.env.INVITATION_TEMPLATE_ID || 'd-1ee80000e11749cd9c522cec30e2606c',
    FORGOT_PASSWORD_TEMPLATE_ID: process.env.FORGOT_PASSWORD_TEMPLATE_ID || 'd-e3de9b6bfaca47329536e0c292698506',
    redis: {
      name: 'helmerLegal',
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    },
    FROM_EMAIL: process.env.FROM_EMAIL || 'shah.zaib@kwanso.com',
    database,
    // AWS
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'helmer-staging',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_S3_REGION: process.env.AWS_S3_REGION || 'us-east-1',
    AWS_SAVE_FILE: process.env.AWS_SAVE_FILE || 'user-uuid/case-uuid',

    EMAIL_CONSTANT: {
      year: new Date().getFullYear(),
      companyUrl: process.env.MAILER_COMPANY_URL || 'https://helmerlegal.com/',
      companyUrlText: process.env.MAILER_COMPANY_URL_TEXT || 'helmerlegal.com',
      companyName: process.env.COMPANY_NAME || 'HC&K',
    },
  };
};
