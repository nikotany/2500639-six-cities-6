import { Conveniences, Offer, OfferType, UserType } from '../types/index.js';

export function createOffer(offerData: string): Offer{
  const [
    title, description, datePublication, cityName, cityLatitude, cityLongitude, previewPath, images,
    isPremium, isFavorite, rating, type, countRoom, countGuest, rentalPrice, conveniences,
    authorName, authorEmail, authorAvatarPath, authorPassword, authorType, commentsCount,
    latitude, longitude
  ] = offerData.replace('\n', '').split('\t');

  const location = {
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude)
  };

  const cityLocation = {
    latitude: Number.parseFloat(cityLatitude),
    longitude: Number.parseFloat(cityLongitude)
  };

  const author = {
    name: authorName,
    email: authorEmail,
    avatarPath: authorAvatarPath,
    password: authorPassword,
    type: UserType[authorType as keyof typeof UserType]
  };

  const city = {
    name: cityName,
    location: cityLocation
  };

  return{
    title,
    description,
    datePublication:new Date(datePublication),
    city,
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
    location
  };
}
