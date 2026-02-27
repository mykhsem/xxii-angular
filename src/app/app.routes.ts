import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: ':type',
    loadComponent: () => import('./shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./shell/shell.component').then((m) => m.ShellComponent),
      },
    ],
  },
];
