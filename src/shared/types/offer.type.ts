import { CityName } from './city-name.enum.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export enum Conveniences{
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export enum OfferType{
  apartment = 'apartment',
  house = 'house',
  room = 'room',
  hotel = 'hotel',
}

export type Offer = {
  title: string;
  description: string;
  datePublication: Date;
  city: CityName;
  previewPath: string;
  images: string[];
  isPremium: boolean;
  isFavourites: boolean;
  rating: number;
  type: OfferType;
  countRoom: number;
  countGuest: number;
  rentalPrice: number;
  conveniences: Conveniences[];
  author: User;
  commentCount: number;
  location: Location;
}
