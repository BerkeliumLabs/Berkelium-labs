import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageToImageComponent } from './image-to-image.component';

describe('ImageToImageComponent', () => {
  let component: ImageToImageComponent;
  let fixture: ComponentFixture<ImageToImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageToImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageToImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
