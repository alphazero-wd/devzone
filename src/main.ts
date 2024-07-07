import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: true,
  });

  const redisClient = createClient({ url: configService.get('REDIS_URL') });
  await redisClient.connect();

  const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: configService.get('NODE_ENV') === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(5000);
}
bootstrap();
