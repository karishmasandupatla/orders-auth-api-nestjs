import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
