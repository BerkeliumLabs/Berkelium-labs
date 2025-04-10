import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSettingsComponent } from './prompt-settings.component';

describe('PromptSettingsComponent', () => {
  let component: PromptSettingsComponent;
  let fixture: ComponentFixture<PromptSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
