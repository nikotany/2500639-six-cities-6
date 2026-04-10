import { ConsoleLogger } from '../shared/libs/logger/console.logger.js';
import { Logger } from '../shared/libs/logger/index.js';
import { CLIApplication } from './cli-application.js';
import { Container } from 'inversify';
import { Component } from '../shared/types/index.js';
import { VersionCommand } from './command/version.command.js';
import { ImportCommand } from './command/import.command.js';
import { GenerateCommand } from './command/generate.command.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { HelpCommand } from './command/help.command.js';

export function createCliApplicationContainer(container: Container): void {
  container.bind<CLIApplication>(Component.CliApplication).to(CLIApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(ConsoleLogger).inSingletonScope();
  container.bind<HelpCommand>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  container.bind<VersionCommand>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  container.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  container.bind<GenerateCommand>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
}
