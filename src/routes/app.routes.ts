
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Home } from "../home/home";
import { Login } from "../login/login";
import { Files } from "../files/files";
import { Profile } from "../profile/profile";
import { Contacts } from "../contacts/contacts";
import { Groups } from "../groups/groups";
import { Mails } from "../mails/mails";
import { Notes } from "../notes/notes";
import { Tasks } from "../tasks/tasks";
import { Trending } from "../trending/trending";
import { Users } from "../users/users";
import { AuthGuard } from '../authHelper/auth-guard';

const appRoutes: Routes = [
    { path: "", component: Home },
    { component: Home, path: "/home", canActivate: [AuthGuard] },
    { component: Login, path: "/login" },
    { component: Files, path: "/files", canActivate: [AuthGuard] },
    { component: Groups, path: "/groups", canActivate: [AuthGuard] },
    { component: Contacts, path: "/contacts", canActivate: [AuthGuard] },
    { component: Mails, path: "/mails", canActivate: [AuthGuard] },
    { component: Notes, path: "/notes", canActivate: [AuthGuard] },
    { component: Tasks, path: "/tasks", canActivate: [AuthGuard] },
    { component: Trending, path: "/trending", canActivate: [AuthGuard] },
    { component: Users, path: "/users", canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);