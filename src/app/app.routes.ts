import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Auth } from './auth/auth';

export const routes: Routes = [
    {
        path : '', redirectTo : 'login', pathMatch: 'full'
    },
    {
        path : 'detective', component : Game, canMatch : []
    },
    {
        path : 'login', component : Auth
    }
];
