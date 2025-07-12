import { Routes } from '@angular/router';
import { Lab } from './lab/lab';

export const routes: Routes = [
  {
    path: '',
    component: Lab,
  },
  {
    path: '**',
    component: Lab,
  },
];
