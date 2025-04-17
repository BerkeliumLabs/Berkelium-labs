import { TestBed } from '@angular/core/testing';

import { ModelManagerService } from './model-manager.service';

describe('ModelManagerService', () => {
  let service: ModelManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
