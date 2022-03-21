
## Description
Basic user management REST API performing CRUD functions.<br>
<b>Database :</b> PostgreSQL<br>
<b>ORM :</b> Prisma<br>
<b>Backend Framework:</b> NestJs

## Download PostgreSQL
```
https://www.postgresql.org/download/
```
## Download PgAdmin4
```
https://www.pgadmin.org/download/
```
## Download Postman
```
https://www.postman.com/downloads/
```

## Installation

```bash
$ npm install
```
## Server Connection in PgAdmin 4
```
host:localhost
username:asfand
password:password
```

## Running Docker
```bash
$ docker-compose up
```
## Running the app

```bash
# start
$ npm run start

# watch mode development
$ npm run start:dev

# production mode
$ npm run start:prod

# debug mode
$ npm run start:debug
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
## Prisma Commands
```bash
# create new prisma migrations
$ npx prisma migrate dev
# sync changes with the database
$ npx prisma db push
# access prisma studio
$ npx prisma studio
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
