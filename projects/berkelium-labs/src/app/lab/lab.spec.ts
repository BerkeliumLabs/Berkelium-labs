import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab } from './lab';

describe('Lab', () => {
  let component: Lab;
  let fixture: ComponentFixture<Lab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
