import { join } from 'path';
export default () => {
  let database: any;


  if(process.env.NODE_ENV === 'local'){
      database = {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        type: process.env.DATABASE_TYPE || 'postgres',
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'education-platform',
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
      type: process.env.DATABASE_TYPE || 'postgres',
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'stagingeducation#123',
      database: process.env.DATABASE_NAME || 'education-platform',
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      logging: true,
      migrations: [join(__dirname, '../migrations', '*{ts,js}')],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      seeds: [join(__dirname, '../seeders', '*.seeder.{ts,js}')]
    };
    
  }else {
    database = {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      type: process.env.DATABASE_TYPE || 'postgres',
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'education-platform',
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
    database,

  };
};
