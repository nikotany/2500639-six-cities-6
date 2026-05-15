import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel, CommentService, DefaultCommentService } from './index.js';
import { Controller } from '../../libs/rest/index.js';
import CommentController from './comment.controller.js';

export function createCommentContainer(container: Container) {
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();
}
