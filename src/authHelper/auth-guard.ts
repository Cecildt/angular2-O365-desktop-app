import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthHelper } from "../authHelper/authHelper";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthHelper, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isUserAuthenticated()) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}