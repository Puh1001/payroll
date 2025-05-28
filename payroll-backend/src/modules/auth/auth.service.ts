import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginViaLdap(user: any): Promise<TokenDto> {
    const payload = {
      sub: user.username,
      roles: user.roles,
      branch: user.branch,
      mainRole: user.mainRole,
      displayName: user.displayName,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(
        { sub: user.username },
        {
          secret: this.configService.get('REFRESH_SECRET'),
          expiresIn: this.configService.get('REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        givenName: user.givenName,
        commonName: user.commonName,
        description: user.description,
        distinguishedName: user.distinguishedName,
        mainRole: user.mainRole,
        department: user.department,
        location: user.location,
        roles: user.roles,
        branch: user.branch,
      },
    };
  }

  async refresh(userId: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    // Implement token revocation logic here
    // For example, add the token to a blacklist or delete from database
  }
}
