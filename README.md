
## Description
Basic user management REST API performing CRUD functions.Used accesstokens and refresh tokens in cookies to implement authentication in the API.<br>
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

```
1.Start the server using ` $ docker-compose up ` 
2.Connect to the server in PgAdmin4 using the credentials provided above.
3.Run the app using ` $ npm run start:dev `
4.Start Postman
5.Send any of the request from below

POST-localhost:3000/auth/local/signup (Sign Up a User)
POST-localhost:3000/auth/local/signin (Sign In an existing user)
GET-localhost:3000/auth/getalluser (Fetches all the users in the database)
GET-localhost:3000/auth/getuserbyemail (Fetches a user with a specific email in parameters)
PUT-localhost:3000/auth/updateuser (Updates a user with a specific email passed in parameters)
DELETE-localhost:3000/auth/deletebyemail (Delete a user with a specific email passed in the parameters)
```
## npm
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
