import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DeleteResult } from 'mongoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DeleteResult>;
  findAll(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorite(offerId: string, userId: string): Promise<void>;
  deleteFromFavorite(offerId: string, userId: string): Promise<void>;
  recalcRating(offerId: string): Promise<void>;
  incCountComment(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
