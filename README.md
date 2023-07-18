
## Installation

```bash
$ npm install
```

Create a postgres database 'education-platform'. and start server to migrate all table in database.
After this, stop server and run seeders

```bash
$ npm run seeds
```

## Populate resources from Airtable
1- DUMP ALL Resources: POST API : http://localhost:3001/resources/dump
2- then CRON will run after every 10 minute automatically


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
