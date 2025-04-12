import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'berkeliumlabs-settings',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private settingsFormUnsubscribe = new Subject<void>();
  private initialFormValue!: BkAppSettings;
  settingsForm!: FormGroup;
  formValueChanged = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    window.berkelium
      .readAppSettings()
      .then((settings) => {
        this.settingsForm = new FormGroup({
          cacheDir: new FormControl(settings?.cacheDir),
        });

        this.initialFormValue = this.settingsForm.value;

        this.settingsForm.valueChanges
          .pipe(takeUntil(this.settingsFormUnsubscribe))
          .subscribe((currentValue) => {
            this.formValueChanged =
              JSON.stringify(currentValue) !==
              JSON.stringify(this.initialFormValue);
          });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  choseCacheDir() {
    window.berkelium.setCacheDir().then((data) => {
      if (!data?.canceled) {
        this.settingsForm.setValue({
          cacheDir: data?.filePaths[0],
        });
      }
    });
  }

  saveForm() {
    window.berkelium
      .writeAppSettings(this.settingsForm.value)
      .then(() => {
        window.berkelium.showNotification({
          title: 'Settings saved!',
          body: `Settings saved successfully.`,
        });
        this.initialFormValue = this.settingsForm.value;
        this.formValueChanged = false;
      })
      .catch((reason) => {
        window.berkelium.showNotification({
          title: 'Settings save failed!',
          body: `Settings save failed.\n${reason}`,
        });
        console.error(reason);
      });
  }
}
