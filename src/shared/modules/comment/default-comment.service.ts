import { inject, injectable } from 'inversify';
import { Component, Sort } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentService, CreateCommentDto, DEFAULT_COUNT_COMMENTS } from './index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ){}

  public async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    return result.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId}).populate('authorId').sort({createdAt: Sort.Desc}).limit(DEFAULT_COUNT_COMMENTS).exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }
}
