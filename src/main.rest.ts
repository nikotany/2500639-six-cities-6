import { RestApplication } from './rest/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { RestConfig, RestShcema, Config} from './shared/libs/config/index.js';
import 'reflect-metadata';


async function bootstrap() {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestShcema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
