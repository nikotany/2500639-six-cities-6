import { Conveniences, Location, OfferType } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public datePublication!: Date;
  public city!: string;
  public previewPath!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavourites!: boolean;
  public rating!: number;
  public type!: OfferType;
  public countRoom!: number;
  public countGuest!: number;
  public rentalPrice!: number;
  public conveniences!: Conveniences[];
  public authorId!: string;
  public commentCount!: number;
  public location!: Location;
}
