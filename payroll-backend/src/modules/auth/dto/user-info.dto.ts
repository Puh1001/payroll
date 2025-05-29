import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from '../types/auth.types';

export class UserInfoDto implements UserInfo {
  @ApiProperty({
    description: 'Login name (sAMAccountName)',
  })
  username: string;

  @ApiProperty({
    description: 'Login email (userPrincipalName)',
  })
  email: string;

  @ApiProperty({
    description: 'Display name',
  })
  displayName: string;

  @ApiProperty({
    description: 'First name',
  })
  givenName: string;

  @ApiProperty({
    description: 'Common name',
  })
  commonName: string;

  @ApiProperty({
    description: 'Description (includes resignation status)',
  })
  description: string;

  @ApiProperty({
    description: 'Full DN path',
  })
  distinguishedName: string;

  @ApiProperty({
    description: 'Primary role from OU',
  })
  mainRole: string;

  @ApiProperty({
    description: 'Department',
  })
  department: string;

  @ApiProperty({
    description: 'Office location',
  })
  location: string;

  @ApiProperty({
    description: 'List of group memberships',
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: 'Branch/OU',
  })
  branch: string;
}
