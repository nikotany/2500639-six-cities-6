import { IsEmail, IsString, Length } from 'class-validator';
import { CreateLoginUserMessages } from './login-user.messages.js';

export class LoginUserDto{
  @IsEmail({}, {message: CreateLoginUserMessages.email.invalidFormat})
  public email!: string;

  @Length(6, 12, {message: CreateLoginUserMessages.password.lengthFiend})
  @IsString({message: CreateLoginUserMessages.password.invalidFormat})
  public password!: string;
}
