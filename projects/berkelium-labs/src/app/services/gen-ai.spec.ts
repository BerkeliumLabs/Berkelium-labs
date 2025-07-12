import { TestBed } from '@angular/core/testing';

import { GenAi } from './gen-ai';

describe('GenAi', () => {
  let service: GenAi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenAi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
