import { TestBed } from '@angular/core/testing';

import { DynamicDialogService } from './dynamic-dialog.service';

describe('DynamicDialogService', () => {
  let service: DynamicDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
