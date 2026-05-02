import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenHelper } from '../TokenHelper';
import { Router } from '@angular/router';

export const AdminGuard: CanActivateFn = () => {
  const tokenHelper = inject(TokenHelper);
  const router = inject(Router);

  const userString = tokenHelper.getUser();
  const user = userString ? JSON.parse(userString) : null;

  // لو مفيش يوزر أو مش أدمن → حوله للصفحة الرئيسية
  if (!user || user.isAdmin !== true) {
    return false;
  }

  return true;
};
