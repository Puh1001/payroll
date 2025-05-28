import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      username: { type: 'string', description: 'Login name (sAMAccountName)' },
      email: { type: 'string', description: 'Login email (userPrincipalName)' },
      displayName: { type: 'string', description: 'Display name' },
      givenName: { type: 'string', description: 'First name' },
      commonName: { type: 'string', description: 'Common name' },
      description: {
        type: 'string',
        description: 'Description (includes resignation status)',
      },
      distinguishedName: { type: 'string', description: 'Full DN path' },
      mainRole: { type: 'string', description: 'Primary role from OU' },
      department: { type: 'string', description: 'Department' },
      location: { type: 'string', description: 'Office location' },
      roles: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of group memberships',
      },
      branch: { type: 'string', description: 'Branch/OU' },
    },
  })
  user: {
    username: string;
    email: string;
    displayName: string;
    givenName: string;
    commonName: string;
    description: string;
    distinguishedName: string;
    mainRole: string;
    department: string;
    location: string;
    roles: string[];
    branch: string;
  };
}
