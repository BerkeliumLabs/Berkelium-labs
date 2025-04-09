import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from "../components/dropdown/dropdown.component";

@Component({
  selector: 'berkeliumlabs-chat',
  imports: [DropdownComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  settings!: BkAppSettings;
  availableModels: BkDropdownOptions[] = [];

  ngOnInit(): void {
    this.initChat()
  }

  initChat(): void {
    window.berkelium
      .readAppSettings()
      .then((settings) => {
        if (settings) {
          this.settings = settings;
          if (settings.models) {
            settings.models.forEach((model) => {
              const modelOption: BkDropdownOptions = {
                id: model,
                label: model
              };

              this.availableModels.push(modelOption);
            });
          }
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
}
