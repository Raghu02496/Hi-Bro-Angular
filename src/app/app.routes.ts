import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Auth } from './auth/login/login';
import { Cases } from './cases/cases';
import { Chat } from './chat/chat';
import { checkLoggedInGuard } from './check-logged-in-guard';

export const routes: Routes = [
    {
        path : '', redirectTo : 'login', pathMatch: 'full'
    },
    {
        path : 'app',
        children:[
            {
                path : 'case/:id', component : Game, 
            },
            {
                path : 'cases', component : Cases
            },
            {
                path : 'chat', component : Chat
            }
        ],
        canMatch : [checkLoggedInGuard]
    },
    {
        path : 'login', component : Auth
    }
];
