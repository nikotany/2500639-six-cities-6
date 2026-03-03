import { FileReader } from './file-reader.interface.js';
import { Conveniences, Offer, OfferType, UserType } from '../../types/index.js';
import { readFileSync } from 'node:fs';

export class TSVFileReader implements FileReader{
  private rawData = '';

  constructor(
    private readonly fileName: string
  ){}

  public read(): void {
    this.rawData = readFileSync(this.fileName, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, publicationDate, city, cityLatitude, cityLongitude, previewPath, images, isPremium, isFavorites, rating, type, countRoom,countGuest,
        rentalPrice, conveniences, authorName, authorEmail, authorAvatarPath, authorPassword, authorType, commentsCount, latitude, longitude,
      ]) => ({
        title,
        description,
        datePublication: new Date(publicationDate),
        city: {
          name: city,
          location: {
            latitude: Number.parseFloat(cityLatitude),
            longitude: Number.parseFloat(cityLongitude)
          }
        },
        previewPath,
        images: images.split(','),
        isPremium: isPremium === 'true',
        isFavourites: isFavorites === 'true',
        rating: Number.parseFloat(rating),
        type: OfferType[type as keyof typeof OfferType],
        countRoom: Number.parseInt(countRoom, 10),
        countGuest: Number.parseInt(countGuest, 10),
        rentalPrice: Number.parseInt(rentalPrice, 10),
        conveniences: conveniences.split(',').map((convenience) => Conveniences[convenience as keyof typeof Conveniences]),
        author: {
          name: authorName,
          email: authorEmail,
          avatarPath: authorAvatarPath,
          password: authorPassword,
          type: UserType[authorType as keyof typeof UserType],
        },
        commentCount: Number.parseInt(commentsCount, 10),
        location: {
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
        }
      }));
  }
}
