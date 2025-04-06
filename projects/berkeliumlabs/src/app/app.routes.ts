import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ModelsComponent } from './models/models.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat/:chatId',
    component: ChatComponent,
    pathMatch: 'full',
  },
  {
    path: 'models',
    component: ModelsComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: SettingsComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: ChatComponent,
  },
];
