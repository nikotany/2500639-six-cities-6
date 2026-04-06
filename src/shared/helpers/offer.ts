import { Conveniences, Offer, OfferType, UserType, CityName } from '../types/index.js';

export function createOffer(offerData: string): Offer{
  const [
    title, description, datePublication, city, previewPath, images,
    isPremium, isFavorite, rating, type, countRoom, countGuest, rentalPrice, conveniences,
    authorName, authorEmail, authorAvatarPath, authorPassword, authorType, commentsCount, location
  ] = offerData.replace('\n', '').split('\t');

  const offerLocation = {
    latitude: Number.parseFloat(location.split(',')[0]),
    longitude: Number.parseFloat(location.split(',')[1])
  };

  const author = {
    name: authorName,
    email: authorEmail,
    avatarPath: authorAvatarPath,
    password: authorPassword,
    type: UserType[authorType as keyof typeof UserType]
  };

  return{
    title,
    description,
    datePublication: new Date(datePublication),
    city: CityName[city as keyof typeof CityName],
    previewPath,
    images: images.split(','),
    isPremium: isPremium === 'true',
    isFavourites: isFavorite === 'true',
    rating: Number.parseFloat(rating),
    type: OfferType[type as keyof typeof OfferType],
    countRoom: Number.parseInt(countRoom, 10),
    countGuest: Number.parseInt(countGuest, 10),
    rentalPrice: Number.parseInt(rentalPrice, 10),
    conveniences: conveniences.split(',').map((convenience) => Conveniences[convenience as keyof typeof Conveniences]),
    author,
    commentCount: Number.parseInt(commentsCount, 10),
    location: offerLocation
  };
}
