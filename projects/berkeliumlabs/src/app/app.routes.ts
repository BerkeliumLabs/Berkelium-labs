import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: ChatComponent,
  },
];
