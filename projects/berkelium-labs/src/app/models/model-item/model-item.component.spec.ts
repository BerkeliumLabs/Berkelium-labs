import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelItemComponent } from './model-item.component';

describe('ModelItemComponent', () => {
  let component: ModelItemComponent;
  let fixture: ComponentFixture<ModelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
