import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-ldapauth-fork';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private configService: ConfigService) {
    super({
      server: {
        url: configService.get('LDAP_URL'),
        bindDN: configService.get('LDAP_BIND_DN'),
        bindCredentials: configService.get('LDAP_BIND_CREDENTIALS'),
        searchBase: configService.get('LDAP_SEARCH_BASE'),
        searchFilter: configService.get('LDAP_SEARCH_FILTER'),
      },
    });
  }

  async validate(user: any) {
    if (!user) {
      throw new UnauthorizedException();
    }

    // Extract OU from distinguishedName
    const dn = user.distinguishedName || '';
    const ouMatch = dn.match(/OU=([^,]+)/);
    const mainRole = ouMatch ? ouMatch[1] : '';

    // Map LDAP user to application user with required fields
    return {
      // Basic Information
      username: user.sAMAccountName, // Login name
      email: user.userPrincipalName, // Login email
      displayName: user.displayName, // Display name
      givenName: user.givenName, // First name
      commonName: user.cn, // Common name
      description: user.description, // Description (includes resignation status)

      // Location Information
      distinguishedName: user.distinguishedName, // Full DN path
      mainRole: mainRole, // Primary role from OU
      department: user.department || '',
      location: user.physicalDeliveryOfficeName || '',

      // Additional fields for JWT payload
      roles: user.memberOf || [],
      branch: mainRole || 'HQ',
    };
  }
}
