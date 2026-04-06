import { User } from './user.type.js';

export type Comment = {
  text: string;
  datePublication: string;
  rating: number;
  author: User;
}
