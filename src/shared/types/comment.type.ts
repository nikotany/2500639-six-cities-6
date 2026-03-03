import { User } from './user.type';

export type Comment = {
  text: string;
  datePublication: string;
  rating: number;
  author: User;
}
