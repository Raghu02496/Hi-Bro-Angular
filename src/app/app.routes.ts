import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Auth } from './auth/auth';
import { Cases } from './cases/cases';

export const routes: Routes = [
    {
        path : '', redirectTo : 'login', pathMatch: 'full'
    },
    {
        path : 'case/:id', component : Game, canMatch : []
    },
    {
        path : 'cases', component : Cases
    },
    {
        path : 'login', component : Auth
    }
];
