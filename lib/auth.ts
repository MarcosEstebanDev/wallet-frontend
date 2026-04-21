import Cookies from 'js-cookie';

export interface AuthUser {
  userId: string;
  token: string;
}

export function saveAuth(data: AuthUser) {
  Cookies.set('token', data.token, { expires: 7, sameSite: 'lax' });
  Cookies.set('userId', data.userId, { expires: 7, sameSite: 'lax' });
}

export function getToken(): string | undefined {
  return Cookies.get('token');
}

export function getUserId(): string | undefined {
  return Cookies.get('userId');
}

export function clearAuth() {
  Cookies.remove('token');
  Cookies.remove('userId');
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('token');
}
