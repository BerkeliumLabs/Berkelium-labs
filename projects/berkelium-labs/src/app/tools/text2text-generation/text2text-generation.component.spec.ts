import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Text2textGenerationComponent } from './text2text-generation.component';

describe('Text2textGenerationComponent', () => {
  let component: Text2textGenerationComponent;
  let fixture: ComponentFixture<Text2textGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Text2textGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Text2textGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
