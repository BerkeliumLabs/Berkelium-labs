import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBubble } from './chat-bubble';

describe('ChatBubble', () => {
  let component: ChatBubble;
  let fixture: ComponentFixture<ChatBubble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBubble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBubble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
