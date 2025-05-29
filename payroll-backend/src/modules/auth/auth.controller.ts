import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { UserInfo } from './types/auth.types';
import { UserInfoDto } from './dto/user-info.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.loginViaLdap(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserInfoDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<UserInfo> {
    return this.authService.getUserInfo(req.user.sub);
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: TokenDto,
  })
  async refresh(@Request() req): Promise<TokenDto> {
    return this.authService.refresh(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  async logout(@Request() req): Promise<LogoutResponseDto> {
    return this.authService.logout(req.user.sub);
  }
}
