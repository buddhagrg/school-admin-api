## Repo Overview

This is for api for school-admin bootstrapped by `express-js`.

Currently, [resend](https://resend.com/) is used for email sending during registration, password setup and password change. So, you first need an api key from resend and use in the env **RESEND_API_KEY**. After that, you need to create a **.env** file with few more envs like in the [.env.example](https://github.com/buddhagrg/school-admin-api/blob/master/.env.example)

## Scripts available

In the project directory, you can run; \
`npm install` - Install dependencies \
`npm run dev` - Runs the api on the provided port on your local machine to be used by frontend

## Todos

- [x] Live deployment
- [ ] System stabilization
- [ ] Unit Testing
- [ ] Dockerize the project
- [x] Role based granular authorisation of CRUD action were possible
- [ ] New feature add and enhancement

## Other dependent repos

UI- https://github.com/buddhagrg/school-admin-frontend \
DB- https://github.com/buddhagrg/school-admin-db
