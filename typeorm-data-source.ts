import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const devPGOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
}

const stagPGOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
}

const prodPGOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
};

let options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database:  process.env.DATABASE_NAME || 'education-platform-2',
  entities: ['src/**/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  seeds: ['src/seeders/*.seeder{.ts,.js}'],
};


if (process.env.NODE_ENV === 'local') {

  options = { ...options, ...devPGOptions }
  console.log("options: ",options)
} else if (process.env.NODE_ENV === 'staging') {
  options = { ...options, ...stagPGOptions }
}
 else {
  console.log("options:================else ",options)
  console.log("devPGOptions: ",devPGOptions);
  
  options = { ...options, ...devPGOptions }
}

const dataSource = new DataSource(options)
export default dataSource;