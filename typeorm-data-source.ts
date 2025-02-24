import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import 'dotenv/config'

const localPGOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
}

const stagPGOptions = {
  host: process.env.DATABASE_HOST || 'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'stagingeducation#123',
}

const devPGOptions = {
  host: process.env.DATABASE_HOST || 'staging-education.ctywplziivm7.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'stagingeducation#123',
}

let options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database:  process.env.DATABASE_NAME || 'education-platform',
  entities: ['src/**/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  seeds: ['src/seeders/*.seeder{.ts,.js}'],
};

if (process.env.NODE_ENV === 'local') {
  options = { ...options, ...localPGOptions }
} else if (process.env.NODE_ENV === 'staging'){
  options = { ...options, ...stagPGOptions }
} else if (process.env.NODE_ENV === 'dev'){
  options = { ...options, ...stagPGOptions }
}

const dataSource = new DataSource(options)
export default dataSource