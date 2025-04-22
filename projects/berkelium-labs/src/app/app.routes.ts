import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ModelsComponent } from './models/models.component';
import { ModelCardComponent } from './models/model-card/model-card.component';
import { SettingsComponent } from './settings/settings.component';
import { ToolsComponent } from './tools/tools.component';
import { SummarizationComponent } from './tools/summarization/summarization.component';
import { Text2textGenerationComponent } from './tools/text2text-generation/text2text-generation.component';
import { TranslationComponent } from './tools/translation/translation.component';
import { ImageToImageComponent } from './tools/image-to-image/image-to-image.component';

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
    path: 'tools',
    component: ToolsComponent,
  },
  {
    path: 'tools/summarization',
    component: SummarizationComponent,
  },
  {
    path: 'tools/text-to-text',
    component: Text2textGenerationComponent,
  },
  {
    path: 'tools/translation',
    component: TranslationComponent,
  },
  {
    path: 'tools/image-to-image',
    component: ImageToImageComponent,
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
