import { TestBed } from '@angular/core/testing';

import { LrsServiceService } from './lrs-service.service';

describe('LrsServiceService', () => {
  let service: LrsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LrsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
