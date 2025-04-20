import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ModelsComponent } from './models/models.component';
import { ModelCardComponent } from './models/model-card/model-card.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'chat/:chatId',
    component: ChatComponent,
  },
  {
    path: 'models',
    component: ModelsComponent,
  },
  {
    path: 'models/:modelId',
    component: ModelCardComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    component: ChatComponent,
  },
];
