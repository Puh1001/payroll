export interface UserPayload {
  sub: string;
  roles: string[];
  branch: string;
  mainRole: string;
  displayName: string;
  email: string;
}

export interface UserInfo {
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
}
