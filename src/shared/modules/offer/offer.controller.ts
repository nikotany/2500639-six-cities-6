import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { prepareOffer } from '../../helpers/offer.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { StatusCodes } from 'http-status-codes';
import { CreateCommentDto } from '../comment/index.js';

type OfferIdParam = {
  offerId: string;
}

type OfferCityParam = {
  city: string;
}

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ){
    super(logger);

    this.logger.info('Register routes for OfferController...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.find});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.getById});
    this.addRoute({path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.addToFavorite});
    this.addRoute({path: '/:offerId/favorite', method: HttpMethod.Delete, handler: this.deleteFromFavorite});
    this.addRoute({path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getComments});
    this.addRoute({path: '/:offerId/comments', method: HttpMethod.Post, handler: this.createComment});
  }

  private getValidLimit(limit?: number): number | undefined {
    return limit !== undefined && !Number.isNaN(limit) && limit > 0 ? limit : undefined;
  }

  public async find(req: Request, res: Response): Promise<void> {
    const query = req.query as RequestQuery;
    const offers = await this.offerService.findAll(this.getValidLimit(query.limit));
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateOfferDto;
    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const body = req.body as UpdateOfferDto;
    const existOffer = await this.offerService.findById(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(params.offerId, body);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const existOffer = await this.offerService.findById(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);

    this.noContent(res, null);
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const offerId = params.offerId.trim();
    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(existOffer)));
  }

  private getUserId(req: Request): string {
    const userId = req.headers['x-user-id'];
    const value = Array.isArray(userId) ? userId[0] : userId;

    if (!value) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized user',
        'OfferController',
      );
    }

    return value;
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const offers = await this.offerService.findFavorites(userId);
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async addToFavorite(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const userId = this.getUserId(req);
    const existOffer = await this.offerService.exists(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    await this.offerService.addToFavorite(params.offerId, userId);
    const result = await this.offerService.findById(params.offerId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async deleteFromFavorite(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const userId = this.getUserId(req);
    const existOffer = await this.offerService.exists(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    await this.offerService.deleteFromFavorite(params.offerId, userId);
    const result = await this.offerService.findById(params.offerId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, prepareOffer(result)));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferCityParam;
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers.map((offer) => prepareOffer(offer))));
  }

  public async getComments(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const existOffer = await this.offerService.findById(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, comments);
  }

  public async createComment(req: Request, res: Response): Promise<void> {
    const params = req.params as OfferIdParam;
    const body = req.body as CreateCommentDto;
    const existOffer = await this.offerService.exists(params.offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} mot found`,
        'OfferController'
      );
    }

    const userId = this.getUserId(req);
    const result = await this.commentService.create({
      ...body,
      offerId: params.offerId,
      authorId: userId
    });

    await this.offerService.incCountComment(params.offerId);
    await this.offerService.recalcRating(params.offerId);
    this.created(res, result);
  }
}
