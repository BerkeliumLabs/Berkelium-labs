import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { StateManagerService } from '../../services/state-manager.service';
import { BkChat } from '../../chat/chat.component';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'berkeliumlabs-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1, width: 'auto', overflow: 'hidden' })),
      state('false', style({ opacity: 0, width: 0, overflow: 'hidden' })),
      transition('false <=> true', animate('500ms ease-in-out')),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  private _layoutService = inject(LayoutService);
  private router = inject(Router);
  private stateManager = inject(StateManagerService);
  private _dbService = inject(IndexedDBService);

  themeMode: 'light' | 'dark' = 'light';
  isCollapsed = false;
  chats: Signal<BkChatHistory[]> = computed(() => {
    return this.stateManager.chats();
  });

  ngOnInit(): void {
    this.initNavbar();
  }

  private initNavbar(): void {
    this._dbService.getAll<BkChat>('chats').subscribe((chats) => {
      if (chats) {
        const chatCodes: any[] = [];
        chats.forEach((chat) => {
          const item: BkChatHistory = {
            id: chat.id,
            message: chat.messages[0].message,
          }
          chatCodes.push(item);
        });
        this.stateManager.chats.set(chatCodes);
      }
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme(): void {
    this._layoutService.toggleTheme();
    this.themeMode = this._layoutService.themeMode();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

export interface BkChatHistory {
  id: string;
  message: string;
}