import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserType } from '../../../types/user.type.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({message: CreateUserMessages.name.invalidFormat})
  @Length(1, 15, {message: CreateUserMessages.name.lengthFiend})
  public name!: string;

  @IsEmail({}, {message: CreateUserMessages.email.invalidFormat})
  public email!: string;

  @IsOptional()
  @Matches(/\.(jpg|png)$/i, {message: CreateUserMessages.avatarPath.invalidFormat})
  public avatarPath?: string;

  @Length(6, 12, {message: CreateUserMessages.password.lengthFiend})
  @IsString({message: CreateUserMessages.password.invalidFormat})
  public password!: string;

  @IsEnum(UserType, {message: CreateUserMessages.type.invalidFormat})
  public type!: UserType;
}
