import { Injectable } from '@angular/core';
import { ACCESS_TOKEN , USER } from '../../../shared/constants';

@Injectable({
    providedIn: 'root',
  })
  export class TokenStorage {
    constructor() {}
  
    saveAccessToken(token: string): void {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.setItem(ACCESS_TOKEN, token);
    }
  
    getAccessToken() {
      return localStorage.getItem(ACCESS_TOKEN);
    }
  
    clear() {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(USER);
    }

    getUserId(): number | null {
      const userId = localStorage.getItem(USER);
      return userId ? +userId : null;
    }
  }