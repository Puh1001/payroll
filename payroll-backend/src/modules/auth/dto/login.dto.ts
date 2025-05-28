import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe',
    description: 'Tên đăng nhập (sAMAccountName)',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
