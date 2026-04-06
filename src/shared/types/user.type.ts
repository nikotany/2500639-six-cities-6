export enum UserType{
  Ordinary = 'Ordinary',
  Pro = 'Pro'
}

export type User = {
  name: string;
  email: string;
  avatarPath?: string;
  type: UserType;
}
