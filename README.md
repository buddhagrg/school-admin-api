## School Admin
School Admin is a user friendly web application for school administration built on top of React, Redux toolkit, NodeJS and PgSQL.

## Repo Overview
This repo is for api. Currently, [nodemailer](https://nodemailer.com/)  is used for email sending during registration, password setup and password change. So, to run this project successfully on your local machine, you first need an gmail service with App password feature enabled through which you can get the password and use in the env (**MAIL_AUTH_PWD** and **MAIL_AUTH_USER**). You need to create a **.env** file (Example in [.env.example](https://github.com/buddhagrg/school-admin-api/blob/master/.env.example))

## Todos
- [x] Live deployment
- [ ] System stabilization
- [ ] Unit Testing
- [ ] Dockerize the project
- [ ] Role based granular authorisation of CRUD action were possible
- [ ] New feature add and enhancement

**Other dependent repos** \
UI- https://github.com/buddhagrg/school-admin-frontend \
DB- https://github.com/buddhagrg/school-admin-db
