<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

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

## Envirnment Variable

```bash
# add to .env

NODE_ENV=local
POSTGRES_USER=postgres
POSTGRES_PASSWORD=adminstagingeducation#123
POSTGRES_DB=staging-education
PGADMIN_DEFAULT_EMAIL=khalid.rasool@kwanso.com
PGADMIN_DEFAULT_PASSWORD=adminstagingeducation#123


AWS_ACCESS_KEY_ID=AKIAT2XBNJHIPO3CSV6E
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1
AWS_CLIENT_ID=7vjo3a47a88j9vjqkma45jlnnv # NLP-dev client
# AWS_CLIENT_ID=566mqu1h01nfifdpqo7plcuepf # NLP-dev-2 client
AWS_CLIENT_SECRET=o7e2uc7vqeq91rgg2bggns5665m7nunq2jmnnqdrneaks4f2ue4 # NLP-dev client
# AWS_CLIENT_SECRET=1q8ml84q151s1po8f0809rjpqcba20eke2821mbhgegh7f485c5i # NLP-dev-2 client 
AWS_USER_POOL_ID=us-east-1_iBb7CJZGw #NLP-dev 
# AWS_USER_POOL_ID=us-east-1_6jSvHxjPR #NLP-dev-2
AWS_VERSION=latest
AWS_AUTH_TOKEN_ENDPOINT=https://checkology-dev.auth.us-east-1.amazoncognito.com/oauth2/token
AWS_AUTH_TOKEN_REDIRECT_URI=http://localhost:3000/
# AWS_AUTH_TOKEN_REDIRECT_URI=https://educationplatform.vercel.app/

EVERYACTION_API_URL=https://api.securevan.com
EVERYACTION_APP_NAME=ea002.newsliteracyproject.api
EVERYACTION_API_KEY=aa4edb74-83e6-336a-548a-509eacab1e88|1
EVERYACTION_EDUCATOR_ACTIVIST_CODE_ID=4537635
EVERYACTION_NEWSLETTER_ACTIVIST_CODE_ID=4507252
EVERYACTION_NEWSLETTER_PUBLIC_ACTIVIST_CODE_ID=4507247
EVERYACTION_SIFT_ACTIVIST_CODE_ID=4507252
EVERYACTION_NLN_INSIDER_ACTIVIST_CODE_ID=4537703
EVERYACTION_GRADE_3_5_ACTIVIST_CODE_ID=4708526
EVERYACTION_GRADE_6_8_ACTIVIST_CODE_ID=4409616
EVERYACTION_GRADE_9_12_ACTIVIST_CODE_ID=4409511
EVERYACTION_GRADE_HIGHER_ACTIVIST_CODE_ID=4409617
EVERYACTION_GRADE_OTHER_ACTIVIST_CODE_ID=5104941
EVERYACTION_SUBJECT_ARTS_ACTIVIST_CODE_ID=4409545
EVERYACTION_SUBJECT_ELA_ACTIVIST_CODE_ID=4409541
EVERYACTION_SUBJECT_JOURNALISM_ACTIVIST_CODE_ID=4463300
EVERYACTION_SUBJECT_LIBRARY_MEDIA_ACTIVIST_CODE_ID=4409532
EVERYACTION_SUBJECT_SOCIAL_STUDIES_ACTIVIST_CODE_ID=4409536
EVERYACTION_SUBJECT_STEM_ACTIVIST_CODE_ID=4409537
EVERYACTION_SUBJECT_OTHER_ACTIVIST_CODE_ID=5104942

AT_SECRET_API_TOKEN=patKfSxpUp205nXiQ.3c6c17fd1d0ce052a6d425a51f97ed696783c52cc7704a52b84ed4cedb827e1e #Personal_AccessToken
AT_BASE_ID=app1hZd1AL5fS9F7y #baseId like app....
AT_TABLE_ID=tblgigCmS7C2iPCkm #tableId like tbl
NEW_RECORD_WEB_HOOK_ID = achep5lcCZLWBfmdO
DELETED_RECORD_WEB_HOOK_ID = achRCzjdFu4JOAJyr
WEB_HOOK_BASE_URL = https://api.airtable.com/v0/bases
GET_RECORD_BASE_URL = https://api.airtable.com/v0

```
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
