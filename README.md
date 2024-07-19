# Full Stack Template

## Overview

This is a unit-tested full stack template to quickly bootstrap a web-based project.

Everything covered in the template:

1. Creating new account
2. Logging in
3. Confirming email account
4. Handling forgot and resetting password
5. Account settings

You can easily change the code based on the specific demands of the projects.

## Tech stack

- Frontend: Next.js (app directory)
- Backend: NestJS
- Database: PostgreSQL
- Cache: Redis
- Storage: Amazon S3

The tech stack uses cutting-edge technologies such as Next.js instead of traditional React for better app performance and SEO. Whereas the backend is completely separate from the frontend, making it highly secure and scalable. Along with PostgreSQL as the primary database, Redis is used for storing user sessions and confirmation tokens due to its sub-milliseconds queries. Finally, Amazon S3 is a highly viable option for storing files, specifically avatars in this template as most apps have this feature, but you can store more file-related objects in an S3 bucket.

## Getting started

### Prerequisites

Make sure you have the following installed

1. [NodeJS](https://nodejs.org) 22.5.0 (older versions may have issues when testing with `FormData`)
2. [Docker](https://docker.com)
3. yarn (the package manager used in the template)

Clone the project

```
git clone https://github.com/alphazero-wd/full-stack-template.git
```

### Frontend

From the root of the project, go to the `client/` directory and install all the necessary dependencies

```bash
cd client/
yarn
```

Create a `.env` file and add all of the following variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMAGE_HOST=<bucket>.s3.<region>.amazonaws.com
```

_Optionally_, you can run all the unit tests

```bash
yarn test
```

Start the app

```bash
yarn dev
```

Open the app on [http://localhost:3000](http://localhost:3000)

### Backend

From the root of the project, go to the `server/` directory and install all the necessary dependencies

```bash
cd server/
yarn
```

Create a `.env` file and add all of the following variables

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/nestjs-auth # change based on compose.yml
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_SECRET=s3cr3t
CORS_ORIGIN=http://localhost:3000 # the frontend url
CACHE_TTL=900 # in seconds e.g. 15 minutes
MAIL_FROM=noreply@example.com
MAIL_TRANSPORT=smtp://<username>:<password>@<host>
AWS_REGION=<s3-bucket-region>
AWS_BUCKET_NAME=<s3-bucket-name>
AWS_OBJECT_DEST=/ # the directory in the S3 bucket to which the file will be uploaded
```

Run Docker compose (containing PostgreSQL and Redis) in the background

```bash
docker compose up -d
```

_Optionally_, you can run all the unit tests

```bash
yarn test
```

Start the app

```bash
yarn start:dev
```

The server should be up and running.

## More to be added

1. Rate limiting for sending emails
2. Social login (Google, GitHub)
3. MFA and SSO
