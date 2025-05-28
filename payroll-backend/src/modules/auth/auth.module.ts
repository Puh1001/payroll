import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LdapStrategy } from '../../common/strategies/ldap.strategy';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { RefreshStrategy } from '../../common/strategies/refresh.strategy';
import { LdapExceptionFilter } from '../../common/filters/ldap-exception.filter';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LdapStrategy,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: APP_FILTER,
      useClass: LdapExceptionFilter,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
