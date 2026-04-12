import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel, CommentService, DefaultCommentService } from './index.js';

export function createCommentContainer(container: Container) {
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
}
