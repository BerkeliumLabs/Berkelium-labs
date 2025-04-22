import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizationComponent } from './summarization.component';

describe('SummarizationComponent', () => {
  let component: SummarizationComponent;
  let fixture: ComponentFixture<SummarizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
