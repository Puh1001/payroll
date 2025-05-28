import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('ldap'))
  @Post('login')
  @ApiOperation({ summary: 'User login with LDAP' })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials',
    examples: {
      example1: {
        value: {
          username: 'sAMAccountName',
          password: 'your_password',
        },
        summary: 'Example login credentials',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        accessToken: { type: 'string', description: 'JWT access token' },
        refreshToken: { type: 'string', description: 'JWT refresh token' },
        user: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Login name (sAMAccountName)',
            },
            email: {
              type: 'string',
              description: 'Login email (userPrincipalName)',
            },
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
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req) {
    return this.authService.loginViaLdap(req.user);
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }
}
