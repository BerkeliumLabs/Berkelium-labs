import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCardComponent } from './model-card.component';

describe('ModelCardComponent', () => {
  let component: ModelCardComponent;
  let fixture: ComponentFixture<ModelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
