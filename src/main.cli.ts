#!/usr/bin/env node
import { Container } from 'inversify';
import { CLIApplication, createCliApplicationContainer, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';
import 'reflect-metadata';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { Component } from './shared/types/index.js';

async function bootstrap(): Promise<void> {
  const container = new Container();
  createCliApplicationContainer(container);
  createUserContainer(container);
  createOfferContainer(container);

  const cliApplication = container.get<CLIApplication>(Component.CliApplication);

  cliApplication.registerCommand([
    container.get<HelpCommand>(Component.HelpCommand),
    container.get<VersionCommand>(Component.VersionCommand),
    container.get<ImportCommand>(Component.ImportCommand),
    container.get<GenerateCommand>(Component.GenerateCommand),
  ]);

  await cliApplication.processCommand(process.argv);
}


bootstrap();
