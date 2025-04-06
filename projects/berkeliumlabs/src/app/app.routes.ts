import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ModelsComponent } from './models/models.component';
import { SettingsComponent } from './settings/settings.component';
import { ModelCardComponent } from './models/model-card/model-card.component';

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
    path: 'models/:modelId',
    component: ModelCardComponent,
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
