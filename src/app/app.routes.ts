import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Auth } from './auth/auth';
import { Cases } from './cases/cases';
import { Chat } from './chat/chat';
import { checkLoggedInGuard } from './check-logged-in-guard';

export const routes: Routes = [
    {
        path : '', redirectTo : 'login', pathMatch: 'full'
    },
    {
        path : 'case/:id', component : Game, canMatch : [checkLoggedInGuard]
    },
    {
        path : 'cases', component : Cases, canMatch : [checkLoggedInGuard]
    },
    {
        path : 'login', component : Auth
    },
    {
        path : 'chat', component : Chat, canMatch : [checkLoggedInGuard]
    }
];
