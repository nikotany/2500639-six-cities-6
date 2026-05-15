import { IsNumber, Max, Min } from 'class-validator';
import { OfferValidationMessage } from './create-offer.messages.js';

export class LocationDto {
  @IsNumber({}, {message: OfferValidationMessage.latitude.invalidFormat})
  @Min(-90, {message: OfferValidationMessage.latitude.rangeField})
  @Max(90, {message:  OfferValidationMessage.latitude.rangeField})
  public latitude!: number;

  @IsNumber({}, {message: OfferValidationMessage.longitude.invalidFormat})
  @Min(-180, {message: OfferValidationMessage.longitude.rangeField})
  @Max(180, {message:  OfferValidationMessage.longitude.rangeField})
  public longitude!: number;
}
