import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from "../auth/auth.service";
import { ToastComponent } from "../toast/toast.component";
import { USER_MESSAGES } from "../messages/messages";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private toast: ToastComponent, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.auth.isUserAuthenticated().then(() => {
      return true;
    }).catch((err) => {
      this.toast.show(USER_MESSAGES.not_authenticated + " " + err);
      this.router.navigate(['login']);
      return false;
    });

    this.router.navigate(['login']);
    return false;
  }
}