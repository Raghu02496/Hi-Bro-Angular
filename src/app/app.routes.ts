import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Auth } from './auth/auth';
import { inject } from '@angular/core';
import { ApiService } from './api-service';

export const routes: Routes = [
    {
        path : '', redirectTo : 'login', pathMatch: 'full'
    },
    {
        path : 'detective', component : Game, canMatch : [
            ()=>{
                const apiService = inject(ApiService);
                const hasAccess = apiService.isLoggedIn
                return hasAccess
            }
        ]
    },
    {
        path : 'login', component : Auth
    }
];
