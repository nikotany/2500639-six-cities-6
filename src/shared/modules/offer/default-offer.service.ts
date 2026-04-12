import { inject, injectable } from 'inversify';
import { Component, Sort } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService, UpdateOfferDto } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { DeleteResult } from 'mongoose';
import { DEFAULT_COUNT_OFFER, DEFAULT_COUNT_PREMIUM_OFFER } from './offer.constants.js';
import { UserEntity } from '../user/user.entity.js';
import { CommentEntity } from '../comment/comment.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOneAndUpdate({_id: offerId}, dto, {new: true});
  }

  public async deleteById(offerId: string): Promise<DeleteResult> {
    return this.offerModel.deleteOne({_id: offerId}).exec();
  }

  public async findAll(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({}).sort({ createdAt: Sort.Desc}).limit(DEFAULT_COUNT_OFFER).exec();
  }

  public async findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({'city': cityName, isPremium: true}).sort({createdAt: Sort.Desc}).limit(DEFAULT_COUNT_PREMIUM_OFFER).exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favoriteOffers = await this.offerModel.find({favoriteByUsers: userId}).exec();
    return favoriteOffers;
  }

  public async addToFavorite(offerId: string, userId: string): Promise<void> {
    await this.offerModel.updateOne({_id: offerId}, {$addToSet: {favoriteByUsers: userId}}).exec();
    await this.userModel.updateOne({_id: userId}, {$addToSet: {favoriteOffers: offerId}}).exec();
  }

  public async deleteFromFavorite(offerId: string, userId: string): Promise<void> {
    await this.offerModel.updateOne({_id: offerId}, {$pull: {favoriteByUsers: userId}}).exec();
    await this.userModel.updateOne({_id: userId}, {$pull: {favoriteOffers: offerId}}).exec();
  }

  public async recalcRating(offerId: string): Promise<void> {
    const avgRating = await this.commentModel.aggregate([
      {
        $match: {
          offerId: offerId
        }
      },
      {
        $group: {
          _id: '$offerId',
          avgRating: { $avg: '$rating' }
        }
      },
    ]).exec();
    const result = avgRating.length > 0 ? avgRating[0].avgRating : 0;
    await this.offerModel.findByIdAndUpdate(offerId, {rating: result});
  }

  public async incCountComment(offerId: string): Promise<void> {
    await this.offerModel.updateOne({_id: offerId}, {$inc: {commentsCount: 1}}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }
}
